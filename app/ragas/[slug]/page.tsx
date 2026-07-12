import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRaga, getRagas, slugify } from "@/lib/ragas";
import { displayNote } from "@/lib/notation";
import { NotationRow, Phrase } from "../../components/Notation";

export async function generateStaticParams() {
  const ragas = await getRagas();
  return ragas.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getRaga(slug);
  if (!entry) return {};
  return {
    title: `Raga ${entry.raga.name}`,
    description: entry.raga.description?.split(". ")[0]
  };
}

function PitchClass({ token }: { token: string }) {
  const note = displayNote(token);
  return (
    <span className="notation">
      <span className={note.altered ? "altered" : undefined}>{note.text}</span>
    </span>
  );
}

export default async function RagaPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getRaga(slug);
  if (!entry) notFound();
  const { raga } = entry;
  const allRagas = await getRagas();
  const knownSlugs = new Set(allRagas.map((r) => r.slug));

  return (
    <div className="wrap">
      <header className="raga-header">
        {raga.name_devanagari && (
          <span className="deva-large">{raga.name_devanagari}</span>
        )}
        <h1>Raga {raga.name}</h1>
        {raga.aliases && raga.aliases.length > 0 && (
          <p className="raga-aliases">also known as {raga.aliases.join(", ")}</p>
        )}
      </header>
      <div className="raga-body">
        <div className="raga-main">
          {(raga.structure?.aroha || raga.structure?.avaroha) && (
            <section>
              <h2>Movement</h2>
              {raga.structure.aroha && (
                <NotationRow label="Aroha — ascent" tokens={raga.structure.aroha} />
              )}
              {raga.structure.avaroha && (
                <NotationRow
                  label="Avaroha — descent"
                  tokens={raga.structure.avaroha}
                />
              )}
            </section>
          )}
          {raga.structure?.pakad && raga.structure.pakad.length > 0 && (
            <section>
              <h2>Pakad — characteristic phrases</h2>
              {raga.structure.pakad.map((phrase, i) => (
                <div className="notation-row" key={i}>
                  <Phrase tokens={phrase} />
                </div>
              ))}
            </section>
          )}
          {raga.description && (
            <section>
              <h2>Character</h2>
              <p className="prose">{raga.description}</p>
            </section>
          )}
          {raga.similar_ragas && raga.similar_ragas.length > 0 && (
            <section>
              <h2>Easily confused with</h2>
              <ul className="similar-list">
                {raga.similar_ragas.map((name) => {
                  const target = slugify(name);
                  return (
                    <li key={name}>
                      {knownSlugs.has(target) ? (
                        <Link className="chip-link" href={`/ragas/${target}`}>
                          {name}
                        </Link>
                      ) : (
                        <span className="chip-link">{name}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
        <dl className="meta">
          {raga.thaat && (
            <>
              <dt>Thaat</dt>
              <dd>{raga.thaat}</dd>
            </>
          )}
          {raga.structure?.vadi && (
            <>
              <dt>Vadi</dt>
              <dd>
                <PitchClass token={raga.structure.vadi} />
              </dd>
            </>
          )}
          {raga.structure?.samvadi && (
            <>
              <dt>Samvadi</dt>
              <dd>
                <PitchClass token={raga.structure.samvadi} />
              </dd>
            </>
          )}
          {raga.performance?.time_of_day && (
            <>
              <dt>Time</dt>
              <dd>{raga.performance.time_of_day.join(", ")}</dd>
            </>
          )}
          {raga.performance?.season && (
            <>
              <dt>Season</dt>
              <dd>{raga.performance.season}</dd>
            </>
          )}
          {raga.performance?.rasa && (
            <>
              <dt>Rasa</dt>
              <dd>{raga.performance.rasa.join(", ")}</dd>
            </>
          )}
          {raga.classification && (
            <>
              <dt>Classification</dt>
              <dd>{raga.classification.join(", ")}</dd>
            </>
          )}
          <dt>Source</dt>
          <dd>
            <a
              href={`https://github.com/OpenRaga/ragamala-data/blob/main/data/${slug}.json`}
            >
              {slug}.json
            </a>
          </dd>
        </dl>
      </div>
    </div>
  );
}
