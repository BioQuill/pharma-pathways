// server/index.js
// npm i express better-sqlite3 cors
import express from "express";
import Database from "better-sqlite3";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
const db = new Database(path.resolve("./data/trials.db"), { readonly: true });

app.get("/api/trials", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const stmt = db.prepare(`
    SELECT nct_id, title, interventions, conditions, drug_name, drug_normalized_id, ta_category, pk_flag
    FROM trials
    WHERE (lower(title) LIKE @q OR lower(interventions) LIKE @q OR lower(conditions) LIKE @q OR lower(drug_name) LIKE @q)
      AND (phase LIKE 'Phase 1%' OR phase LIKE 'Phase 2%' OR phase LIKE 'Phase 3%')
    ORDER BY updated_at DESC
    LIMIT 50
  `);
  const rows = stmt.all({ q: `%${q}%` });
  res.json(rows);
});

app.get("/api/trial/:nct", (req, res) => {
  const stmt = db.prepare(`SELECT * FROM trials WHERE nct_id = ?`);
  const row = stmt.get(req.params.nct);
  if(!row) return res.status(404).json({error:"not found"});
  res.json(row);
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`API listening on ${port}`));
