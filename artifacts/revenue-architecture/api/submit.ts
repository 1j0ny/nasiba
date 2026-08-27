import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, website, email, primaryIssue } = req.body ?? {};

  // Basic validation
  const errors: string[] = [];
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required');
  }
  if (!website || typeof website !== 'string' || website.trim().length === 0) {
    errors.push('Website is required');
  } else {
    try {
      new URL(website.trim());
    } catch {
      errors.push('Website must be a valid URL');
    }
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('Valid email is required');
  }
  if (!primaryIssue || typeof primaryIssue !== 'string' || primaryIssue.trim().length === 0) {
    errors.push('Primary issue is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('; ') });
  }

  try {
    const result = await resend.emails.send({
      from: 'Nasiba Intake <intake@nasiba.co>',
      to: ['paul@nasiba.co'],
      subject: `Diagnosis Request — ${name.trim()} (${email.trim()})`,
      text: `Revenue Leak Diagnosis Request

Name: ${name.trim()}
Website: ${website.trim()}
Email: ${email.trim()}
Primary Issue: ${primaryIssue.trim()}

---
This request was submitted via the /start intake form on nasiba.co.`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; padding: 20px;">
          <h2 style="margin-bottom: 20px;">Revenue Leak Diagnosis Request</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666;">Name</td>
              <td style="padding: 8px 12px;">${escapeHtml(name.trim())}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666;">Website</td>
              <td style="padding: 8px 12px;">${escapeHtml(website.trim())}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666;">Email</td>
              <td style="padding: 8px 12px;">${escapeHtml(email.trim())}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666;">Primary Issue</td>
              <td style="padding: 8px 12px;">${escapeHtml(primaryIssue.trim())}</td>
            </tr>
          </table>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #999; font-size: 13px;">This request was submitted via the /start intake form on nasiba.co.</p>
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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
