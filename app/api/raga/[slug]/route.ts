import { getRaga, ragaSlugVariants, resolveRagaSlug } from "@/lib/ragas";

// Serves /raga/<slug>.json (rewritten here in next.config.ts): the raw
// RagaJSON example document for the raga, prerendered at build time.
export const dynamic = "force-static";

export async function generateStaticParams() {
  return (await ragaSlugVariants()).map((slug) => ({ slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = await getRaga(slug);
  if (!entry) {
    // Alias or spelling variant → permanent redirect to the canonical
    // document, mirroring the HTML pages.
    const canonical = await resolveRagaSlug(slug);
    if (canonical) {
      return new Response(null, {
        status: 308,
        headers: { Location: `/raga/${canonical}.json` }
      });
    }
    return Response.json({ error: "Unknown raga" }, { status: 404 });
  }
  return Response.json(entry.doc);
}
