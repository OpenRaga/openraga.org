import Link from "next/link";
import {
  Entry,
  Recording,
  RecordingSegment,
  Tala,
  slugify
} from "@/lib/ragas";
import { displayToken } from "@/lib/display";

function sourceWithStart(source: string, start?: number): string {
  return start && start > 0 ? `${source}&t=${start}` : source;
}

export function RecordingCard({
  recording,
  segment,
  talaSlugs
}: {
  recording: Recording;
  segment: RecordingSegment;
  talaSlugs: Set<string>;
}) {
  return (
    <li className="recording">
      <div className="recording-head">
        <a href={sourceWithStart(recording.source, segment.start)}>
          {recording.artist}
        </a>
        {recording.year && <span className="recording-year">{recording.year}</span>}
      </div>
      <div className="chips">
        {segment.form && <span className="chip">{displayToken(segment.form)}</span>}
        {segment.instrument && (
          <span className="chip">{displayToken(segment.instrument)}</span>
        )}
        {segment.talas?.map((tala) => {
          const slug = slugify(tala);
          return talaSlugs.has(slug) ? (
            <Link className="chip chip-link" href={`/talas/${slug}`} key={tala}>
              {tala}
            </Link>
          ) : (
            <span className="chip" key={tala}>
              {tala}
            </span>
          );
        })}
      </div>
      {(segment.notes || recording.notes) && (
        <p className="recording-notes">{segment.notes ?? recording.notes}</p>
      )}
    </li>
  );
}

export function matchingSegments(
  recordings: Entry<Recording>[],
  matches: (segment: RecordingSegment) => boolean
): { recording: Recording; segment: RecordingSegment }[] {
  return recordings.flatMap(({ doc }) =>
    doc.segments
      .filter(matches)
      .map((segment) => ({ recording: doc, segment }))
  );
}

export function talaSlugSet(talas: Entry<Tala>[]): Set<string> {
  return new Set(talas.map((entry) => entry.slug));
}
