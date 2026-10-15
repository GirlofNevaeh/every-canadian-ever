import { createFileRoute } from "@tanstack/react-router";
import { QuizGame } from "@/components/quiz-game";

export const Route = createFileRoute("/quiz")({ component: QuizPage });

function QuizPage() {
  return <QuizGame />;
}
