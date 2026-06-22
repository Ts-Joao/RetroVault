export interface WelcomeEmailData {
  name: string;
  email: string;
}
 
export function welcomeTemplate({ name, email }: WelcomeEmailData): string {
  return /* html */ `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bem-vindo à RetroVault</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0d0d0f;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #e4e4e7;
      padding: 20px;
    }
    .wrapper {
      max-width: 500px;
      margin: 40px auto;
      background-color: #18181b;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #27272a;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .header {
      background-color: #09090b;
      padding: 32px;
      border-bottom: 1px solid #27272a;
      text-align: center;
    }
    .logo {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 1px;
      color: #ffffff;
      text-transform: uppercase;
    }
    .logo span {
      color: #cd463a;
    }
    .body {
      padding: 32px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: -0.5px;
    }
    .text {
      font-size: 13px;
      line-height: 1.6;
      color: #a1a1aa;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .text strong {
      color: #ffffff;
    }
    .divider {
      border: none;
      border-top: 1px solid #27272a;
      margin: 24px 0;
    }
    .features {
      margin-bottom: 32px;
    }
    .feature {
      margin-bottom: 16px;
      padding: 12px;
      background-color: #09090b;
      border: 1px solid #27272a;
      border-radius: 8px;
    }
    .feature-title {
      font-size: 11px;
      font-weight: 900;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .feature-desc {
      font-size: 11px;
      color: #71717a;
      text-transform: uppercase;
      line-height: 1.4;
      letter-spacing: 0.5px;
    }
    .cta-wrapper {
      text-align: center;
      margin: 24px 0 8px;
    }
    .cta {
      display: block;
      background-color: #cd463a;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 12px;
      font-weight: 900;
      padding: 14px;
      border-radius: 8px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .footer {
      background-color: #09090b;
      padding: 20px;
      border-top: 1px solid #27272a;
      text-align: center;
    }
    .footer-text {
      font-size: 10px;
      color: #52525b;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">Retro<span>Vault</span></div>
    </div>
 
    <div class="body">
      <p class="greeting">Operador Ativado: ${name}</p>
 
      <p class="text">
        Sua credencial foi homologada no sistema. Você agora possui autorização de acesso ao cofre da <strong>RetroVault</strong>.
      </p>
 
      <p class="text">
        Registro vinculado: <strong>${email}</strong>.
      </p>
 
      <hr class="divider" />
 
      <div class="features">
        <div class="feature">
          <div class="feature-title">💾 Catálogo Retrô</div>
          <div class="feature-desc">Jogos, consoles e relíquias raras catalogadas com autenticidade.</div>
        </div>
        <div class="feature">
          <div class="feature-title">📦 Operações Seguras</div>
          <div class="feature-desc">Ambiente de checkout otimizado e rastreamento de lotes em tempo real.</div>
        </div>
        <div class="feature">
          <div class="feature-title">🪙 Carteira Digital</div>
          <div class="feature-desc">Gerenciamento de depósitos, saldo e provisões integradas.</div>
        </div>
      </div>
 
      <div class="cta-wrapper">
        <a class="cta" href="${process.env.APP_URL ?? 'http://localhost:3001'}">
          Acessar Terminal →
        </a>
      </div>
    </div>
 
    <div class="footer">
      <p class="footer-text">RetroVault S.A. © Terminal de Transações</p>
    </div>
  </div>
</body>
</html>
  `;
}