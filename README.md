# openraga.org

Source of [openraga.org](https://openraga.org) — the catalog and showcase of the
[OpenRaga](https://github.com/OpenRaga) ecosystem: Hindustani ragas as open data.

## How it works

- Next.js (App Router). Raga pages are statically generated at build time from
  [ragamala-data](https://github.com/OpenRaga/ragamala-data) — git is the database.
- Sargam notation is rendered from RagaJSON note tokens following the schema's
  displayName convention (prime sign ′ for octaves, lowercase = komal, Má = tivra).
- Versioned snapshots of the [RagaJSON](https://github.com/OpenRaga/ragajson) schema
  are served from `public/schema/raga/<version>/raga.schema.json`.

## Development

```sh
npm install
npm run dev    # http://localhost:3000
npm run build  # production build (fetches ragamala-data from GitHub)
```

## License

Code is licensed under [MIT](LICENSE). Raga data shown on the site:
© OpenRaga Ragamala Data contributors, CC BY 4.0.
