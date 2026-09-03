"use client";

import type { Lang } from "./types";

// Web Speech API — gratuite, disponible en FR et NL (CLAUDE.md §9).
// Le texte lu vient TOUJOURS du champ `tts`, jamais du `stem` affiché :
// c'est lui qui porte les abréviations développées et les nombres à la
// belge (septante, nonante) — voir CLAUDE.md §10 et data/questions.json.

const LANG_TAG: Record<Lang, string> = { fr: "fr-BE", nl: "nl-BE" };

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  if (!isSpeechSupported()) return undefined;
  const voices = window.speechSynthesis.getVoices();
  const preferred = [LANG_TAG[lang], lang === "fr" ? "fr-FR" : "nl-NL"];
  for (const tag of preferred) {
    const v = voices.find((v) => v.lang.toLowerCase() === tag.toLowerCase());
    if (v) return v;
  }
  return voices.find((v) => v.lang.toLowerCase().startsWith(lang));
}

export function speak(text: string, lang: Lang): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel(); // pas de chevauchement entre deux énoncés
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG_TAG[lang];
  const voice = pickVoice(lang);
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}
