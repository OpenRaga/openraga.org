import type { Metadata } from "next";
import Link from "next/link";
import { getTalas } from "@/lib/ragas";

export const metadata: Metadata = {
  title: "Talas",
  description: "Example Hindustani tala documents — rhythm cycles — in the RagaJSON format."
};

export default async function TalasPage() {
  const talas = await getTalas();
  return (
    <div className="wrap">
      <h1 className="page-title">The talas</h1>
      <p className="page-subtitle">
        {talas.length} example rhythm cycles: matra counts, vibhag divisions,
        clap patterns and thekas — illustrative, schema-validated documents in
        the RagaJSON format.
      </p>
      <ul className="cards">
        {talas.map(({ slug, doc }) => {
          const matras = doc.vibhags.reduce((sum, count) => sum + count, 0);
          return (
            <li className="card" key={slug}>
              <Link href={`/tala/${slug}`}>
                <div className="card-name-row">
                  <span className="card-name">{doc.name}</span>
                  {doc.name_devanagari && (
                    <span className="deva">{doc.name_devanagari}</span>
                  )}
                </div>
                <div className="tala-formula">
                  {matras} matras · {doc.vibhags.join("+")}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
