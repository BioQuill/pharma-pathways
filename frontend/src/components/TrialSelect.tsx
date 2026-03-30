import React, { useState, useEffect } from "react";

type Trial = {
  nct_id: string;
  title: string;
  interventions: string;
  conditions: string;
  drug_name?: string;
  ta_category?: string;
  pk_flag?: number;
};

export default function TrialSelect({ onSelect }: { onSelect: (t: Trial | null) => void }) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Trial[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    if (q.length < 2) { setItems([]); return; }
    setLoading(true);
   fetch(`http://localhost:3000/api/trials?q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then((data) => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [q]);

  return (
    <div className="card trial-select">
      <label>Search molecule or trial</label>
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Type drug, condition or trial (min 2 chars)"
      />
      {loading && <div className="muted">Loading…</div>}
      <ul>
        {items.map(it => (
          <li key={it.nct_id}>
            <button type="button" onClick={() => onSelect(it)}>
              <div><strong>{it.drug_name || it.title}</strong></div>
              <div className="muted">{it.title}</div>
              <div className="muted">{it.ta_category || ""} • {it.conditions}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
