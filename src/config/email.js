import { BrevoClient } from "@getbrevo/brevo";

export const sendFollowUpReminder = async ({
  to,
  name,
  company,
  role,
  followUpDate,
}) => {
  const client = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
  });

  await client.transactionalEmails.sendTransacEmail({
    to: [{ email: to }],
    sender: { name: "Georn", email: "georn.tracker@gmail.com" },
    subject: `Reminder: Follow up with ${company}`,
    html: `
      <div style="font-family: DM Sans, sans-serif; max-width: 560px; margin: 0 auto; padding: 2rem;">
        <h2 style="font-family: Georgia, serif; color: #1E293B;">Hey ${name} 👋</h2>
        <p style="color: #475569; line-height: 1.6;">
          This is a reminder to follow up on your application for 
          <strong>${role}</strong> at <strong>${company}</strong>.
        </p>
        <p style="color: #475569; line-height: 1.6;">
          Your follow-up date was set for <strong>${new Date(
            followUpDate,
          ).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}</strong>.
        </p>
        <a 
          href="${process.env.CLIENT_URL}/applications"
          style="display: inline-block; margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #2563EB; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;"
        >
          View Application →
        </a>
        <p style="margin-top: 2rem; color: #94A3B8; font-size: 0.85rem;">
          You're receiving this because you set a follow-up reminder in Trackr.
        </p>
      </div>
    `,
  });
};

export const sendDeadlineReminder = async ({
  to,
  name,
  company,
  role,
  deadline,
}) => {
  const client = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
  });

 await client.transactionalEmails.sendTransacEmail({
    to: [{ email: to }],
    sender: { name: "Georn", email: "georn.tracker@gmail.com" },
    subject: `Deadline Tomorrow: ${role} at ${company}`,
    html: `
      <div style="font-family: DM Sans, sans-serif; max-width: 560px; margin: 0 auto; padding: 2rem;">
        <h2 style="font-family: Georgia, serif; color: #1E293B;">Heads up, ${name} ⏰</h2>
        <p style="color: #475569; line-height: 1.6;">
          The application deadline for <strong>${role}</strong> at <strong>${company}</strong> is <strong>tomorrow</strong>.
        </p>
        <p style="color: #475569; line-height: 1.6;">
          Deadline: <strong>${new Date(deadline).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}</strong>
        </p>
        <a 
          href="${process.env.CLIENT_URL}/applications"
          style="display: inline-block; margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #2563EB; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;"
        >
          View Application →
        </a>
        <p style="margin-top: 2rem; color: #94A3B8; font-size: 0.85rem;">
          You're receiving this because you set a deadline reminder in Trackr.
        </p>
      </div>
    `,
  });
};

