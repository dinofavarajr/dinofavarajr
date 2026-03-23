import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

type PlanBlock = { time: string; icon: string; items: string[] };

const parkPlans: Record<string, Record<string, PlanBlock[]>> = {
  magic_kingdom: {
    chill: [
      { time: 'Morning', icon: '🌅', items: ["It's a Small World — start gentle, the scale of it gets you every time", "Under the Sea: Journey of The Little Mermaid (3.3★), better than it has any right to be", "PeopleMover — best overview of the park, zero wait, essential"] },
      { time: 'Midday', icon: '☀️', items: ["Haunted Mansion — classic for a reason, find the Doom Buggy and just vibe", "Liberty Belle Riverboat — slow, pretty, genuinely relaxing", "Jungle Cruise (3.5★) — pray for a good Skipper, ceiling is a 5"] },
      { time: 'Afternoon', icon: '🌤️', items: ["Pirates of the Caribbean — the original dark ride, it still holds up", "Enchanted Tiki Room — AC, birds, chaos. You either love it or you don't", "Country Bear Jamboree — absurd in the best way"] },
      { time: 'Evening', icon: '🌙', items: ["Festival of Fantasy parade (5★) — find your spot 30 minutes early. Non-negotiable.", "Main Street for fireworks — the castle view is worth standing for"] },
    ],
    mix: [
      { time: 'Morning', icon: '🌅', items: ["Seven Dwarfs Mine Train — family coaster sweet spot, get here early", "Jungle Cruise (3.5★) — morning Skippers tend to be better", "Big Thunder Mountain Railroad — underrated, back row preferred"] },
      { time: 'Midday', icon: '☀️', items: ["Haunted Mansion — never skip this", "Under the Sea: Journey of The Little Mermaid (3.3★) — solid midday breather", "Peter Pan's Flight — brutal wait, but it's a classic, worth once"] },
      { time: 'Afternoon', icon: '🌤️', items: ["Buzz Lightyear's Space Ranger Spin — competitive, fun, replay value is real", "PeopleMover — perfect between-rides reset", "Pirates of the Caribbean — always a good closer before evening"] },
      { time: 'Evening', icon: '🌙', items: ["Festival of Fantasy (5★) — no excuses, everyone sees this", "Space Mountain — night queue has better atmosphere, do it late", "Big Thunder Mountain as the last ride — perfect low-key closer"] },
    ],
    send: [
      { time: 'Rope Drop', icon: '⚡', items: ["TRON Lightcycle / Run — get Lightning Lane if you can, standby fills fast", "Seven Dwarfs Mine Train — right after TRON while crowds are thin", "Space Mountain — rope drop window is when the wait is tolerable"] },
      { time: 'Midday', icon: '☀️', items: ["Big Thunder Mountain Railroad — back row, every time", "Haunted Mansion — mandatory, no debate", "Jungle Cruise (3.5★) — even thrill seekers should do this once per trip"] },
      { time: 'Afternoon', icon: '🌤️', items: ["Peter Pan's Flight — Lightning Lane it or accept the wait", "Buzz Lightyear's Space Ranger Spin — quick and replayable", "Tiana's Bayou Adventure — the new Splash, worth seeing"] },
      { time: 'Evening', icon: '🌙', items: ["Festival of Fantasy (5★) — mandatory even for thrill seekers", "TRON again if Lightning Lane is still available", "Space Mountain as the final ride — ends the night right"] },
    ],
  },
  epcot: {
    chill: [
      { time: 'Morning', icon: '🌅', items: ["Soarin' Around the World — front row if possible, it's a different experience up there", "Living with the Land — boat ride, slow, genuinely good", "The Seas with Nemo & Friends — low key, great AC, zero stress"] },
      { time: 'Midday', icon: '☀️', items: ["Journey into Imagination with Figment (3★ · ❄️) — nostalgia bait that mostly lands", "Turtle Talk with Crush — great AC, surprisingly fun", "Start the World Showcase loop — drinks and food at every pavilion"] },
      { time: 'Afternoon', icon: '🌤️', items: ["Gran Fiesta Tour — perfect AC break, near-zero wait", "Frozen Ever After — short, sweet, well-done", "Remy's Ratatouille Adventure — charming, lower waits in the afternoon"] },
      { time: 'Evening', icon: '🌙', items: ["EPCOT Forever nighttime show — stake your spot early", "Late dinner in World Showcase — France or Japan pavilion"] },
    ],
    mix: [
      { time: 'Morning', icon: '🌅', items: ["Mission: Space Orange (4★) — this is the real deal, do it first while you're fresh", "Guardians of the Galaxy: Cosmic Rewind — single rider line is your friend here", "Test Track — single rider makes this effortless"] },
      { time: 'Midday', icon: '☀️', items: ["Soarin' Around the World — single rider when the afternoon lines peak", "Journey into Imagination with Figment (3★ · ❄️) — solid AC break", "Living with the Land — resets the energy after a morning of rides"] },
      { time: 'Afternoon', icon: '🌤️', items: ["Frozen Ever After — lower waits after 3pm", "Remy's Ratatouille Adventure — charming dark ride, worth it", "World Showcase food and drinks — France, Morocco, Japan in that order"] },
      { time: 'Evening', icon: '🌙', items: ["EPCOT Forever nighttime show", "Late dinner in World Showcase to close it out"] },
    ],
    send: [
      { time: 'Rope Drop', icon: '⚡', items: ["Guardians of the Galaxy: Cosmic Rewind — this fills fast, first ride no debate", "Mission: Space Orange (4★) — criminally underridden, do it while lines are short", "Test Track — single rider line, get this done early"] },
      { time: 'Midday', icon: '☀️', items: ["Soarin' — single rider when the line peaks midday", "Remy's Ratatouille Adventure — afternoon waits drop, good timing", "Frozen Ever After — same logic, afternoon windows are better"] },
      { time: 'Afternoon', icon: '🌤️', items: ["Mission: Space Green (1★) — only if you want the comparison, otherwise skip", "Spaceship Earth — slow, iconic, do it once", "Gran Fiesta Tour — zero wait, good AC"] },
      { time: 'Evening', icon: '🌙', items: ["EPCOT Forever — still worth it after a full send day", "World Showcase for food — you've earned the calories"] },
    ],
  },
  hollywood_studios: {
    chill: [
      { time: 'Morning', icon: '🌅', items: ["Mickey & Minnie's Runaway Railway — charming, inventive, great first ride energy", "Indiana Jones Epic Stunt Spectacular — get there 10 min early, huge AC show", "Muppet*Vision 3D — absurd and perfect, great AC"] },
      { time: 'Midday', icon: '☀️', items: ["Star Tours — random routes keep it fresh, always worth a lap", "Toy Story Mania! — competitive, fun, everyone has a good time", "Millennium Falcon: Smugglers Run — pick pilot if you want control, gunner if you don't"] },
      { time: 'Afternoon', icon: '🌤️', items: ["Tower of Terror — you have to do this at least once, it's a masterpiece of theming", "Beauty and the Beast Live on Stage — great afternoon AC show", "Sunset Boulevard walk — the architecture back here is genuinely beautiful"] },
      { time: 'Evening', icon: '🌙', items: ["Fantasmic! — get seats 30 minutes early, worth every minute of the wait"] },
    ],
    mix: [
      { time: 'Morning', icon: '🌅', items: ["Rise of the Resistance — get Lightning Lane before it sells out, standby can hit 90+ min", "Mickey & Minnie's Runaway Railway — right after Rise while energy is high", "Millennium Falcon: Smugglers Run — single rider line moves fast"] },
      { time: 'Midday', icon: '☀️', items: ["Slinky Dog Dash — family-friendly coaster, better than it looks", "Toy Story Mania! — midday waits drop, good timing", "Indiana Jones Epic Stunt Spectacular — AC and entertainment, smart midday choice"] },
      { time: 'Afternoon', icon: '🌤️', items: ["Tower of Terror — iconic, atmospheric, a rite of passage", "Star Tours — quick lap, randomized routes", "Muppet*Vision 3D — underrated afternoon reset"] },
      { time: 'Evening', icon: '🌙', items: ["Rock 'n' Roller Coaster — last ride of the night energy is perfect for this", "Fantasmic! to close — stake your seats early"] },
    ],
    send: [
      { time: 'Rope Drop', icon: '⚡', items: ["Rise of the Resistance — first ride, no exceptions, nothing else matters at open", "Rock 'n' Roller Coaster — right after Rise before the line builds", "Tower of Terror — the theming hits different with morning light"] },
      { time: 'Midday', icon: '☀️', items: ["Slinky Dog Dash — Lightning Lane if available, standby moves slow at peak", "Millennium Falcon: Smugglers Run — single rider line is the move", "Star Tours — quick, replayable, no commitment required"] },
      { time: 'Afternoon', icon: '🌤️', items: ["Mickey & Minnie's Runaway Railway — lower waits after 3pm, great ride", "Toy Story Mania! — afternoon lull is the time", "Rise of the Resistance again if Lightning Lane is still available"] },
      { time: 'Evening', icon: '🌙', items: ["Rock 'n' Roller Coaster as the final ride — ends the night exactly right", "Fantasmic! — even send-mode people stop for this"] },
    ],
  },
  animal_kingdom: {
    chill: [
      { time: 'Morning', icon: '🌅', items: ["Kilimanjaro Safaris — animals are most active in the morning, do this first every time", "Gorilla Falls Exploration Trail — slow, beautiful, genuinely excellent", "Maharajah Jungle Trek — same energy, different continent, equally good"] },
      { time: 'Midday', icon: '☀️', items: ["Na'vi River Journey (1★) — only go if under 20 min wait", "Festival of the Lion King — great AC show, big crowd-pleaser, get there early", "Dinosaur — surprisingly intense for a chill day, heads up"] },
      { time: 'Afternoon', icon: '🌤️', items: ["Kali River Rapids — if it's hot, this is non-negotiable. You will get soaked.", "Conservation Station — quiet, interesting, almost nobody goes here", "Treetop Trails — walk the canopy paths, deeply underrated"] },
      { time: 'Evening', icon: '🌙', items: ["Tree of Life Awakening — the projections at dusk are genuinely beautiful, don't miss it"] },
    ],
    mix: [
      { time: 'Morning', icon: '🌅', items: ["Flight of Passage — get Lightning Lane before anything else, it sells out fast", "Kilimanjaro Safaris — right after Flight while morning animal activity is peak", "Na'vi River Journey (1★) — only worth it under 20 min, otherwise skip"] },
      { time: 'Midday', icon: '☀️', items: ["Expedition Everest — back row for the best experience, always", "Festival of the Lion King — smart midday AC break, surprisingly good show", "Gorilla Falls Exploration Trail — gentle reset after Everest"] },
      { time: 'Afternoon', icon: '🌤️', items: ["Kali River Rapids — afternoon heat makes this mandatory if it's summer", "Dinosaur — often overlooked, genuinely thrilling", "Maharajah Jungle Trek — the tigers alone are worth the walk"] },
      { time: 'Evening', icon: '🌙', items: ["Tree of Life Awakening at dusk — one of the most underrated moments in all of WDW"] },
    ],
    send: [
      { time: 'Rope Drop', icon: '⚡', items: ["Flight of Passage — first ride of the day, no debate, this changes people", "Expedition Everest — back row, right after Flight before lines form", "Kilimanjaro Safaris — morning is when the animals are out, don't skip this"] },
      { time: 'Midday', icon: '☀️', items: ["Kali River Rapids — beat the afternoon heat, you're going to get soaked anyway", "Dinosaur — underrated thrill, better than its reputation", "Na'vi River Journey (1★) — only if walk-on, otherwise the math doesn't work"] },
      { time: 'Afternoon', icon: '🌤️', items: ["Expedition Everest again — it earns the repeat, back row still", "Festival of the Lion King — even send-mode people should see this once", "Gorilla Falls Exploration Trail — the cooldown walk you need after a full send morning"] },
      { time: 'Evening', icon: '🌙', items: ["Flight of Passage one more time if Lightning Lane is available", "Tree of Life Awakening — end the night here, the projection show is worth staying for"] },
    ],
  },
};

export const POST: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const email = url.searchParams.get('email') ?? '';
  const park  = url.searchParams.get('park')  ?? '';
  const thrill = url.searchParams.get('thrill') ?? '';
  const vibe  = url.searchParams.get('vibe')  ?? '';

  if (!email || !park || !thrill) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  const plan = parkPlans[park]?.[thrill] ?? [];

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

  const planBlocksHTML = plan.map(block => `
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

  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  // Add to Kit.com list (non-blocking)
  try {
    const kitKey = import.meta.env.KIT_API_KEY;
    if (kitKey) {
      await fetch('https://api.kit.com/v4/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Kit-Api-Key': kitKey },
        body: JSON.stringify({ email_address: email }),
      });
    }
  } catch (err) {
    console.error('Kit error (non-fatal):', err);
  }

  // Send plan to user
  try {
    await resend.emails.send({
      from: 'Dino Favara <dino@dinofavarajr.com>',
      to: email,
      subject: `Your ${parkName} day plan — Dino's Disney Field Guide`,
      html: emailBody,
      replyTo: 'dino@dinofavarajr.com',
    });
  } catch (err) {
    console.error('Resend user email error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }

  // Notify Dino
  try {
    await resend.emails.send({
      from: 'Disney Planner <dino@dinofavarajr.com>',
      to: 'dino@dinofavarajr.com',
      replyTo: email,
      subject: `New plan request: ${email} → ${parkName}`,
      html: notifyBody,
    });
  } catch (err) {
    console.error('Resend notify error (non-fatal):', err);
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
