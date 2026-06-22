# 🔐 Reset de Senha — RetroVault

Fluxo completo de recuperação de senha em 3 etapas com código de verificação por e-mail.

---

## Arquitetura do fluxo

```
[Login] → "Esqueci a senha"
    │
    ▼
[Etapa 1] Usuário informa o e-mail
    │  POST /api/auth/password-reset/request
    │  → Gera código 6 dígitos, hasheia com bcrypt, salva no banco (15 min)
    │  → Dispara e-mail com Nodemailer/Mailtrap
    ▼
[Etapa 2] Usuário insere o código recebido
    │  POST /api/auth/password-reset/verify
    │  → Valida código contra hash no banco
    │  → Marca token como usado
    │  → Retorna resetToken temporário (10 min, em memória)
    ▼
[Etapa 3] Usuário define nova senha
    │  POST /api/auth/password-reset/confirm
    │  → Valida resetToken em memória
    │  → Atualiza senha com bcrypt no banco
    │  → Invalida resetToken
    ▼
[Sucesso] → Botão para fazer login
```

---

## Arquivos gerados

```
# Backend (apps/api/src/)
auth/
├── password-reset.dto.ts       ← DTOs validados com class-validator
├── password-reset.service.ts   ← Lógica de geração, verificação e reset
└── password-reset.controller.ts← 3 endpoints POST

mail/
├── mail.service.patch.ts       ← Adicionar método sendPasswordReset()
└── templates/
    └── password-reset.template.ts ← E-mail com código estilizado

prisma/
└── schema.patch.prisma         ← Model PasswordResetToken a adicionar

# Frontend (apps/web/src/)
components/auth/
└── password-reset-modal.tsx    ← Modal com 3 etapas + tela de sucesso

app/(auth)/login/
└── login-page.patch.tsx        ← LoginPage com modal integrado
```

---

## Passo a passo

### 1. Prisma — adicionar o model

Cole no seu `schema.prisma`:

```prisma
model PasswordResetToken {
  id        String   @id @default(cuid())
  email     String
  code      String
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([email])
}
```

Então rode:

```bash
pnpm --filter @retrovault/api exec prisma migrate dev --name add-password-reset-token
```

### 2. Backend — registrar no AuthModule

```ts
// apps/api/src/auth/auth.module.ts
import { PasswordResetController } from './password-reset.controller';
import { PasswordResetService } from './password-reset.service';

@Module({
  controllers: [AuthController, PasswordResetController],  // ← adicionar
  providers: [AuthService, PasswordResetService],           // ← adicionar
})
export class AuthModule {}
```

### 3. MailService — adicionar o método

Copie o conteúdo de `mail.service.patch.ts` para o seu `mail.service.ts` existente:
- O import do template no topo
- O método `sendPasswordReset()` na classe

### 4. Frontend — copiar o modal

Coloque `password-reset-modal.tsx` em:
```
apps/web/src/components/auth/password-reset-modal.tsx
```

### 5. LoginPage — aplicar o patch

Aplique as mudanças do `login-page.patch.tsx` na sua `LoginPage`:
- Adicionar `const [showReset, setShowReset] = useState(false)`
- Adicionar import do `PasswordResetModal`
- Substituir o `<div className="text-center mt-6">` pelo trecho com o link "Esqueci a senha" ao lado do label da senha
- Adicionar `<PasswordResetModal>` no final do JSX

---

## Segurança implementada

| Medida | Detalhe |
|--------|---------|
| Código hasheado | bcrypt salt 10 antes de salvar no banco |
| Código expira | 15 minutos |
| Código de uso único | `used: true` após verificar |
| Tokens anteriores invalidados | `updateMany used: true` no request |
| E-mail não revelado | Retorna 204 mesmo se e-mail não existe |
| Reset token em memória | Não persiste no banco, 10 min de validade |
| Senhas com bcrypt | hash antes de salvar no `user.password` |

---

## Notas para produção

- **Múltiplas instâncias**: o `resetTokens` Map em memória não funciona com
  mais de 1 instância da API. Nesse caso, substitua por uma tabela
  `PasswordResetSession` no Prisma ou use Redis.

- **Rate limiting**: adicione `@Throttle()` nos endpoints de request e verify
  para evitar brute force no código.

- **Limpeza do banco**: tokens `used: true` ou expirados se acumulam. Adicione
  um cron job com `@nestjs/schedule` para limpar periodicamente:
  ```ts
  await prisma.passwordResetToken.deleteMany({
    where: { OR: [{ used: true }, { expiresAt: { lt: new Date() } }] }
  })
  ```