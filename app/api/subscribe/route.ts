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

  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    console.error("[subscribe] BREVO_API_KEY manquante — voir .env.local.example.");
    return NextResponse.json({ error: "Service d'inscription indisponible pour le moment." }, { status: 503 });
  }
  if (apiKey.startsWith("xsmtpsib-")) {
    // Erreur de copier-coller fréquente : Brevo a deux clés distinctes sous
    // Settings > SMTP & API — l'onglet "SMTP" (xsmtpsib-...) sert au relais
    // email, pas à l'API REST. Il faut la clé de l'onglet "API Keys" (xkeysib-...).
    console.error(
      "[subscribe] BREVO_API_KEY ressemble à une clé SMTP (xsmtpsib-...), pas à une clé API v3 " +
        "(xkeysib-...). Onglet Brevo > Settings > SMTP & API > API Keys."
    );
    return NextResponse.json({ error: "Service d'inscription mal configuré." }, { status: 503 });
  }

  // Tolère les erreurs de copier-coller courantes depuis le dashboard Brevo
  // (l'ID de liste y est affiché précédé de "#").
  const rawListId = process.env.BREVO_LIST_ID?.trim().replace(/^#/, "");
  const listId = rawListId ? Number(rawListId) : undefined;
  if (rawListId && Number.isNaN(listId)) {
    console.error(`[subscribe] BREVO_LIST_ID invalide : "${process.env.BREVO_LIST_ID}".`);
  }

  const payload: Record<string, unknown> = {
    email,
    updateEnabled: true, // ne pas échouer si l'email est déjà un contact existant
  };
  if (listId && !Number.isNaN(listId)) payload.listIds = [listId];

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
