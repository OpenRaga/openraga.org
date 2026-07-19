import type { Metadata } from "next";
import Link from "next/link";
import { getRagas } from "@/lib/ragas";
import { Phrase } from "../components/Notation";

export const metadata: Metadata = {
  title: "Ragas",
  description:
    "Example Hindustani raga documents in the RagaJSON format."
};

export default async function RagasPage() {
  const ragas = await getRagas();
  return (
    <div className="wrap">
      <h1 className="page-title">The ragas</h1>
      <p className="page-subtitle">
        {ragas.length} example ragas in the RagaJSON format — illustrative,
        schema-validated documents, not an authoritative reference.
      </p>
      <ul className="cards">
        {ragas.map(({ slug, doc: raga }) => (
          <li className="card" key={slug}>
            <Link href={`/raga/${slug}`}>
              <div className="card-name-row">
                <span className="card-name">{raga.name}</span>
                {raga.name_devanagari && (
                  <span className="deva">{raga.name_devanagari}</span>
                )}
              </div>
              {raga.structure?.aroha && (
                <div>
                  <Phrase tokens={raga.structure.aroha} />
                </div>
              )}
              <div className="chips">
                {raga.thaat && <span className="chip">{raga.thaat} thaat</span>}
                {raga.performance?.time_of_day?.map((time) => (
                  <span className="chip" key={time}>
                    {time}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
