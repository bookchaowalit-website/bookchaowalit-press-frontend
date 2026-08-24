"use client";

import { useEffect, useMemo, useState } from "react";

type PressItem = { id: string; title: string; body: string; status: string; createdAt: number };
const STATUS = ["Published", "Pitch", "Archive"] as const;
const SEED: PressItem[] = [
  { id: "1", title: "Local tech blog", body: "Featured interview", status: "Published", createdAt: 0 },
  { id: "2", title: "Independent maker roundup", body: "Product note / pending", status: "Pitch", createdAt: 0 },
];

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw) setValue(JSON.parse(raw) as T); } catch { /* keep local seed */ }
    setReady(true);
  }, [key]);
  useEffect(() => { if (ready) localStorage.setItem(key, JSON.stringify(value)); }, [key, ready, value]);
  return [value, setValue] as const;
}

export default function Home() {
  const [items, setItems] = useLocalStorage<PressItem[]>("press-v1", SEED);
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<(typeof STATUS)[number]>("Pitch");
  const filtered = useMemo(() => items.filter((item) => `${item.title} ${item.body} ${item.status}`.toLowerCase().includes(query.toLowerCase())), [items, query]);

  const addMention = () => {
    if (!title.trim()) return;
    setItems((current) => [{ id: crypto.randomUUID(), title: title.trim(), body: body.trim() || "No detail added", status, createdAt: Date.now() }, ...current]);
    setTitle(""); setBody(""); setStatus("Pitch");
  };

  return (
    <main className="press-shell">
      <div className="press-frame">
        <header className="press-topbar"><a href="https://bookchaowalit.com" className="press-mark" aria-label="Bookchaowalit home"><span>PRESS</span> / ROOM</a><span>MENTIONS / ASSET NOTES</span><span>{items.length} LOCAL CLIPS</span></header>
        <section className="press-intro"><div><h1>Keep the proof<br /><em>in the room.</em></h1><p>A small desk for the mention, the useful detail, and the note that tells you what is still only a pitch.</p></div><div className="press-stamp" aria-hidden="true"><span>LOCAL</span><b>02</b><span>NO CMS</span></div></section>

        <section className="press-desk" aria-label="Press mention desk">
          <aside className="press-index">
            <div className="desk-head"><span>CLIP INDEX</span><span>{filtered.length} FOUND</span></div>
            <label className="press-search"><span aria-hidden="true">/</span><span className="sr-only">Search mentions</span><input placeholder="Search mentions" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
            <div className="clip-list">{filtered.length ? filtered.map((item, index) => <div className="clip-row" key={item.id}><span className="clip-number">{String(index + 1).padStart(2, "0")}</span><div><strong>{item.title}</strong><small>{item.status} / {item.body}</small></div><button type="button" aria-label={`Delete ${item.title}`} onClick={() => setItems((current) => current.filter((candidate) => candidate.id !== item.id))}>×</button></div>) : <p className="empty-clips">No clipping matches this search.</p>}</div>
          </aside>
          <section className="press-sheet">
            <div className="desk-head"><span>NEW CLIPPING / FIELD NOTE</span><span>LOCAL ONLY</span></div>
            <div className="sheet-body"><p className="field-label">ADD TO THE INDEX</p><h2>Make a mention<br /><em>easy to find.</em></h2><p className="sheet-copy">Keep a clean title, one useful detail, and a state. This is a working record—not a published press page.</p>
              <div className="press-form"><label><span>Title</span><input aria-label="Title" placeholder="Who said what?" value={title} onChange={(event) => setTitle(event.target.value)} /></label><label><span>Details</span><textarea aria-label="Details" placeholder="Link, angle, or asset note" value={body} onChange={(event) => setBody(event.target.value)} /></label><label><span>Status</span><select aria-label="Status" value={status} onChange={(event) => setStatus(event.target.value as (typeof STATUS)[number])}>{STATUS.map((item) => <option key={item}>{item}</option>)}</select></label><button type="button" className="add-mention" onClick={addMention}>Add mention</button></div>
            </div>
            <p className="boundary-note"><b>BROWSER LOCAL</b> / No upload, CMS, public feed, or newsroom sync is attached.</p>
          </section>
        </section>
        <footer className="press-footer"><span>BOOK / DEV TOOLS</span><span>SEARCH · ADD · KEEP</span></footer>
      </div>
    </main>
  );
}
