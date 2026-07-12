import Link from "next/link";
import { getDataset } from "@/lib/ragas";

export default async function Home() {
  const { ragas, talas, recordings } = await getDataset();
  return (
    <div className="wrap">
      <section className="intro">
        <h1>Hindustani music as open data</h1>
      </section>

      <section className="home-block">
        <h2>The format</h2>
        <p>
          RagaJSON is a family of JSON Schemas that describe ragas, talas and
          exemplary recordings in machine-readable form.
        </p>
        <p className="home-link">
          <Link href="/schema">Explore the schemas</Link>
        </p>
      </section>

      <section className="home-block">
        <h2>The database</h2>
        <p>
          Ragamala Data uses the format to build a community-curated database:
          one document per raga, tala and recording, every change reviewed and
          validated in CI. Git is the database.
        </p>
        <p className="home-link">
          <a href="https://github.com/OpenRaga/ragamala-data">
            Browse the data on GitHub
          </a>
        </p>
      </section>

      <section className="home-block">
        <h2>The catalog</h2>
        <ul className="catalog-links">
          <li>
            <Link href="/ragas">{ragas.length} ragas</Link>
          </li>
          <li>
            <Link href="/talas">{talas.length} talas</Link>
          </li>
          <li>
            <span>
              {recordings.length} recordings — linked from raga and tala pages
            </span>
          </li>
        </ul>
      </section>

      <section className="home-block">
        <h2>Contribute</h2>
        <p>
          Add a raga, a tala or a recording through a pull request. The
          contribution guide covers sourcing rules, licensing and validation.
        </p>
        <p className="home-link">
          <a href="https://github.com/OpenRaga/ragamala-data/blob/main/CONTRIBUTING.md">
            Read the contribution guide
          </a>
        </p>
      </section>
    </div>
  );
}
