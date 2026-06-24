export interface PasswordResetEmailData {
  name: string;
  email: string;
  code: string;
}

export function passwordResetTemplate({ name, code }: PasswordResetEmailData): string {
  const year = new Date().getFullYear();

  // Quebra o código em dígitos individuais para estilizar cada um
  const digits = code.split('');

  const digitBoxes = digits
    .map(
      (d) => `
    <span style="
      display: inline-block;
      width: 44px;
      height: 56px;
      line-height: 56px;
      text-align: center;
      font-size: 28px;
      font-weight: 700;
      font-family: 'Courier New', Courier, monospace;
      background-color: #1a1a1a;
      border: 1px solid #2e2e2e;
      border-bottom: 3px solid #dc2626;
      border-radius: 8px;
      color: #ffffff;
      letter-spacing: 0;
    ">${d}</span>
  `,
    )
    .join('');

  return /* html */ `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Redefinição de senha — RetroVault</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e8e8e8;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#1a1a1a;border-radius:12px;border:1px solid #2e2e2e;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#111111;padding:32px 40px 28px;text-align:center;border-bottom:1px solid #2e2e2e;">
              <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                Retro<span style="color:#dc2626;">Vault</span>
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <p style="font-size:22px;font-weight:600;color:#ffffff;margin:0 0 12px;line-height:1.3;">
                Redefinição de senha
              </p>

              <p style="font-size:15px;color:#a0a0a0;line-height:1.7;margin:0 0 8px;">
                Olá, <strong style="color:#e8e8e8;">${name}</strong>!
              </p>

              <p style="font-size:15px;color:#a0a0a0;line-height:1.7;margin:0 0 32px;">
                Recebemos uma solicitação para redefinir sua senha. Use o código
                abaixo na tela de recuperação. Ele é válido por
                <strong style="color:#e8e8e8;">15 minutos</strong>.
              </p>

              <!-- Código -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:28px 0;background-color:#111111;border-radius:10px;border:1px solid #2e2e2e;margin-bottom:32px;">
                    <p style="font-size:11px;color:#555;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;">
                      Seu código de verificação
                    </p>
                    <div style="display:inline-flex;gap:8px;justify-content:center;">
                      ${digitBoxes}
                    </div>
                    <p style="font-size:12px;color:#444;margin:16px 0 0;">
                      Não compartilhe este código com ninguém.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
                <tr><td style="border-top:1px solid #2e2e2e;"></td></tr>
              </table>

              <!-- Instruções -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;vertical-align:top;padding-top:2px;">
                          <span style="display:inline-block;width:20px;height:20px;background-color:#1c0a0a;border:1px solid #3d1515;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:700;color:#dc2626;">1</span>
                        </td>
                        <td style="font-size:13px;color:#a0a0a0;line-height:1.6;padding-left:8px;">
                          Volte para a tela de recuperação de senha no site.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;vertical-align:top;padding-top:2px;">
                          <span style="display:inline-block;width:20px;height:20px;background-color:#1c0a0a;border:1px solid #3d1515;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:700;color:#dc2626;">2</span>
                        </td>
                        <td style="font-size:13px;color:#a0a0a0;line-height:1.6;padding-left:8px;">
                          Insira os 6 dígitos exatamente como aparecem acima.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;vertical-align:top;padding-top:2px;">
                          <span style="display:inline-block;width:20px;height:20px;background-color:#1c0a0a;border:1px solid #3d1515;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:700;color:#dc2626;">3</span>
                        </td>
                        <td style="font-size:13px;color:#a0a0a0;line-height:1.6;padding-left:8px;">
                          Crie sua nova senha e confirme.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0 24px;">
                <tr><td style="border-top:1px solid #2e2e2e;"></td></tr>
              </table>

              <p style="font-size:13px;color:#555;line-height:1.6;margin:0;">
                Se você não solicitou a redefinição de senha, ignore este e-mail.
                Sua senha <strong style="color:#6b6b6b;">não será alterada</strong> a menos que
                você complete o processo no site.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#111111;padding:24px 40px;text-align:center;border-top:1px solid #2e2e2e;">
              <p style="font-size:12px;color:#4a4a4a;line-height:1.6;margin:0;">
                © ${year} RetroVault · Todos os direitos reservados
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}