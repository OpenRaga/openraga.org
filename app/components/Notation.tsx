import { displayPhrase } from "@/lib/notation";

export function Phrase({ tokens }: { tokens: string[] }) {
  return (
    <span className="notation">
      {displayPhrase(tokens).map((note, i) => (
        <span key={i} className={note.altered ? "altered" : undefined}>
          {i > 0 ? " " : ""}
          {note.text}
        </span>
      ))}
    </span>
  );
}

export function NotationRow({
  label,
  tokens
}: {
  label: string;
  tokens: string[];
}) {
  return (
    <div className="notation-row">
      <div className="notation-label">{label}</div>
      <Phrase tokens={tokens} />
    </div>
  );
}
