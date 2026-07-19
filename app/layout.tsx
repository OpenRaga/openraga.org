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
    "An open, machine-readable format for Hindustani music: ragas, talas and recordings as data, with worked examples. Freely licensed."
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
              Built on <a href="https://github.com/OpenRaga/ragajson">RagaJSON</a>.{" "}
              Example data under CC BY 4.0.
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
