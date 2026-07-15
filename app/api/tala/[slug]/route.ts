import { getTala, resolveTalaSlug, talaSlugVariants } from "@/lib/ragas";

// Serves /tala/<slug>.json (rewritten here in next.config.ts): the raw
// ragamala-data document for the tala, prerendered at build time.
export const dynamic = "force-static";

export async function generateStaticParams() {
  return (await talaSlugVariants()).map((slug) => ({ slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = await getTala(slug);
  if (!entry) {
    // Alias or spelling variant → permanent redirect to the canonical
    // document, mirroring the HTML pages.
    const canonical = await resolveTalaSlug(slug);
    if (canonical) {
      return new Response(null, {
        status: 308,
        headers: { Location: `/tala/${canonical}.json` }
      });
    }
    return Response.json({ error: "Unknown tala" }, { status: 404 });
  }
  return Response.json(entry.doc);
}
