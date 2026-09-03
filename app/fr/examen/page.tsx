import ExamRunner from "@/components/exam/ExamRunner";
import type { QuestionBank, Region } from "@/lib/exam/types";
import bankData from "@/data/questions.json";

const bank = bankData as unknown as QuestionBank;
const VALID_REGIONS: Region[] = ["WAL", "BRU", "VLA"];

export default async function ExamenPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const params = await searchParams;
  const region = VALID_REGIONS.includes(params.region as Region) ? (params.region as Region) : "WAL";

  return (
    <main className="wrap">
      <ExamRunner bank={bank} lang="fr" region={region} />
    </main>
  );
}
