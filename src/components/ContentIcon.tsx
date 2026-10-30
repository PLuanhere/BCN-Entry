const paths = {
  people: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  wallet: "M20 8V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v12H5a3 3 0 0 1-3-3V6m18 7h-5v4h5",
  calendar: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2m2 10h3m4 0h3m-10 4h3",
  spark: "m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z",
  shield: "m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6Zm-4 10 3 3 5-6",
  chat: "M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z",
  server: "M3 3h18v7H3Zm0 11h18v7H3ZM7 6.5h.01M7 17.5h.01M12 6.5h6M12 17.5h6",
  layers: "m12 2 10 5-10 5L2 7Zm-10 10 10 5 10-5M2 17l10 5 10-5",
  photo: "M3 3h18v18H3Zm0 13 6-6 6 6 3-3 3 3",
} as const;

export type ContentIconName = keyof typeof paths;
export default function ContentIcon({ name, className = "" }: { name: ContentIconName; className?: string }) {
  return <svg className={`content-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} />{name === "people" && <circle cx="9" cy="7" r="4" />}{name === "photo" && <circle cx="16" cy="7" r="1" />}</svg>;
}
