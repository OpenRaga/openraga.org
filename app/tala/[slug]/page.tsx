import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getTala,
  resolveTalaSlug,
  talaSlugVariants
} from "@/lib/ragas";
import { displayBol, groupTheka, vibhagMarkers } from "@/lib/display";

// Prerender alias spellings too, so /tala/teental statically redirects
// to /tala/tintal.
export async function generateStaticParams() {
  return (await talaSlugVariants()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getTala(slug);
  if (!entry) return {};
  const canonical = `https://openraga.org/tala/${slug}`;
  const title = `Tala ${entry.doc.name}`;
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

export default async function TalaPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getTala(slug);
  if (!entry) {
    // Alias or transliteration variant → 301 to the canonical slug.
    const canonical = await resolveTalaSlug(slug);
    if (canonical) permanentRedirect(`/tala/${canonical}`);
    notFound();
  }
  const tala = entry.doc;
  const matras = tala.vibhags.reduce((sum, count) => sum + count, 0);
  const markers = vibhagMarkers(tala.clap_pattern);
  const groups = groupTheka(tala.theka, tala.vibhags);

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
        </div>
        <dl className="meta">
          <dt>Matras</dt>
          <dd>{matras}</dd>
          <dt>Vibhags</dt>
          <dd>{tala.vibhags.join(" + ")}</dd>
          <dt>Contribute</dt>
          <dd>
            <a
              href={`https://github.com/OpenRaga/ragajson/blob/main/examples/talas/${slug}.json`}
            >
              Improve this tala on GitHub
            </a>
          </dd>
        </dl>
      </div>
    </div>
  );
}
