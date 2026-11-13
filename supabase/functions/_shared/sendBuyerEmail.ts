// supabase/functions/_shared/sendBuyerEmail.ts
// Helper partagé pour l'envoi d'e-mail contenant le code personnel à 6 chiffres via Gmail SMTP.

import nodemailer from 'npm:nodemailer@6.9.10';

export const DEFAULT_STUDIO_URL = 'https://ai-creator-studio-vtma.netlify.app';
export const DEFAULT_SMTP_USER = 'aicreatorstudio.support@gmail.com';
export const DEFAULT_SENDER_NAME = 'AI CREATOR Studio';

export interface SendBuyerCodeEmailParams {
  recipientEmail: string;
  oneTimeCode: string;
  studioUrl?: string;
  smtpUser?: string;
  smtpPassword?: string;
  senderName?: string;
  resendApiKey?: string;
  isRenewal?: boolean;
}

export interface SendEmailResult {
  sent: boolean;
  provider: 'gmail-smtp' | 'resend' | 'none';
  messageId?: string;
  error?: string;
}

export async function sendBuyerCodeEmail(
  params: SendBuyerCodeEmailParams
): Promise<SendEmailResult> {
  const studioUrl = params.studioUrl || DEFAULT_STUDIO_URL;
  const smtpUser = (params.smtpUser || DEFAULT_SMTP_USER).trim();
  const senderName = (params.senderName || DEFAULT_SENDER_NAME).trim();
  const smtpPassword = (params.smtpPassword || '').replace(/\s+/g, '');

  const subject = params.isRenewal
    ? "Ton nouveau code d'accès - Mini-Cours Interactif Claude"
    : "Ton code d'accès - Mini-Cours Interactif Claude";

  const introLine = params.isRenewal
    ? 'Voici ton nouveau code personnel à 6 chiffres (usage unique) pour te connecter à ton espace :'
    : 'Ton achat est confirmé. Voici ton code personnel à 6 chiffres (usage unique) pour te connecter à ton espace :';

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; background:#FAF6F0; color:#171313; padding:24px;">
      <div style="max-width:520px; margin:0 auto; background:#FFFDFC; border:1px solid #171313; border-radius:8px; overflow:hidden;">
        <div style="background:#B63131; color:#FAF6F0; padding:18px 24px;">
          <h1 style="margin:0; font-size:20px; font-weight:700;">Mini-Cours Interactif Claude</h1>
        </div>
        <div style="padding:24px;">
          <p style="margin:0 0 14px; font-size:15px; line-height:1.5;">Bonjour Boss,</p>
          <p style="margin:0 0 16px; font-size:15px; line-height:1.5;">
            ${introLine}
          </p>
          <div style="background:#FAF6F0; border:1.5px solid #171313; border-radius:6px; padding:14px; text-align:center; font-family:monospace; font-size:28px; font-weight:700; letter-spacing:0.22em; color:#B63131; margin:0 0 20px;">
            ${params.oneTimeCode}
          </div>
          <p style="margin:0 0 18px; font-size:14px; line-height:1.5;">
            Clique sur le bouton ci-dessous, puis saisis ton adresse e-mail d'achat (<strong>${params.recipientEmail}</strong>) et ce code à 6 chiffres :
          </p>
          <p style="margin:0 0 20px;">
            <a href="${studioUrl}" style="display:inline-block; background:#B63131; color:#FFFDFC; text-decoration:none; font-weight:700; padding:12px 20px; border:1.5px solid #171313; border-radius:6px;">
              Accéder à mon espace →
            </a>
          </p>
          <p style="margin:0 0 8px; font-size:12px; color:#555; line-height:1.5;">
            Ce code est personnel et à usage unique. Une fois connecté, ton accès reste mémorisé sur ton appareil.
          </p>
          <p style="margin:0; font-size:11px; color:#777; line-height:1.5;">
            Astuce : Si ce message est arrivé dans tes spams, clique sur « Non spam » pour recevoir nos prochains messages directement en boîte principale.
          </p>
        </div>
      </div>
    </div>
  `;

  const text = [
    'Bonjour Boss,',
    '',
    introLine,
    '',
    `Code d'accès : ${params.oneTimeCode}`,
    '',
    `Accéder à ton espace : ${studioUrl}`,
    `Adresse e-mail d'achat : ${params.recipientEmail}`,
    '',
    "Ce code est personnel et à usage unique. Une fois connecté, ton accès reste mémorisé sur ton appareil.",
  ].join('\n');

  if (smtpPassword) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      });

      const info = await transporter.sendMail({
        from: `"${senderName}" <${smtpUser}>`,
        to: params.recipientEmail,
        replyTo: smtpUser,
        subject,
        text,
        html,
        priority: 'normal',
      });

      return {
        sent: true,
        provider: 'gmail-smtp',
        messageId: info.messageId,
      };
    } catch (err) {
      return {
        sent: false,
        provider: 'gmail-smtp',
        error: err instanceof Error ? err.message : 'Échec envoi Gmail SMTP',
      };
    }
  }

  const resendApiKey = (params.resendApiKey || '').trim();
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${senderName} <onboarding@resend.dev>`,
          to: [params.recipientEmail],
          subject,
          html,
        }),
      });
      if (response.ok) {
        return { sent: true, provider: 'resend' };
      }
      const errBody = await response.text().catch(() => '');
      return {
        sent: false,
        provider: 'resend',
        error: `Resend HTTP ${response.status}: ${errBody}`,
      };
    } catch (err) {
      return {
        sent: false,
        provider: 'resend',
        error: err instanceof Error ? err.message : 'Échec appel Resend',
      };
    }
  }

  return {
    sent: false,
    provider: 'none',
    error: 'SMTP_PASSWORD non configuré dans les secrets Supabase.',
  };
}
