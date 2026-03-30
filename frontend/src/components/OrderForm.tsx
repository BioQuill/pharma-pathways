import React, { useState } from "react";
import TrialSelect from "./TrialSelect";

type Trial = {
  nct_id: string;
  title: string;
  interventions: string;
  conditions: string;
  drug_name?: string;
  ta_category?: string;
  pk_flag?: number;
};

export default function OrderForm() {
  const [selected, setSelected] = useState<Trial | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) { setMessage("Please select a molecule or trial."); return; }
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        email,
        nct_id: selected.nct_id,
        drug_name: selected.drug_name || null,
        ta_category: selected.ta_category || null,
        pk_flag: selected.pk_flag || 0
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Order failed");
      setMessage("Order placed. Check your email for access instructions.");
      setEmail("");
      setSelected(null);
    } catch {
      setMessage("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submitOrder} className="card">
      <div style={{ marginBottom: 12 }}>
        <label>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Select molecule / trial</label>
        <TrialSelect onSelect={(t) => setSelected(t)} />
        {selected && (
          <div className="selected-summary">
            <strong>Selected:</strong> {selected.drug_name || selected.title} <br />
            <small className="muted">{selected.nct_id} • {selected.ta_category || "—"}</small>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <button type="submit" disabled={loading}>{loading ? "Placing order…" : "Place order"}</button>
      </div>

      {message && <div style={{ marginTop: 12 }}>{message}</div>}
    </form>
  );
}
