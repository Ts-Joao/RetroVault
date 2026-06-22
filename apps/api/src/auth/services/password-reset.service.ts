import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { DatabaseService } from 'src/database/database.service';
import { MailService } from 'src/mail/mail.service';
import {
  RequestPasswordResetDto,
  ResetPasswordDto,
  VerifyResetCodeDto,
} from '../dto/password-reset.dto';

const CODE_EXPIRY_MINUTES = 15;
const RESET_TOKEN_EXPIRY_MINUTES = 10;

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);

  private readonly resetTokens = new Map<string, { email: string; expiresAt: Date }>();

  constructor(
    private readonly prisma: DatabaseService,
    private readonly mailService: MailService,
  ) {}

  async requestReset({ email }: RequestPasswordResetDto): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      this.logger.warn(`Reset solicitado para e-mail não cadastrado: ${email}`);
      return;
    }

    await this.prisma.passwordResetToken.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    // Gera código de 6 dígitos
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const hashedCode = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

    await this.prisma.passwordResetToken.create({
      data: { email, code: hashedCode, expiresAt },
    });

    this.logger.log(`Código de reset gerado para ${email}`);

    void this.mailService.sendPasswordReset({
      name: user.name,
      email,
      code,
    });
  }

  async verifyCode({ email, code }: VerifyResetCodeDto): Promise<{ resetToken: string }> {
    const record = await this.prisma.passwordResetToken.findFirst({
      where: { email, used: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new NotFoundException('Nenhum código de reset ativo para este e-mail.');
    }

    if (new Date() > record.expiresAt) {
      throw new BadRequestException('Código expirado. Solicite um novo.');
    }

    const isValid = await bcrypt.compare(code, record.code);
    if (!isValid) {
      throw new BadRequestException('Código inválido.');
    }

    // Marca o código como usado
    await this.prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    });

    // Gera token temporário para a etapa de nova senha
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);
    this.resetTokens.set(resetToken, { email, expiresAt });

    return { resetToken };
  }

  async resetPassword({ resetToken, password, confirmPassword }: ResetPasswordDto): Promise<void> {
    if (password !== confirmPassword) {
      throw new BadRequestException('As senhas não coincidem.');
    }

    const entry = this.resetTokens.get(resetToken);

    if (!entry) {
      throw new BadRequestException('Token de reset inválido ou expirado.');
    }

    if (new Date() > entry.expiresAt) {
      this.resetTokens.delete(resetToken);
      throw new BadRequestException('Token de reset expirado. Reinicie o processo.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { email: entry.email },
      data: { password: hashedPassword },
    });

    this.resetTokens.delete(resetToken);

    this.logger.log(`Senha redefinida com sucesso para ${entry.email}`);
  }
}