import { useRef, useState } from "react";
import { useContentMotion } from "../useContentMotion";
import { quickQuestions } from "../bcnInfo";
import { stageIndex } from "../content";
import ContentIcon from "./ContentIcon";
import { searchQuestions } from "../searchQuestions";

export default function QuickAnswers({ navigate, maxStage, initialQuestion = 0, focusSearch }: { navigate: (stage: number) => void; maxStage: number; initialQuestion?: number; focusSearch: boolean }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(initialQuestion);
  const results = searchQuestions(query);
  const current = Math.min(selected, Math.max(0, results.length - 1));
  const answer = results[current];
  const viewRef = useRef<HTMLDivElement>(null);
  useContentMotion(viewRef, answer?.question || "empty", ".question-answer, .search-empty");
  function search(value: string) { setQuery(value); setSelected(0); }
  return <div className="question-view" ref={viewRef}>
    <h2 id="dialog-title" tabIndex={-1}>Bạn cần biết gì?</h2>
    <div className="question-search">
      <label htmlFor="question-search">Tìm trong câu hỏi và câu trả lời</label>
      <div className="search-input-wrap"><input id="question-search" data-dialog-autofocus={focusSearch || undefined} type="search" enterKeyHint="search" value={query} onChange={(event) => search(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.nativeEvent.isComposing) event.currentTarget.blur(); }} placeholder="Học phí, đầu vào, đăng ký…" autoComplete="off" aria-describedby="search-count" />{query && <button className="search-clear" onClick={() => { search(""); document.getElementById("question-search")?.focus(); }} aria-label="Xóa từ khóa tìm kiếm">×</button>}</div>
      <div className="search-suggestions" aria-label="Từ khóa gợi ý">{["Học phí", "Đầu vào", "Lịch sinh hoạt", "Đăng ký"].map((word) => <button key={word} aria-pressed={query === word} onClick={() => search(word)}>{word}</button>)}</div>
      <p id="search-count" role="status">{query ? `${results.length} câu hỏi phù hợp` : `${quickQuestions.length} câu hỏi · Có thể tìm không dấu`}</p>
    </div>
    {answer ? <div className="question-content">
      <nav className="question-list" aria-label="Các câu hỏi" style={{ gridTemplateRows: `repeat(${results.length}, minmax(0, 1fr))` }}>{results.map((item, index) => <button key={item.question} aria-pressed={current === index} onClick={() => setSelected(index)}><span>{item.question}</span><span aria-hidden="true">→</span></button>)}</nav>
      <label className="question-picker"><span className="sr-only">Chọn câu hỏi</span><select value={current} onChange={(event) => setSelected(Number(event.target.value))}>{results.map((item, index) => <option key={item.question} value={index}>{item.question}</option>)}</select></label>
      <article className="question-answer" tabIndex={-1} data-dialog-autofocus={!focusSearch || undefined} aria-live="polite"><ContentIcon name="chat" /><h3>{answer.question}</h3><p>{answer.answer}</p>{stageIndex(answer.stage) <= maxStage && <button className="text-action" onClick={() => navigate(stageIndex(answer.stage))}>Xem phần liên quan <span aria-hidden="true">↗</span></button>}</article>
    </div> : <div className="search-empty"><ContentIcon name="chat" /><strong>Chưa tìm thấy câu trả lời.</strong><p>Thử từ khóa ngắn hơn.</p><button className="text-action" onClick={() => search("")}>Xem tất cả câu hỏi →</button></div>}
    {answer && <div className="question-pagination"><button onClick={() => setSelected(Math.max(0, current - 1))} disabled={current === 0} aria-label="Câu hỏi trước">←</button><span>{current + 1} / {results.length}</span><button onClick={() => setSelected(Math.min(results.length - 1, current + 1))} disabled={current === results.length - 1} aria-label="Câu hỏi tiếp">→</button></div>}
  </div>;
}
