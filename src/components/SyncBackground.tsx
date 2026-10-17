export default function SyncBackground() {
  return (
    <div className="sync-background" aria-hidden="true">
      <svg
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g className="sync-drafting-lines">
          <path d="M-40 122h214l58 58h162M1440 612h-190l-92-92h-120M96 800V650l64-64V416M1344 0v154l-70 70h-134" />
          <path d="M-40 136h208l58 58h168M1454 626h-210l-92-92h-114" />
          <circle cx="160" cy="416" r="6" />
          <circle cx="394" cy="180" r="6" />
          <circle cx="1140" cy="224" r="6" />
          <circle cx="1038" cy="520" r="6" />
          <path d="M56 54h26m-13-13v26M1370 738h26m-13-13v26M610 60h22m-11-11v22M768 728h22m-11-11v22" />
          <circle cx="1306" cy="80" r="112" strokeDasharray="2 12" />
          <circle cx="1306" cy="80" r="90" />
        </g>
        <g className="sync-routing-lines">
          <path d="M-40 122h214l58 58h162" />
          <path d="M1440 612h-190l-92-92h-120" />
          <path d="M96 800V650l64-64V416" />
          <path d="M1344 0v154l-70 70h-134" />
        </g>
        <g className="sync-routing-nodes">
          <rect x="386" y="172" width="16" height="16" />
          <rect x="1030" y="512" width="16" height="16" />
          <circle cx="160" cy="416" r="3" />
          <circle cx="1140" cy="224" r="3" />
        </g>
        <text className="sync-background-number" x="220" y="788">
          06
        </text>
      </svg>
    </div>
  );
}
