import type { Metadata } from "next";
import Link from "next/link";
import { getRagas } from "@/lib/ragas";
import { Phrase } from "../components/Notation";

export const metadata: Metadata = {
  title: "Ragas",
  description:
    "Catalog of Hindustani ragas from the OpenRaga Ragamala Data set."
};

export default async function RagasPage() {
  const ragas = await getRagas();
  return (
    <div className="wrap">
      <h1 className="page-title">The ragas</h1>
      <p className="page-subtitle">
        {ragas.length} ragas from the community-curated Ragamala Data set.
        Every entry is a reviewed, schema-validated document.
      </p>
      <ul className="cards">
        {ragas.map(({ slug, raga }) => (
          <li className="card" key={slug}>
            <Link href={`/ragas/${slug}`}>
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
