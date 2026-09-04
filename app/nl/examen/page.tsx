import ExamRunner from "@/components/exam/ExamRunner";
import type { ExamMode, QuestionBank, Region } from "@/lib/exam/types";
import bankData from "@/data/questions.json";

const bank = bankData as unknown as QuestionBank;
const VALID_REGIONS: Region[] = ["WAL", "BRU", "VLA"];
const VALID_MODES: ExamMode[] = ["entrainement", "examen"];

export default async function ExamenPageNL({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const region = VALID_REGIONS.includes(params.region as Region) ? (params.region as Region) : "VLA";
  const mode = VALID_MODES.includes(params.mode as ExamMode) ? (params.mode as ExamMode) : "examen";

  return (
    <main className="wrap">
      <ExamRunner bank={bank} lang="nl" region={region} mode={mode} />
    </main>
  );
}
