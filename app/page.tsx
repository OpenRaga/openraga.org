import Link from "next/link";
import { getDataset } from "@/lib/ragas";

export default async function Home() {
  const { ragas, talas } = await getDataset();
  return (
    <div className="wrap">
      <section className="intro">
        <h1>OpenRaga</h1>
        <p className="lead">An open format for Hindustani music as data.</p>
        <p className="tagline">
          RagaJSON describes ragas and talas in a shared, machine-readable
          form. The pages here are worked examples of that format.
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
                <strong>Captured with precision.</strong> The format can record
                a raga&rsquo;s structure — its notes, movement and identity —
                without diluting the detail that makes it what it is.
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
                <strong>Searchable and comparable.</strong> Once ragas are data,
                they can be found by mood, time or notes, and related to one
                another instead of sitting in isolated prose.
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
            describe ragas and talas in machine-readable form. It is the shared
            language the rest of the project stands on.
          </p>
          <p className="home-link">
            <Link href="/schema">Explore the schemas</Link>
          </p>
        </section>

        <section className="home-card">
          <p className="eyebrow">Examples</p>
          <h2>
            The catalog <span className="wip">Alpha</span>
          </h2>
          <p>
            A small set of documents that conform to the schemas, so you can see
            the format in use. They are illustrative examples — not an
            authoritative reference — with conservative, textbook-level readings
            that will change as the format does.
          </p>
          <ul className="catalog-links">
            <li>
              <Link href="/ragas">{ragas.length} ragas</Link>
            </li>
            <li>
              <Link href="/talas">{talas.length} talas</Link>
            </li>
          </ul>
          <p className="home-link">
            <a href="https://github.com/OpenRaga/ragajson/tree/main/examples">
              Browse the examples on GitHub
            </a>
          </p>
        </section>

        <section className="home-card">
          <p className="eyebrow">Contribute</p>
          <h2>Shape the format</h2>
          <p>
            Improve the schemas or add an example raga or tala through a pull
            request. The repository README covers the data policy, licensing
            and validation.
          </p>
          <p className="home-link">
            <a href="https://github.com/OpenRaga/ragajson#contributing--development">
              Contribute on GitHub
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
