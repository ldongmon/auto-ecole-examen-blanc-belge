import type { Region } from "./types";

// CLAUDE.md §5 — depuis le 1er janvier 2026, toute la formation doit se
// dérouler dans la même région. Les règles divergent réellement, ce n'est
// pas une question de traduction.
export const REGION_LABEL: Record<Region, string> = {
  WAL: "Wallonie",
  BRU: "Bruxelles",
  VLA: "Flandre",
};

export const REGION_SPEED_HORS_AGGLO: Record<Region, number> = {
  WAL: 90,
  BRU: 70,
  VLA: 70,
};
