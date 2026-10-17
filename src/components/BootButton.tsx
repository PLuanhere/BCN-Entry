import { useEffect, useRef, useState } from "react";

export default function BootButton({ onBoot }: { onBoot: () => void }) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const frame = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holding = useRef(false);
  const complete = useRef(false);
  const onBootRef = useRef(onBoot);
  onBootRef.current = onBoot;
  function stop() {
    if (complete.current) return;
    holding.current = false;
    cancelAnimationFrame(frame.current);
    setProgress(0);
  }
  function start() {
    if (holding.current || complete.current) return;
    holding.current = true;
    const started = performance.now();
    const tick = (now: number) => {
      if (!holding.current) return;
      const value = Math.min(100, ((now - started) / 1200) * 100);
      setProgress(value);
      if (value === 100) {
        complete.current = true;
        holding.current = false;
        setReady(true);
        timer.current = setTimeout(() => onBootRef.current(), 220);
      } else frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }
  useEffect(() => {
    const blur = () => stop();
    const visibility = () => {
      if (document.hidden) stop();
    };
    addEventListener("blur", blur);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame.current);
      if (timer.current) clearTimeout(timer.current);
      removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return (
    <div className="boot-control">
      <button
        className={`hold-button ${ready ? "boot-ready" : ""}`}
        aria-label="Giữ để khởi động"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          start();
        }}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
        onKeyDown={(event) => {
          if ([" ", "Enter"].includes(event.key)) {
            event.preventDefault();
            if (!event.repeat) start();
          }
        }}
        onKeyUp={(event) => {
          if ([" ", "Enter"].includes(event.key)) {
            event.preventDefault();
            stop();
          }
        }}
        onBlur={stop}
        onContextMenu={(event) => event.preventDefault()}
      >
        <span className="hold-fill" style={{ width: `${progress}%` }} />
        <span className="hold-label">
          {ready
            ? "ACCESS GRANTED ✓"
            : progress > 0
              ? `INITIALIZING… ${Math.floor(progress)}%`
              : "GIỮ ĐỂ KHỞI ĐỘNG_"}
        </span>
        <span className="hold-key">↵</span>
      </button>
      <div className="boot-control-meta mono">
        <span>
          {ready ? "KẾT NỐI THÀNH CÔNG" : "GIỮ 1,2 GIÂY · HOẶC GIỮ ENTER"}
        </span>
        <span className="boot-percentage" aria-hidden="true">
          {Math.floor(progress).toString().padStart(2, "0")}%
        </span>
      </div>
      <span className="sr-only" role="status">
        {ready ? "Khởi động thành công, đang mở bản sắc BCN." : ""}
      </span>
    </div>
  );
}
