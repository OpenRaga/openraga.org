import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getRaga,
  getRagas,
  getRecordings,
  getTalas,
  namesOf,
  ragaSlugVariants,
  resolveRagaSlug,
  slugify
} from "@/lib/ragas";
import { displayNote } from "@/lib/notation";
import { NotationRow, Phrase } from "../../components/Notation";
import {
  matchingSegments,
  RecordingCard,
  talaSlugSet
} from "../../components/Recordings";

// Prerender alias spellings too, so /raga/kalyan statically redirects
// to /raga/yaman.
export async function generateStaticParams() {
  return (await ragaSlugVariants()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getRaga(slug);
  if (!entry) return {};
  const canonical = `https://openraga.org/raga/${slug}`;
  const title = `Raga ${entry.doc.name}`;
  const description = entry.doc.description?.split(". ")[0];
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "OpenRaga",
      type: "article"
    }
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
  if (!entry) {
    // Alias or transliteration variant → 301 to the canonical slug.
    const canonical = await resolveRagaSlug(slug);
    if (canonical) permanentRedirect(`/raga/${canonical}`);
    notFound();
  }
  const raga = entry.doc;
  const allRagas = await getRagas();
  const knownSlugs = new Set(allRagas.map((r) => r.slug));

  const names = new Set(namesOf(raga));
  const performances = matchingSegments(await getRecordings(), (segment) =>
    segment.raga ? names.has(segment.raga.toLowerCase()) : false
  );
  const talaSlugs = talaSlugSet(await getTalas());

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
                        <Link className="chip-link" href={`/raga/${target}`}>
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
          {performances.length > 0 && (
            <section>
              <h2>Recordings</h2>
              <ul className="recordings">
                {performances.map(({ recording, segment }, i) => (
                  <RecordingCard
                    key={i}
                    recording={recording}
                    segment={segment}
                    talaSlugs={talaSlugs}
                  />
                ))}
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
          <dt>Contribute</dt>
          <dd>
            <a
              href={`https://github.com/OpenRaga/ragajson/blob/main/examples/ragas/${slug}.json`}
            >
              Improve this raga on GitHub
            </a>
          </dd>
        </dl>
      </div>
    </div>
  );
}
