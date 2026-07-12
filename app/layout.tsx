import type { Metadata } from "next";
import Link from "next/link";
import { SiteAnalytics } from "./components/SiteAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OpenRaga — Hindustani ragas as open data",
    template: "%s · OpenRaga"
  },
  description:
    "An open format and community-curated dataset for describing Hindustani ragas: machine-readable scale movements, prominent notes, performance time and character."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="wrap header-row">
            <Link href="/" className="wordmark">
              OpenRaga
            </Link>
            <nav className="site-nav" aria-label="Site">
              <Link href="/ragas">Ragas</Link>
              <a href="/schema/raga/0.2/raga.schema.json">Schema</a>
              <a href="https://github.com/OpenRaga">GitHub</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="wrap footer-row">
            <p>
              Raga data: ©{" "}
              <a href="https://github.com/OpenRaga/ragamala-data">
                OpenRaga Ragamala Data contributors
              </a>
              , CC BY 4.0
            </p>
            <p>
              Format:{" "}
              <a href="https://github.com/OpenRaga/ragajson">RagaJSON</a> ·
              Site: <a href="https://github.com/OpenRaga/openraga.org">MIT</a>
            </p>
          </div>
        </footer>
        {process.env.VERCEL_ENV === "production" && <SiteAnalytics />}
      </body>
    </html>
  );
}
