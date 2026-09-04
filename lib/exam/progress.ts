"use client";

import type { ExamMode, Lang, Region } from "./types";
import type { ThemeStat } from "./scoring";

// Progression "sur cet appareil" via localStorage — pas de compte, pas de
// serveur. C'est un compromis assumé : CLAUDE.md §2 exclut explicitement
// les comptes utilisateurs du périmètre v0 ; une vraie progression
// multi-appareils viendra avec les comptes Supabase prévus en P4
// (docs/ROADMAP.md). Voir la mention affichée sur /fr/progression.

const STORAGE_KEY = "examen-blanc-belge:historique";
const MAX_ENTRIES = 30;

export interface HistoryEntry {
  date: string; // ISO 8601
  lang: Lang;
  region: Region;
  mode: ExamMode;
  score: number;
  total: number;
  passed: boolean;
  themeStats: ThemeStat[];
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // navigation privée, quota dépassé, stockage désactivé... : dégrade
    // silencieusement plutôt que de casser l'écran de résultat.
    return [];
  }
}

export function pushHistoryEntry(entry: HistoryEntry): void {
  if (typeof window === "undefined") return;
  try {
    const history = loadHistory();
    history.push(entry);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_ENTRIES)));
  } catch {
    // idem : on n'interrompt jamais le parcours pour un souci de stockage.
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export interface AggregatedTheme {
  theme: string;
  totalAsked: number;
  totalCorrect: number;
  percent: number;
}

export function aggregateThemes(history: HistoryEntry[]): AggregatedTheme[] {
  const map = new Map<string, { asked: number; correct: number }>();
  for (const entry of history) {
    for (const t of entry.themeStats) {
      const cur = map.get(t.theme) ?? { asked: 0, correct: 0 };
      cur.asked += t.total;
      cur.correct += t.correct;
      map.set(t.theme, cur);
    }
  }
  return [...map.entries()]
    .map(([theme, { asked, correct }]) => ({
      theme,
      totalAsked: asked,
      totalCorrect: correct,
      percent: asked > 0 ? Math.round((correct / asked) * 100) : 0,
    }))
    .sort((a, b) => a.percent - b.percent);
}
