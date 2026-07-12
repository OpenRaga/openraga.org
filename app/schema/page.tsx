import type { Metadata } from "next";
import ragaSchema from "@/public/schema/raga/0.2/raga.schema.json";
import talaSchema from "@/public/schema/tala/0.1/tala.schema.json";

export const metadata: Metadata = {
  title: "Schemas",
  description:
    "The RagaJSON schema family: machine-readable formats for ragas and talas, with their dictionaries of allowed values."
};

interface EnumItem {
  const: string;
  displayName: string;
  description?: string;
}

interface SchemaDef {
  title?: string;
  description?: string;
  oneOf?: EnumItem[];
}

interface SchemaDoc {
  $id: string;
  title: string;
  description: string;
  $defs?: Record<string, SchemaDef>;
}

const schemas: { label: string; file: string; doc: SchemaDoc }[] = [
  {
    label: "Raga",
    file: "raga.schema.json",
    doc: ragaSchema as unknown as SchemaDoc
  },
  {
    label: "Tala",
    file: "tala.schema.json",
    doc: talaSchema as unknown as SchemaDoc
  }
];

function versionOf(id: string): string {
  return id.match(/\/schema\/[a-z]+\/([\d.]+)\//)?.[1] ?? "";
}

function pathOf(id: string): string {
  return id.replace("https://openraga.org", "");
}

export default function SchemaPage() {
  return (
    <div className="wrap">
      <h1 className="page-title">The schemas</h1>
      <p className="page-subtitle">
        RagaJSON is a family of JSON Schemas (draft 2020-12). Every dictionary
        below is rendered from the schemas themselves — machine values with
        their human-facing display forms.
      </p>

      {schemas.map(({ label, file, doc }) => {
        const dictionaries = Object.entries(doc.$defs ?? {}).filter(
          ([, def]) => def.oneOf
        );
        return (
          <section className="home-block" key={label}>
            <p className="eyebrow">RagaJSON</p>
            <h2>
              {label} schema
              <span className="version">v{versionOf(doc.$id)}</span>
            </h2>
            <p>{doc.description}</p>
            <p className="home-link">
              <a href={pathOf(doc.$id)}>{pathOf(doc.$id)}</a>
              {" · "}
              <a
                href={`https://github.com/OpenRaga/ragajson/blob/main/schema/${file}`}
              >
                source on GitHub
              </a>
            </p>
            {dictionaries.map(([name, def]) => (
              <div className="dict" key={name}>
                <h3>
                  <code>{name}</code>
                </h3>
                {def.description && (
                  <p className="dict-desc">{def.description}</p>
                )}
                <div className="chips">
                  {def.oneOf!.map((item) => (
                    <span
                      className="chip"
                      key={item.const}
                      title={
                        item.description
                          ? `${item.const} — ${item.description}`
                          : item.const
                      }
                    >
                      {item.displayName}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        );
      })}

      <section className="home-block">
        <p className="eyebrow">Roadmap</p>
        <h2>The schemas evolve</h2>
        <p>
          The schemas are alpha: fields and dictionaries grow as the dataset
          does, guided by two principles — new fields need attestation
          in multiple independent sources, and anything derivable is not
          stored. Missing a form, an instrument, a bol? Propose it.
        </p>
        <p className="home-link">
          <a href="https://github.com/OpenRaga/ragajson/issues">
            Open an issue in ragajson
          </a>
        </p>
      </section>
    </div>
  );
}
