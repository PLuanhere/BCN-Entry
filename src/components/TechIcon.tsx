const labels: Record<string, string> = {
  react: "React / React Native",
  javascript: "JavaScript",
  html5: "HTML5",
  css: "CSS",
  nextdotjs: "Next.js",
  android: "Android",
  kotlin: "Kotlin",
  figma: "Figma · UX/UI",
  java: "Java",
  code: "Lập trình",
  team: "Cộng tác",
};
export default function TechIcon({
  name,
  label = false,
}: {
  name: string;
  label?: boolean;
}) {
  const custom = ["java", "code", "team"].includes(name);
  return (
    <span className={`tech-mark tech-${name}`} title={labels[name]}>
      {custom ? (
        <svg
          viewBox="0 0 32 32"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {name === "java" ? (
            <>
              <path d="M7 13h16v9a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5zm16 2h3a4 4 0 0 1 0 8h-4M12 4c-4 4 4 4 0 8M19 2c-4 4 4 4 0 8M5 30h22" />
            </>
          ) : name === "code" ? (
            <>
              <path d="m11 9-7 7 7 7m10-14 7 7-7 7M18 5l-4 22" />
            </>
          ) : (
            <>
              <circle cx="12" cy="10" r="5" />
              <path d="M3 28v-4a9 9 0 0 1 18 0v4M23 5a5 5 0 0 1 0 10m1 4a8 8 0 0 1 5 9" />
            </>
          )}
        </svg>
      ) : (
        <img
          src={`${import.meta.env.BASE_URL}tech/${name}.svg`}
          alt={label ? "" : labels[name]}
          draggable="false"
        />
      )}
      {label && <span>{labels[name]}</span>}
    </span>
  );
}
