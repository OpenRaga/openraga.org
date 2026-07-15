import type { Metadata } from "next";
import Link from "next/link";
import { SiteAnalytics } from "./components/SiteAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OpenRaga — Hindustani music as open data",
    template: "%s · OpenRaga"
  },
  description:
    "An open format and community-curated database of Hindustani music: ragas, talas and exemplary recordings, machine-readable and freely licensed."
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
              <Link href="/talas">Talas</Link>
              <Link href="/schema">Schemas</Link>
              <a href="https://github.com/OpenRaga">GitHub</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="wrap footer-row">
            <p>
              Built with <a href="https://github.com/OpenRaga/ragajson">RagaJSON</a>.{" "}
              Data curated by the <a href="https://github.com/OpenRaga/ragamala-data">community</a> under CC BY 4.0.
            </p>
            <p>
              <a href="https://github.com/OpenRaga/openraga.org">View source code</a>
            </p>
          </div>
        </footer>
        {process.env.VERCEL_ENV === "production" && <SiteAnalytics />}
      </body>
    </html>
  );
}
