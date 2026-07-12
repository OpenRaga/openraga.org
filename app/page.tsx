import Link from "next/link";
import { getDataset } from "@/lib/ragas";

export default async function Home() {
  const { ragas, talas, recordings } = await getDataset();
  return (
    <div className="wrap">
      <section className="intro">
        <h1>OpenRaga</h1>
        <p className="lead">Hindustani music as open data.</p>
        <p className="tagline">
          An open format for ragas, talas and recordings — and a catalog built
          on it.
        </p>
      </section>

      <section className="home-block">
        <p className="eyebrow">The idea</p>
        <h2>A raga is knowledge worth keeping</h2>
        <p>
          For centuries ragas lived in memory and in the hands of teachers,
          passed from guru to student. A hundred years ago pioneers like
          Bhatkhande wrote them down — and notation let ragas be taught,
          compared and studied far beyond a single lineage.
        </p>
        <p>
          OpenRaga is the next step in that tradition. It writes the structure
          of a raga — its notes, its movement, its identity — in a clear,
          shared form that both people and computers can read. A common
          language for ragas, the way sargam is a common language for pitch.
        </p>
        <p>
          Written down this way, the knowledge is no longer locked inside one
          book, one recording or one memory. It can be searched, compared,
          connected and kept — freely, and for good. That is the foundation
          everything else here is built on.
        </p>
      </section>

      <section className="home-block">
        <p className="eyebrow">Why it matters</p>
        <h2>A foundation to build on — and to last</h2>
        <div className="benefits">
          <div className="benefit-group">
            <h3>To preserve</h3>
            <ul>
              <li>
                <strong>Nothing locked away.</strong> The knowledge lives in
                the open under a free license — not in an out-of-print book, a
                private archive or one teacher&rsquo;s memory.
              </li>
              <li>
                <strong>Kept in full.</strong> A raga&rsquo;s structure is
                recorded precisely and completely, without diluting the detail
                that makes it what it is.
              </li>
              <li>
                <strong>Made to endure.</strong> Copied freely and corrected in
                the open, the record can outlast any single person, institution
                or company.
              </li>
            </ul>
          </div>
          <div className="benefit-group">
            <h3>To build on</h3>
            <ul>
              <li>
                <strong>Tools can be built on it.</strong> Learning apps, riyaz
                aids, players that actually know the raga — a shared form is
                something anyone can create with.
              </li>
              <li>
                <strong>Searchable and comparable.</strong> Find ragas by mood,
                time or notes; see how they relate; study across gharanas and
                recordings.
              </li>
              <li>
                <strong>Grows with its community.</strong> Musicians and
                scholars add and refine, every change reviewed — the format
                gets richer as more knowledge joins it.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="home-cards">
        <section className="home-card">
          <p className="eyebrow">Foundation</p>
          <h2>
            The format <span className="wip">Alpha</span>
          </h2>
          <p>
            Everything is built on RagaJSON — a family of JSON Schemas that
            describe ragas, talas and exemplary recordings in machine-readable
            form. It is the shared language the rest of the project stands on.
          </p>
          <p className="home-link">
            <Link href="/schema">Explore the schemas</Link>
          </p>
        </section>

        <section className="home-card">
          <p className="eyebrow">Catalog</p>
          <h2>
            Ragamala <span className="wip">In progress</span>
          </h2>
          <p>
            Ragamala Data is an open, community-curated collection built on the
            format: one document per raga, tala and recording, every change
            reviewed and validated in CI. Git is the database.
          </p>
          <p className="catalog-note">
            Early and under active curation — the collection is small and
            growing.
          </p>
          <ul className="catalog-links">
            <li>
              <Link href="/ragas">{ragas.length} ragas</Link>
            </li>
            <li>
              <Link href="/talas">{talas.length} talas</Link>
            </li>
            <li>
              <span>{recordings.length} recordings</span>
            </li>
          </ul>
          <p className="home-link">
            <a href="https://github.com/OpenRaga/ragamala-data">
              Browse the data on GitHub
            </a>
          </p>
        </section>

        <section className="home-card">
          <p className="eyebrow">Contribute</p>
          <h2>Add to the catalog</h2>
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
    </div>
  );
}
