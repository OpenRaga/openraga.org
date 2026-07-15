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
        // origin to fetch them directly.
        source: "/raga/:slug.json",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }]
      }
    ];
  }
};

export default nextConfig;
