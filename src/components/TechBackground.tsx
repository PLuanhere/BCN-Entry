import { memo, useEffect, useRef } from "react";

// Stable coordinates keep the field continuous when navigating between pages.
const columns = 10;
const rows = 7;
const nodes = Array.from({ length: columns * rows }, (_, index) => ({
  x: index % columns * 164 - 18 + Math.sin(index * 2.4) * 37,
  y: Math.floor(index / columns) * 154 - 12 + Math.cos(index * 1.7) * 32,
}));
const links = nodes.flatMap((node, index) => {
  const column = index % columns;
  const row = Math.floor(index / columns);
  const neighbors = [
    ...(column < columns - 1 ? [index + 1] : []),
    ...(row < rows - 1 ? [index + columns] : []),
    ...(column < columns - 1 && row < rows - 1 && index % 3 === 0 ? [index + columns + 1] : []),
  ];
  return neighbors.map((neighbor) => `M${node.x} ${node.y}L${nodes[neighbor].x} ${nodes[neighbor].y}`);
});
const objects = [
  [90, 140], [360, 95], [675, 155], [1000, 75], [1320, 180],
  [210, 420], [540, 350], [860, 445], [1190, 385],
  [70, 710], [390, 780], [715, 675], [1020, 770], [1360, 680],
];
const signals = links.filter((_, index) => index % 16 === 0);

const TechBackground = memo(function TechBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      if (backgroundRef.current) backgroundRef.current.dataset.paused = String(document.hidden);
    };
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return <div className="tech-background" ref={backgroundRef} aria-hidden="true">
    <div className="tech-aurora tech-aurora-cyan" />
    <div className="tech-aurora tech-aurora-violet" />
    <div className="tech-grid" />
    <div className="tech-constellation">
      <svg className="tech-network" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none">
        <g className="tech-mesh-lines">{links.map((path) => <path d={path} key={path} />)}</g>
        <g className="tech-nodes">{nodes.map(({ x, y }, index) => <circle key={index} cx={x} cy={y} r={index % 4 === 0 ? 2.4 : 1.3} />)}</g>
      </svg>
      <svg className="tech-network tech-network-signals" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none">
        <defs><linearGradient id="tech-signal-gradient" x1="0" y1="0" x2="1440" y2="900" gradientUnits="userSpaceOnUse"><stop stopColor="#56dfff" /><stop offset="1" stopColor="#a18bff" /></linearGradient></defs>
        <g className="tech-mesh-signals">{signals.map((path, index) => <path d={path} key={path} style={{ animationDelay: `${index * -1.3}s` }} />)}</g>
      </svg>
    </div>
    <div className="tech-particles">{objects.map(([x, y], index) => <div className="tech-particle" key={index} style={{ left: `${x / 14.4}%`, top: `${y / 9}%`, animationDelay: `${index * -2.7}s`, animationDuration: `${18 + index % 4 * 4}s` }}>
      <svg className="tech-shape" viewBox="0 0 60 60" fill="none" style={{ animationDelay: `${index * -3}s` }}>
        {index % 3 === 0 ? <path d="M30 4 53 17v26L30 56 7 43V17ZM7 17l23 14 23-14M30 31v25M30 4v27" />
          : index % 3 === 1 ? <><path d="M30 5 55 48H5ZM30 5v29M5 48l25-14 25 14" /><circle cx="30" cy="34" r="3" /></>
            : <><circle cx="30" cy="30" r="22" strokeDasharray="3 7" /><path d="M30 15v30M15 30h30" /><circle cx="30" cy="30" r="8" /></>}
      </svg>
    </div>)}</div>
  </div>;
});

export default TechBackground;
