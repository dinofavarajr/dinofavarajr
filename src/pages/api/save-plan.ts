import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let email: string, plan: {time: string; icon: string; items: string[]}[], vibe: string, park: string, thrill: string;
  try {
    const text = await request.text();
    const parsed = JSON.parse(text);
    ({ email, plan, vibe, park, thrill } = parsed);
  } catch (e) {
    console.error('Body parse error:', e);
    return new Response(JSON.stringify({ error: `Parse failed: ${e instanceof Error ? e.message : String(e)}` }), { status: 400 });
  }

  if (!email || !plan) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  const parkLabels: Record<string, string> = {
    magic_kingdom: 'Magic Kingdom',
    epcot: 'EPCOT',
    hollywood_studios: 'Hollywood Studios',
    animal_kingdom: 'Animal Kingdom',
  };
  const thrillLabels: Record<string, string> = {
    chill: 'Keep It Chill',
    mix: 'Mix It Up',
    send: 'Send It',
  };

  const parkName = parkLabels[park] ?? park;
  const thrillName = thrillLabels[thrill] ?? thrill;

  const planBlocksHTML = plan.map((block: { time: string; icon: string; items: string[] }) => `
    <div style="margin-bottom:20px;">
      <p style="font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#6B5CE7;margin:0 0 8px;">${block.icon} ${block.time}</p>
      <ul style="margin:0;padding-left:18px;">
        ${block.items.map(item => `<li style="font-size:14px;color:#3a3348;margin-bottom:6px;line-height:1.5;">${item}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  const emailBody = `
    <div style="font-family:'DM Sans',system-ui,sans-serif;max-width:560px;margin:0 auto;background:#FAF9F5;padding:40px 32px;border-radius:16px;">
      <p style="font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#A89FF5;margin:0 0 12px;">Dino's Disney Field Guide</p>
      <h1 style="font-size:24px;font-weight:700;color:#1A1523;margin:0 0 4px;line-height:1.2;">${vibe}</h1>
      <p style="font-size:13px;color:#6B5CE7;margin:0 0 28px;">${parkName} · ${thrillName}</p>
      <div style="height:1px;background:#e5e1d8;margin-bottom:28px;"></div>
      ${planBlocksHTML}
      <div style="margin-top:24px;padding:16px 20px;background:#F5EDD8;border-radius:12px;border:1px solid rgba(196,169,122,0.3);">
        <p style="font-size:13px;color:#5a4a2a;margin:0;font-style:italic;">Reply to this email and I'll give you personal feedback on your day. — Dino</p>
      </div>
    </div>
  `;

  const notifyBody = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px;">
      <h2 style="font-size:18px;margin:0 0 8px;">New plan request from ${email}</h2>
      <p style="color:#6B5CE7;margin:0 0 24px;">${parkName} · ${thrillName} · ${vibe}</p>
      ${planBlocksHTML}
      <hr style="margin:24px 0;border:none;border-top:1px solid #e5e1d8;" />
      <p style="font-size:13px;color:#888;">Reply to this email to respond directly to ${email}.</p>
    </div>
  `;

  // Add to Kit.com list (non-blocking — don't fail the whole request if this errors)
  try {
    const kitKey = import.meta.env.KIT_API_KEY;
    if (kitKey) {
      const kitRes = await fetch('https://api.kit.com/v4/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Kit-Api-Key': kitKey },
        body: JSON.stringify({ email_address: email }),
      });
      const kitBody = await kitRes.text();
      console.log('Kit response:', kitRes.status, kitBody);
    } else {
      console.warn('KIT_API_KEY not set');
    }
  } catch (err) {
    console.error('Kit error (non-fatal):', err);
  }

  // Send plan to the user
  try {
    const userEmailResult = await resend.emails.send({
      from: 'Dino Favara <dino@dinofavarajr.com>',
      to: email,
      subject: `Your ${parkName} day plan — Dino's Disney Field Guide`,
      html: emailBody,
      replyTo: 'dino@dinofavarajr.com',
    });
    console.log('User email result:', JSON.stringify(userEmailResult));
  } catch (err) {
    console.error('Resend user email error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send user email' }), { status: 500 });
  }

  // Notify Dino
  try {
    const notifyResult = await resend.emails.send({
      from: 'Disney Planner <dino@dinofavarajr.com>',
      to: 'dino@dinofavarajr.com',
      replyTo: email,
      subject: `New plan request: ${email} → ${parkName}`,
      html: notifyBody,
    });
    console.log('Notify email result:', JSON.stringify(notifyResult));
  } catch (err) {
    console.error('Resend notify email error:', err);
    // Non-fatal — user email already sent
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
