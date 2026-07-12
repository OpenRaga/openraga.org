"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Maintainers can opt out of being counted by setting this flag once per
// browser: localStorage.setItem("openraga-analytics-optout", "1")
const OPT_OUT_KEY = "openraga-analytics-optout";

export function SiteAnalytics() {
  return (
    <>
      <Analytics
        beforeSend={(event) => {
          if (
            typeof localStorage !== "undefined" &&
            localStorage.getItem(OPT_OUT_KEY)
          ) {
            return null;
          }
          return event;
        }}
      />
      <SpeedInsights />
    </>
  );
}
