import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY! });

type simplifiedMailProps = {
   subject: string,
   content: string
}

export const sendMailToMaintainer = async ({ subject, content }: simplifiedMailProps) => {
   const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: subject,
      textContent: content,
      sender: { name: "Sender", email: "mabel@example.org" },
      to: [{ email: process.env.MAINTAINER_EMAIL! }]
   });

   console.log('Email sent:', result);
}
