// scripts/sync_ctg.js
// Node 18+ recommended. Installs: npm i node-fetch better-sqlite3
import fetch from "node-fetch";
import Database from "better-sqlite3";
import { extractDrugFromInterventions, normalizeLookup } from "../utils/extractDrug.js";
import fs from "fs";
import path from "path";

const DB_PATH = path.resolve("./data/trials.db");
const db = new Database(DB_PATH);
const schema = fs.readFileSync(path.resolve("./data/schema.sql"), "utf8");
db.exec(schema);

// load small drug list (seed)
const drugList = JSON.parse(fs.readFileSync(path.resolve("./data/drug_list.sample.json"), "utf8"));

const upsert = db.prepare(`
INSERT INTO trials (nct_id,title,interventions,conditions,status,phase,start_date,enrollment,locations,updated_at,drug_name,drug_normalized_id,ta_category,pk_flag,drug_confidence)
VALUES (@nct_id,@title,@interventions,@conditions,@status,@phase,@start_date,@enrollment,@locations,@updated_at,@drug_name,@drug_normalized_id,@ta_category,@pk_flag,@drug_confidence)
ON CONFLICT(nct_id) DO UPDATE SET
  title=excluded.title,
  interventions=excluded.interventions,
  conditions=excluded.conditions,
  status=excluded.status,
  phase=excluded.phase,
  start_date=excluded.start_date,
  enrollment=excluded.enrollment,
  locations=excluded.locations,
  updated_at=excluded.updated_at,
  drug_name=excluded.drug_name,
  drug_normalized_id=excluded.drug_normalized_id,
  ta_category=excluded.ta_category,
  pk_flag=excluded.pk_flag,
  drug_confidence=excluded.drug_confidence
`);
const insertMany = db.transaction((rows) => {
  for (const r of rows) upsert.run(r);
});

function flattenStudy(study) {
  const p = study.protocolSection || {};
  const status = p.statusModule?.overallStatus || "";
  const title = p.identificationModule?.briefTitle || p.identificationModule?.officialTitle || "";
  const nct = p.identifiersModule?.nctId || "";
  const interventions = (p.interventionsModule?.interventionList || [])
    .map(i => i.interventionName).filter(Boolean).join("; ");
  const conditions = (p.conditionsModule?.conditions || []).join("; ");
  const phase = (p.designModule?.phaseList?.phase || []).join(", ");
  const start_date = p.statusModule?.startDateStruct?.startDate || "";
  const enrollment = p.statusModule?.enrollmentCount || null;
  const locations = (p.contactsLocationsModule?.locations || [])
    .map(l => `${l.facility?.name || ""} ${l.facility?.address?.city || ""}`).join("; ");

  const drugName = extractDrugFromInterventions(interventions, drugList);
  const normalized = drugName ? normalizeLookup(drugName, drugList) : null;
  const ta = normalized?.ta || null;
  const pk = /pharmacokinetic|pharmacokinetics|bioavailability|SAD|MAD|pharmacokinetic study|PK/i.test((p.designModule?.designInfo || "") + " " + title);
  const confidence = normalized?.confidence ?? 1.0;

  return {
    nct_id: nct,
    title,
    interventions,
    conditions,
    status,
    phase,
    start_date,
    enrollment,
    locations,
    updated_at: new Date().toISOString(),
    drug_name: drugName,
    drug_normalized_id: normalized?.id || null,
    ta_category: ta || null,
    pk_flag: pk ? 1 : 0,
    drug_confidence: confidence
  };
}

async function fetchPage(pageToken = null, pageSize = 100) {
  const base = "https://clinicaltrials.gov/api/v2/studies";
  const params = new URLSearchParams();
  params.set("pageSize", String(pageSize));
  // filter: start date >= 2010 and phases 1-3
  params.set("filter.startDate.from", "2010-01-01");
  params.set("filter.phase", "Phase 1,Phase 2,Phase 3");
  if (pageToken) params.set("pageToken", pageToken);
  const url = `${base}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CTG fetch failed ${res.status}`);
  return res.json();
}

async function syncAll() {
  let token = null;
  let total = 0;
  do {
    const data = await fetchPage(token);
    const studies = data?.studies || [];
    const rows = studies.map(flattenStudy);
    insertMany(rows);
    total += rows.length;
    token = data?.nextPageToken || null;
    console.log(`Synced ${rows.length} studies; nextToken=${token}`);
  } while (token);
  console.log(`Sync complete. Total synced: ${total}`);
}

syncAll().catch(err => {
  console.error(err);
  process.exit(1);
});
