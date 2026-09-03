import { NextResponse } from "next/server";

// Capture d'email → Brevo (voir docs/ROADMAP.md, P0). Appel REST direct,
// pas de SDK : un seul endpoint utilisé, ça ne justifie pas une dépendance
// de plus (convention CLAUDE.md §12).
const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  let body: { email?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("[subscribe] BREVO_API_KEY manquante — voir .env.local.example.");
    return NextResponse.json({ error: "Service d'inscription indisponible pour le moment." }, { status: 503 });
  }

  const listId = process.env.BREVO_LIST_ID;
  const payload: Record<string, unknown> = {
    email,
    updateEnabled: true, // ne pas échouer si l'email est déjà un contact existant
  };
  if (listId) payload.listIds = [Number(listId)];

  let brevoRes: Response;
  try {
    brevoRes = await fetch(BREVO_CONTACTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[subscribe] Appel Brevo impossible :", err);
    return NextResponse.json({ error: "Inscription impossible pour le moment." }, { status: 502 });
  }

  if (!brevoRes.ok) {
    const detail = await brevoRes.text().catch(() => "");
    console.error(`[subscribe] Brevo a répondu ${brevoRes.status} : ${detail}`);
    return NextResponse.json({ error: "Inscription impossible pour le moment." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
