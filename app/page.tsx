import Link from "next/link";
import { Phrase } from "./components/Notation";

const YAMAN_AROHA = ["NI_MANDRA", "RE", "GA", "MA_TIVRA", "DHA", "NI", "SA_TAR"];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-notation">
            <Phrase tokens={YAMAN_AROHA} />
            <p className="hero-caption">raga Yaman — ascent, from mandra Ni to tar Sa</p>
          </div>
          <h1>Hindustani ragas as open data</h1>
          <p className="lede">
            OpenRaga is an open format and a community-curated dataset for
            describing ragas: scale movements, prominent notes, performance
            time and character — machine-readable, versioned, freely licensed.
          </p>
          <div className="hero-actions">
            <Link href="/ragas" className="button">
              Browse the ragas
            </Link>
            <a href="https://github.com/OpenRaga/ragajson">Read the format</a>
          </div>
        </div>
      </section>
      <section className="home-section">
        <div className="wrap home-grid">
          <div>
            <h2>A format</h2>
            <p>
              RagaJSON is a JSON Schema for describing a raga at the symbolic
              level: sargam notes with octave, ascent and descent, pakad
              phrases, vadi and samvadi, time of day and rasa.
            </p>
          </div>
          <div>
            <h2>A dataset</h2>
            <p>
              Ragamala Data is a digital ragamala — one document per raga,
              validated in CI, built from traditional, widely attested sources
              and licensed CC BY 4.0.
            </p>
          </div>
          <div>
            <h2>A community</h2>
            <p>
              Every raga page traces back to a reviewed pull request. Git is
              the database; contributions are open to musicians and scholars.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
