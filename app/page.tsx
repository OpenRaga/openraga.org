import Link from "next/link";
import { getDataset, getRaga } from "@/lib/ragas";

// JSON.stringify(…, null, 2) puts every array element on its own line, which
// makes even a small document look huge. Collapse flat arrays of primitives
// (no nested brackets) back onto one line for a compact, readable sample.
function compactJson(value: unknown): string {
  return JSON.stringify(value, null, 2).replace(
    /\[\n\s+([^[\]{}]+?)\n\s+\]/g,
    (_, inner: string) => `[${inner.replace(/,\n\s+/g, ", ")}]`
  );
}

export default async function Home() {
  const { ragas, talas } = await getDataset();

  // A real example document, trimmed to its structural core, so the format
  // itself is the first concrete thing a visitor sees.
  const sampleEntry = (await getRaga("bhairav")) ?? ragas[0];
  const s = sampleEntry.doc;
  const sample = {
    name: s.name,
    name_devanagari: s.name_devanagari,
    system: s.system,
    thaat: s.thaat,
    structure: s.structure && {
      aroha: s.structure.aroha,
      avaroha: s.structure.avaroha,
      vadi: s.structure.vadi,
      samvadi: s.structure.samvadi
    },
    performance: s.performance
  };

  return (
    <div className="wrap">
      <section className="hero">
        <h1 className="hero-title">
          An open schema for Hindustani music as data
        </h1>
        <div className="hero-rule" />
        <p className="hero-support">
          RagaJSON is a family of JSON Schemas (draft 2020-12) — a precise,
          machine-readable, validatable way to describe ragas and talas, and a
          common language anyone can build on.
        </p>
      </section>

      <section className="home-block">
        <p className="eyebrow">The format</p>
        <h2>
          RagaJSON <span className="wip">Alpha</span>
        </h2>
        <div className="format-showcase">
          <div className="format-copy">
            <p>
              Each raga or tala is a single JSON document with a defined shape —
              scale movement, prominent notes, identity — written once, read by
              people and machines alike, and checkable against the schema.
            </p>
            <ul className="schema-list">
              <li>
                <a href="/schema/raga/0.2/raga.schema.json">raga schema</a>
                <span className="version">v0.2</span>
              </li>
              <li>
                <a href="/schema/tala/0.1/tala.schema.json">tala schema</a>
                <span className="version">v0.1</span>
              </li>
            </ul>
            <p className="home-link">
              <Link href="/schema">
                Explore the schemas and their dictionaries →
              </Link>
            </p>
          </div>
          <figure className="format-sample">
            <figcaption className="sample-label">
              {sampleEntry.slug}.json
            </figcaption>
            <pre className="code-sample">
              <code>{compactJson(sample)}</code>
            </pre>
          </figure>
        </div>
      </section>

      <section className="home-block">
        <p className="eyebrow">Why a schema</p>
        <h2>Precise, and deliberately small</h2>
        <div className="benefits">
          <div className="benefit-group">
            <h3>Machine-readable</h3>
            <ul>
              <li>
                <strong>Validatable.</strong> Every document checks against a
                JSON Schema (draft 2020-12) — an invalid note token, thaat or bol
                is simply rejected.
              </li>
              <li>
                <strong>Symbolic level.</strong> Notes, movement and identity are
                captured as tokens; ornaments and intonation stay in prose,
                outside the structured data.
              </li>
            </ul>
          </div>
          <div className="benefit-group">
            <h3>Kept lean</h3>
            <ul>
              <li>
                <strong>Nothing derivable is stored.</strong> Jati, varjit
                svaras and pitch-class sets are computed, never duplicated in the
                document.
              </li>
              <li>
                <strong>Evidence-driven.</strong> New fields need attestation
                across independent sources; the schema grows slowly and on
                purpose.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="home-cards">
        <section className="home-card">
          <p className="eyebrow">Examples</p>
          <h2>See the schema in use</h2>
          <p>
            A small, illustrative set of documents that conform to the schemas —
            worked examples, not an authoritative reference.
          </p>
          <ul className="catalog-links">
            <li>
              <Link href="/ragas">{ragas.length} ragas</Link>
            </li>
            <li>
              <Link href="/talas">{talas.length} talas</Link>
            </li>
          </ul>
        </section>

        <section className="home-card">
          <p className="eyebrow">Contribute</p>
          <h2>Shape the format</h2>
          <p>
            Improve the schemas or add an example through a pull request. The
            repository README covers the data policy, licensing and validation.
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
