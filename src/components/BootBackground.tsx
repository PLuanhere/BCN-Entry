const traces = [
  "M-20 106H86L154 174H260L324 110H560",
  "M-20 130H76L144 198H216V300L284 368H560",
  "M-20 250H70L106 286V364L164 422H348L406 480H560",
  "M-20 274H42L78 310V392L142 456H280L344 520H560",
  "M-20 542H120L170 492H228",
  "M-20 566H128L178 516H240L308 584H560",
  "M32 720V630L102 560V464",
  "M350-20V48L288 110V174",
];

function Circuit({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg
      className={`boot-circuit ${mirrored ? "boot-circuit-right" : ""}`}
      viewBox="0 0 560 720"
      fill="none"
    >
      <g className="boot-traces">
        {traces.map((path) => (
          <path d={path} key={path} />
        ))}
      </g>
      <g className="boot-packets">
        {traces.slice(0, 6).map((path) => (
          <path d={path} key={path} />
        ))}
      </g>
      <g className="boot-junctions">
        {[
          [154, 174],
          [216, 300],
          [164, 422],
          [280, 456],
          [120, 542],
          [308, 584],
          [288, 110],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="5" />
            <circle className="boot-node-core" cx={x} cy={y} r="1.5" />
          </g>
        ))}
      </g>
      <g className="boot-chip">
        <path d="M132 292H200V360H132Z M143 303H189V349H143Z" />
        {[0, 1, 2, 3].map((index) => {
          const offset = 144 + index * 15;
          return (
            <path
              key={index}
              d={`M${offset} 280V292 M${offset} 360V372 M120 ${304 + index * 15}H132 M200 ${304 + index * 15}H212`}
            />
          );
        })}
        <path className="boot-chip-core" d="M157 317H175V335H157Z" />
      </g>
      <g className="boot-board-marks">
        <path d="M24 32H48 M36 20V44 M460 628H484 M472 616V640 M262 644H280 M271 635V653" />
        <text x="118" y="395">
          BCN / CORE
        </text>
        <text x="385" y="613">
          0100 1011
        </text>
        <path d="M20 678H80 M20 684H56 M20 690H68" />
      </g>
    </svg>
  );
}

export default function BootBackground() {
  return (
    <div className="boot-background" aria-hidden="true">
      <div className="boot-grid-plane">
        <div className="boot-grid-lines" />
      </div>
      <Circuit />
      <Circuit mirrored />
      <div className="boot-geometry">
        <div className="boot-orbit" />
        <div className="boot-orbit boot-orbit-inner" />
        <div className="boot-cube">
          {["front", "back", "right", "left", "top", "bottom"].map((face) => (
            <span key={face} className={`boot-cube-face cube-${face}`} />
          ))}
        </div>
        <span className="boot-geometry-coordinate mono">X: 01 / Y: 06</span>
      </div>
      <div className="boot-scan-line" />
      <div className="boot-edge-mark boot-edge-top mono">
        [ BCN.SYSTEM / 001 ]
      </div>
      <div className="boot-edge-mark boot-edge-bottom mono">
        <span className="boot-status-dot" /> CONNECTION ACTIVE
      </div>
    </div>
  );
}
