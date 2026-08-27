import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_ISSUES = [
  'Weak paid conversion',
  'No upgrade trigger',
  'Unclear buying event',
  'Pricing / packaging',
  'Weak value framing',
  'Unclear positioning',
  'Expansion stalls',
  'Not sure yet',
  'Other',
];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // POST only
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Reasonable payload size check (10KB)
  const rawBody = JSON.stringify(req.body ?? {});
  if (rawBody.length > 10240) {
    return res.status(413).json({ error: 'Payload too large' });
  }

  const { name, website, email, primaryIssue, company_fax } = req.body ?? {};

  // Honeypot check — silently reject bots
  if (company_fax && typeof company_fax === 'string' && company_fax.length > 0) {
    // Return success to bots so they don't retry, but don't send email
    return res.status(200).json({ ok: true });
  }

  // Server-side validation
  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length > 200) {
    errors.push('Name is too long');
  }

  if (!website || typeof website !== 'string' || website.trim().length === 0) {
    errors.push('Website is required');
  } else {
    const trimmed = website.trim();
    // Accept full URLs or domain-like input
    try {
      new URL(trimmed);
    } catch {
      // Also accept bare domains like "example.com"
      if (!/^[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
        errors.push('Website must be a valid URL or domain');
      }
    }
  }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('Valid email is required');
  }

  if (!primaryIssue || typeof primaryIssue !== 'string' || !ALLOWED_ISSUES.includes(primaryIssue.trim())) {
    errors.push('Please select a valid issue');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('; ') });
  }

  const trimmedName = name.trim();
  const trimmedWebsite = website.trim();
  const trimmedEmail = email.trim();
  const trimmedIssue = primaryIssue.trim();
  const timestamp = new Date().toISOString();

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Nasiba <paul@nasiba.co>',
      to: [process.env.DIAGNOSIS_NOTIFICATION_TO || 'paul@nasiba.co'],
      replyTo: trimmedEmail,
      subject: `New Revenue Leak Diagnosis — ${trimmedWebsite}`,
      text: `Revenue Leak Diagnosis Request\n\nName: ${trimmedName}\nWebsite: ${trimmedWebsite}\nEmail: ${trimmedEmail}\nPrimary issue: ${trimmedIssue}\n\nSource: Nasiba /start form\nSubmitted: ${timestamp}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; padding: 20px;">
          <h2 style="margin-bottom: 20px;">New Revenue Leak Diagnosis</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666;">Name</td>
              <td style="padding: 8px 12px;">${escapeHtml(trimmedName)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666;">Website</td>
              <td style="padding: 8px 12px;">${escapeHtml(trimmedWebsite)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666;">Email</td>
              <td style="padding: 8px 12px;">${escapeHtml(trimmedEmail)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666;">Primary issue</td>
              <td style="padding: 8px 12px;">${escapeHtml(trimmedIssue)}</td>
            </tr>
          </table>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #999; font-size: 13px;">Source: Nasiba /start form<br/>Submitted: ${escapeHtml(timestamp)}</p>
        </div>
      `,
    });

    if (result.error) {
      console.error('[api/submit] Resend error:', result.error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[api/submit] Exception:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
