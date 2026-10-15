import { useEffect, useRef, useState } from "react";
import { KID_COUNT, KidFace } from "@/components/portrait";
import { drawQuestions, type Question } from "@/data/quiz";
import { useT } from "@/i18n/text";

type Child = { id: string; name: string; face: number };
type Team = { id: string; name: string; childIds: string[]; score: number };
type Mode = "solo" | "teams";

export function QuizGame() {
  const { t, choice } = useT();
  const [count, setCount] = useState<10 | 25>(10);
  const [mode, setMode] = useState<Mode>("solo");
  const [children, setChildren] = useState<Child[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [childName, setChildName] = useState("");
  const [face, setFace] = useState(0);
  const [teamName, setTeamName] = useState("");
  const [note, setNote] = useState("");
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<"play" | "playoff" | "end">("play");
  const [contenders, setContenders] = useState<number[]>([]);
  const [playoffTurn, setPlayoffTurn] = useState(0);
  const [clean, setClean] = useState(0);
  const [roundScores, setRoundScores] = useState<number[]>([]);
  const [winner, setWinner] = useState<number | null>(null);
  const [draw, setDraw] = useState(false);
  const [flash, setFlash] = useState(false);
  const [used, setUsed] = useState<string[]>([]);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  function addChild() {
    const name = childName.trim();
    if (!name) return;
    setChildren((list) => [...list, { id: `${Date.now()}`, name, face }]);
    setChildName("");
    setFace((value) => (value + 1) % KID_COUNT);
  }

  function addTeam() {
    if (teams.length >= 10) {
      setNote(t("quiz.maxTeams"));
      return;
    }
    const n = teams.length + 1;
    setTeams((list) => [
      ...list,
      { id: `team-${n}-${Date.now()}`, name: teamName.trim() || t("quiz.teamN", { n }), childIds: [], score: 0 },
    ]);
    setTeamName("");
    setNote("");
  }

  function toggleChild(teamId: string, childId: string) {
    setTeams((list) =>
      list.map((team) => {
        if (team.id !== teamId) return team;
        if (team.childIds.includes(childId)) return { ...team, childIds: team.childIds.filter((id) => id !== childId) };
        if (team.childIds.length >= 4) {
          setNote(t("quiz.maxKids"));
          return team;
        }
        setNote("");
        return { ...team, childIds: [...team.childIds, childId] };
      }),
    );
  }

  function start() {
    if (mode === "teams" && (teams.length < 1 || teams.some((team) => team.childIds.length < 1))) {
      setNote(t("quiz.needTeam"));
      return;
    }
    const drawn = drawQuestions(count, String(Date.now()));
    setQuestions(drawn);
    setUsed(drawn.map((item) => item.id));
    setScores(mode === "solo" ? [0] : teams.map(() => 0));
    setQi(0);
    setTurn(0);
    setPhase("play");
    setStarted(true);
    setShow(false);
    setPicked(null);
    setWinner(null);
    setDraw(false);
    setFlash(false);
    setClean(0);
    setNote("");
  }

  const activeQuestion = questions[qi];
  const answering = phase === "playoff" ? contenders[playoffTurn] ?? 0 : mode === "solo" ? 0 : turn % Math.max(teams.length, 1);

  function choose(index: number) {
    if (!activeQuestion || picked !== null) return;
    setPicked(index);
    const correct = index === activeQuestion.answer;
    timer.current = window.setTimeout(() => {
      setShow(true);
      if (!correct) return;
      if (phase === "playoff") {
        setRoundScores((list) => {
          const next = [...list];
          next[playoffTurn] = (next[playoffTurn] ?? 0) + 1;
          return next;
        });
      } else {
        setScores((list) => list.map((score, i) => (i === answering ? score + 1 : score)));
      }
    }, 1000);
  }

  function finishMain(nextScores: number[]) {
    if (mode === "solo") {
      setPhase("end");
      return;
    }
    const top = Math.max(...nextScores);
    const tied = nextScores.map((score, index) => (score === top ? index : -1)).filter((index) => index >= 0);
    if (tied.length === 1) {
      setWinner(tied[0]!);
      setFlash(true);
      setPhase("end");
      return;
    }
    setClean(0);
    startPlayoff(tied, `playoff-${Date.now()}`, false);
  }

  function startPlayoff(group: number[], seed: string, continueRound: boolean) {
    const extra = drawQuestions(group.length, seed, used);
    setQuestions((list) => [...list, ...extra]);
    setUsed((list) => [...list, ...extra.map((item) => item.id)]);
    setContenders(group);
    setPlayoffTurn(0);
    setRoundScores(group.map(() => 0));
    setPhase("playoff");
    setPicked(null);
    setShow(false);
    if (continueRound) setQi((value) => value + 1);
    else setQi(questions.length);
  }

  function next() {
    if (!show) return;
    if (phase === "play") {
      const last = qi + 1 >= count;
      if (!last) {
        setQi(qi + 1);
        setTurn(turn + 1);
        setPicked(null);
        setShow(false);
        return;
      }
      finishMain(scores);
      return;
    }
    if (phase === "playoff") {
      const lastSeat = playoffTurn + 1 >= contenders.length;
      if (!lastSeat) {
        setPlayoffTurn(playoffTurn + 1);
        setQi(qi + 1);
        setPicked(null);
        setShow(false);
        return;
      }
      const best = Math.max(...roundScores);
      const still = contenders.filter((_, index) => roundScores[index] === best);
      if (still.length === 1) {
        setWinner(still[0]!);
        setFlash(true);
        setPhase("end");
        return;
      }
      const nextClean = clean + 1;
      if (nextClean >= 3) {
        setDraw(true);
        setPhase("end");
        return;
      }
      setClean(nextClean);
      startPlayoff(still, `playoff-${nextClean}-${Date.now()}`, true);
    }
  }

  if (!started || !activeQuestion) {
    return (
      <div className="grid gap-4">
        <h1 className="font-display text-5xl">{t("nav.quiz")}</h1>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setCount(10)} className={`min-h-14 rounded-2xl border-2 border-ink font-extrabold ${count === 10 ? "bg-flag text-card" : "bg-card"}`}>{t("quiz.quick")}</button>
          <button type="button" onClick={() => setCount(25)} className={`min-h-14 rounded-2xl border-2 border-ink font-extrabold ${count === 25 ? "bg-flag text-card" : "bg-card"}`}>{t("quiz.mega")}</button>
          <button type="button" onClick={() => setMode("solo")} className={`min-h-14 rounded-2xl border-2 border-ink font-extrabold ${mode === "solo" ? "bg-flag text-card" : "bg-card"}`}>{t("quiz.solo")}</button>
          <button type="button" onClick={() => setMode("teams")} className={`min-h-14 rounded-2xl border-2 border-ink font-extrabold ${mode === "teams" ? "bg-flag text-card" : "bg-card"}`}>{t("quiz.teams")}</button>
        </div>
        {mode === "teams" ? (
          <div className="grid gap-4 rounded-3xl border-4 border-ink bg-card p-4">
            <p className="font-bold">{t("quiz.sameChild")}</p>
            <div className="grid grid-cols-6 gap-1 sm:grid-cols-8">
              {Array.from({ length: KID_COUNT }, (_, index) => (
                <button key={index} type="button" onClick={() => setFace(index)} className={`rounded-xl border-2 p-1 ${face === index ? "border-flag" : "border-ink"}`} aria-label={t("quiz.pickFace")}>
                  <KidFace index={index} />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={childName} onChange={(event) => setChildName(event.target.value)} placeholder={t("quiz.childName")} aria-label={t("quiz.childName")} className="min-w-0 flex-1 rounded-xl border-2 border-ink px-3 py-3" />
              <button type="button" onClick={addChild} className="rounded-xl bg-flag px-3 py-3 font-extrabold text-card">{t("quiz.addChild")}</button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {children.map((child) => (
                <li key={child.id} className="flex items-center gap-2 rounded-full border-2 border-ink px-2 py-1">
                  <span className="h-10 w-10"><KidFace index={child.face} label={child.name} /></span>
                  <span className="font-bold">{child.name}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input value={teamName} onChange={(event) => setTeamName(event.target.value)} placeholder={t("quiz.teamName")} aria-label={t("quiz.teamName")} className="min-w-0 flex-1 rounded-xl border-2 border-ink px-3 py-3" />
              <button type="button" onClick={addTeam} className="rounded-xl border-2 border-ink px-3 py-3 font-extrabold">{t("quiz.addTeam")}</button>
            </div>
            {teams.map((team) => (
              <fieldset key={team.id} className="rounded-2xl border-2 border-ink p-3">
                <legend className="px-1 font-extrabold">{team.name}</legend>
                <div className="flex flex-wrap gap-2">
                  {children.map((child) => {
                    const on = team.childIds.includes(child.id);
                    return (
                      <button key={child.id} type="button" onClick={() => toggleChild(team.id, child.id)} className={`rounded-full border-2 px-3 py-2 text-sm font-bold ${on ? "border-flag bg-flag text-card" : "border-ink"}`}>
                        {child.name}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        ) : null}
        {note ? <p className="font-bold">{note}</p> : null}
        <button type="button" onClick={start} className="min-h-14 rounded-2xl bg-flag text-lg font-extrabold text-card">{t("quiz.start")}</button>
      </div>
    );
  }

  if (phase === "end") {
    return (
      <div className="grid gap-4">
        {flash && winner !== null ? (
          <div className="rounded-3xl bg-flag px-4 py-10 text-center">
            <p className="font-display text-4xl font-bold text-card sm:text-6xl">{t("quiz.win")}</p>
          </div>
        ) : null}
        <h1 className="font-display text-5xl">{draw ? t("quiz.draw") : winner !== null ? t("quiz.winner", { name: teams[winner]?.name ?? "" }) : t("quiz.got", { score: scores[0] ?? 0, total: count })}</h1>
        {mode === "teams" ? (
          <ul className="grid gap-2">
            {teams.map((team, index) => (
              <li key={team.id} className="rounded-2xl border-2 border-ink bg-card px-4 py-3 font-bold">{t("quiz.score", { name: team.name, score: scores[index] ?? 0 })}</li>
            ))}
          </ul>
        ) : null}
        <button type="button" onClick={() => setStarted(false)} className="min-h-14 rounded-2xl border-2 border-ink font-extrabold">{t("quiz.start")}</button>
      </div>
    );
  }

  const correct = picked === activeQuestion.answer;
  const who = mode === "teams" ? teams[answering]?.name ?? "" : t("quiz.you");
  return (
    <div className="grid gap-4">
      <p className="text-sm font-extrabold">
        {phase === "playoff" ? t("quiz.round", { n: clean + 1 }) : t("quiz.question", { n: Math.min(qi + 1, count), total: count })}
      </p>
      {phase === "playoff" ? <p className="font-bold">{t("quiz.playoff")}</p> : null}
      {mode === "teams" ? <p className="font-extrabold">{t("quiz.turn", { name: who })}</p> : null}
      {mode === "teams" ? (
        <ul className="flex flex-wrap gap-2">
          {teams.map((team, index) => (
            <li key={team.id} className={`rounded-full border-2 px-3 py-2 text-sm font-bold ${index === answering ? "border-flag bg-flag text-card" : "border-ink bg-card"}`}>
              {team.name} {scores[index] ?? 0}
            </li>
          ))}
        </ul>
      ) : null}
      <h1 className="font-display text-4xl">{t(activeQuestion.promptKey, activeQuestion.promptVars)}</h1>
      <div className="grid gap-2">
        {activeQuestion.choices.map((item, index) => (
          <button
            key={`${activeQuestion.id}-${index}`}
            type="button"
            disabled={picked !== null}
            onClick={() => choose(index)}
            className="min-h-14 rounded-2xl border-2 border-ink bg-card px-4 text-left text-lg font-bold disabled:opacity-80"
          >
            {choice(item)}
          </button>
        ))}
      </div>
      {show ? (
        <div className="rounded-3xl border-4 border-ink bg-card p-4">
          <p className="font-display text-4xl">{correct ? t("quiz.yes") : t("quiz.no")}</p>
          <p className="mt-2 text-lg">
            <span className="font-extrabold">{t("quiz.why")}. </span>
            {t(activeQuestion.whyKey, activeQuestion.whyVars)}
          </p>
          <button type="button" onClick={next} className="mt-4 min-h-12 rounded-xl bg-flag px-4 font-extrabold text-card">{t("quiz.next")}</button>
        </div>
      ) : picked !== null ? (
        <p className="font-bold">…</p>
      ) : null}
    </div>
  );
}
