import { IEmailService } from '../../core/use-cases/CreateTaskUseCase';

interface ResendEmailBody {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

export class ResendEmailService implements IEmailService {
  private readonly apiKey: string;
  private readonly fromAddress: string;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY ?? '';
    this.fromAddress = process.env.RESEND_FROM_EMAIL ?? 'ZenTask <noreply@updates.zentask.app>';
  }

  async sendTaskAssignmentEmail(params: {
    to: string;
    assigneeName: string;
    adminName: string;
    taskTitle: string;
    meetingTitle: string;
    appUrl: string;
  }): Promise<void> {
    const { to, assigneeName, adminName, taskTitle, meetingTitle, appUrl } = params;

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nueva Tarea Asignada</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F5F7;font-family:-apple-system,BlinkMacSystemFont,'Inter','Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F5F7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding:36px 40px 28px;border-bottom:1px solid #F5F5F7;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:36px;height:36px;background-color:#007AFF;border-radius:10px;vertical-align:middle;text-align:center;">
                    <span style="color:#FFFFFF;font-size:18px;line-height:36px;">✦</span>
                  </td>
                  <td style="padding-left:12px;">
                    <span style="font-size:17px;font-weight:600;color:#1D1D1F;letter-spacing:-0.3px;">ZenTask</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1D1D1F;letter-spacing:-0.5px;">Nueva tarea asignada</p>
              <p style="margin:0 0 28px;font-size:15px;color:#6E6E73;line-height:1.6;">
                Hola ${assigneeName}, <strong>${adminName}</strong> te ha asignado una nueva tarea.
              </p>
              <!-- Task card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F5F7;border-radius:14px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#8E8E93;text-transform:uppercase;letter-spacing:0.8px;">Tarea</p>
                    <p style="margin:0 0 16px;font-size:17px;font-weight:600;color:#1D1D1F;">${taskTitle}</p>
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#8E8E93;text-transform:uppercase;letter-spacing:0.8px;">Reunión</p>
                    <p style="margin:0;font-size:15px;color:#3A3A3C;">${meetingTitle}</p>
                  </td>
                </tr>
              </table>
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:12px;background-color:#007AFF;">
                    <a href="${appUrl}/mis-tareas" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;letter-spacing:-0.2px;">
                      Ver mis tareas →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #F5F5F7;">
              <p style="margin:0;font-size:12px;color:#8E8E93;line-height:1.6;">
                Recibiste este mensaje porque te fue asignada una tarea en ZenTask.<br/>
                Si no esperas este correo, puedes ignorarlo.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // En modo Sandbox, solo podemos enviar correos al destinatario verificado en Resend.
    const verifiedSandboxEmail = 'jorgemendozamartinez@gmail.com';

    if (to.trim().toLowerCase() !== verifiedSandboxEmail.toLowerCase()) {
      console.log(`[SIMULACIÓN] Correo no enviado por restricciones de Sandbox a: ${to}`);
      return;
    }

    const body: ResendEmailBody = {
      from: 'ZenTask <onboarding@resend.dev>',
      to: [to],
      subject: `Nueva tarea: ${taskTitle}`,
      html,
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(data)}`);
    }

    return data;
  }
}
