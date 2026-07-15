import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Machine-readable entry point: /raga/<slug>.json serves the raw
    // ragamala-data document next to the human-readable page.
    return [{ source: "/raga/:slug.json", destination: "/api/raga/:slug" }];
  },
  async headers() {
    return [
      {
        // The JSON documents are open data — allow browser clients on any
        // origin to fetch them directly, and carry license + attribution
        // so consumers see the terms without a docs round-trip.
        source: "/raga/:slug.json",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Link",
            value: '<https://creativecommons.org/licenses/by/4.0/>; rel="license"'
          },
          {
            key: "X-Attribution",
            value:
              "(c) OpenRaga Ragamala Data contributors, CC BY 4.0, openraga.org"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
