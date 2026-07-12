import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRecordings, getTala, getTalas, namesOf } from "@/lib/ragas";
import { displayBol, groupTheka, vibhagMarkers } from "@/lib/display";
import {
  matchingSegments,
  RecordingCard,
  talaSlugSet
} from "../../components/Recordings";

export async function generateStaticParams() {
  const talas = await getTalas();
  return talas.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getTala(slug);
  if (!entry) return {};
  return {
    title: `Tala ${entry.doc.name}`,
    description: entry.doc.description?.split(". ")[0]
  };
}

export default async function TalaPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getTala(slug);
  if (!entry) notFound();
  const tala = entry.doc;
  const matras = tala.vibhags.reduce((sum, count) => sum + count, 0);
  const markers = vibhagMarkers(tala.clap_pattern);
  const groups = groupTheka(tala.theka, tala.vibhags);

  const recordings = await getRecordings();
  const names = new Set(namesOf(tala));
  const heard = matchingSegments(recordings, (segment) =>
    (segment.talas ?? []).some((name) => names.has(name.toLowerCase()))
  );
  const talaSlugs = talaSlugSet(await getTalas());

  return (
    <div className="wrap">
      <header className="raga-header">
        {tala.name_devanagari && (
          <span className="deva-large">{tala.name_devanagari}</span>
        )}
        <h1>Tala {tala.name}</h1>
        {tala.aliases && tala.aliases.length > 0 && (
          <p className="raga-aliases">also known as {tala.aliases.join(", ")}</p>
        )}
      </header>
      <div className="raga-body">
        <div className="raga-main">
          <section>
            <h2>Theka</h2>
            <div className="theka">
              {groups.map((bols, i) => (
                <div className="vibhag" key={i}>
                  <div className="vibhag-marker">{markers[i]}</div>
                  <div className="vibhag-bols notation">
                    {bols.map((bol, j) => (
                      <span key={j}>{displayBol(bol)}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
          {tala.description && (
            <section>
              <h2>Character</h2>
              <p className="prose">{tala.description}</p>
            </section>
          )}
          {heard.length > 0 && (
            <section>
              <h2>Heard in</h2>
              <ul className="recordings">
                {heard.map(({ recording, segment }, i) => (
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
          <dt>Matras</dt>
          <dd>{matras}</dd>
          <dt>Vibhags</dt>
          <dd>{tala.vibhags.join(" + ")}</dd>
          <dt>Source</dt>
          <dd>
            <a
              href={`https://github.com/OpenRaga/ragamala-data/blob/main/data/talas/${slug}.json`}
            >
              {slug}.json
            </a>
          </dd>
        </dl>
      </div>
    </div>
  );
}
