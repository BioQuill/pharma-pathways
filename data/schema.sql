-- data/schema.sql
CREATE TABLE IF NOT EXISTS trials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nct_id TEXT UNIQUE,
  title TEXT,
  interventions TEXT,
  conditions TEXT,
  status TEXT,
  phase TEXT,
  start_date TEXT,
  enrollment INTEGER,
  locations TEXT,
  updated_at TEXT,
  drug_name TEXT,
  drug_normalized_id TEXT,
  ta_category TEXT,
  pk_flag INTEGER DEFAULT 0,
  drug_confidence REAL DEFAULT 1.0
);
CREATE INDEX IF NOT EXISTS idx_trials_nct ON trials(nct_id);
CREATE INDEX IF NOT EXISTS idx_trials_drug_name ON trials(drug_name);
CREATE INDEX IF NOT EXISTS idx_trials_ta_category ON trials(ta_category);
