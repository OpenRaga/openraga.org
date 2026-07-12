import type { Metadata } from "next";
import Link from "next/link";
import { getTalas } from "@/lib/ragas";

export const metadata: Metadata = {
  title: "Talas",
  description: "Catalog of Hindustani talas — rhythm cycles — from the OpenRaga dataset."
};

export default async function TalasPage() {
  const talas = await getTalas();
  return (
    <div className="wrap">
      <h1 className="page-title">The talas</h1>
      <p className="page-subtitle">
        {talas.length} rhythm cycles: matra counts, vibhag divisions, clap
        patterns and canonical thekas — machine-readable and CI-validated.
      </p>
      <ul className="cards">
        {talas.map(({ slug, doc }) => {
          const matras = doc.vibhags.reduce((sum, count) => sum + count, 0);
          return (
            <li className="card" key={slug}>
              <Link href={`/talas/${slug}`}>
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
