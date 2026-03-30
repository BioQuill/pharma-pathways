// utils/extractDrug.js
// Simple extraction + small fuzzy lookup. Exports extractDrugFromInterventions and normalizeLookup.
import fs from "fs";
const stopwords = ["placebo","comparator","standard of care","standard care","vehicle","sham"];
const dosageRegex = /\b\d+(\.\d+)?\s?(mg|mcg|g|IU|ml|mL|tablet|capsule|tab|po|iv|sc|im|subcutaneous|intravenous|oral|daily|weekly|q\d+w|q\d+d)\b/ig;

function normalizeToken(t){
  return t.trim().replace(/[\.\,\;\:]+$/,"").replace(/\s+/g," ");
}

function candidateFromPrefix(text){
  const prefixes = ["drug:","intervention:","agent:","treatment:","drug name:","study drug:"];
  const lower = text.toLowerCase();
  for(const p of prefixes){
    const idx = lower.indexOf(p);
    if(idx !== -1){
      const slice = text.slice(idx + p.length).split(/;|\n/)[0];
      return normalizeToken(slice);
    }
  }
  return null;
}

function stripDosageAndRoute(s){
  return s.replace(dosageRegex, "").replace(/\b(iv|po|sc|im|oral|intravenous|subcutaneous)\b/ig, "").replace(/\(|\)/g,"").trim();
}

function levenshtein(a,b){
  const m=a.length,n=b.length;
  const dp=Array.from({length:m+1},()=>Array(n+1).fill(0));
  for(let i=0;i<=m;i++) dp[i][0]=i;
  for(let j=0;j<=n;j++) dp[0][j]=j;
  for(let i=1;i<=m;i++){
    for(let j=1;j<=n;j++){
      dp[i][j]=Math.min(
        dp[i-1][j]+1,
        dp[i][j-1]+1,
        dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1)
      );
    }
  }
  return dp[m][n];
}

function bestVocabMatch(candidate, drugList, maxDistance=3){
  if(!candidate) return null;
  const c = candidate.toLowerCase();
  let best = null;
  let bestScore = Infinity;
  for(const d of drugList){
    const name = d.name.toLowerCase();
    const dist = levenshtein(c, name);
    if(dist < bestScore){
      bestScore = dist;
      best = d;
    }
  }
  if(best && bestScore <= maxDistance) return {match: best, distance: bestScore};
  return null;
}

export function extractDrugFromInterventions(interventionsText, drugList = []){
  if(!interventionsText) return null;
  let cand = candidateFromPrefix(interventionsText);
  if(cand){
    cand = stripDosageAndRoute(cand);
    if(!stopwords.includes(cand.toLowerCase())) return cand;
  }
  const paren = interventionsText.match(/\(([^)]+)\)/);
  if(paren && paren[1] && !stopwords.includes(paren[1].toLowerCase())){
    return stripDosageAndRoute(paren[1]);
  }
  const first = interventionsText.split(/;|\n/)[0];
  let cleaned = stripDosageAndRoute(first);
  cleaned = cleaned.replace(/^[A-Za-z0-9\-\s]*:\s*/,"").trim();
  if(cleaned && !stopwords.includes(cleaned.toLowerCase())){
    const match = bestVocabMatch(cleaned, drugList);
    if(match) return match.match.name;
    return cleaned;
  }
  const match = bestVocabMatch(interventionsText, drugList);
  if(match) return match.match.name;
  return null;
}

export function normalizeLookup(drugName, drugList = []){
  if(!drugName) return null;
  const lower = drugName.toLowerCase();
  for(const d of drugList){
    if(d.name.toLowerCase() === lower) return {id: d.id, name: d.name, ta: d.ta, confidence: 1.0};
    if((d.aliases || []).map(a=>a.toLowerCase()).includes(lower)) return {id: d.id, name: d.name, ta: d.ta, confidence: 0.95};
  }
  const fuzzy = bestVocabMatch(drugName, drugList, 4);
  if(fuzzy) return {id: fuzzy.match.id, name: fuzzy.match.name, ta: fuzzy.match.ta, confidence: 0.8};
  return null;
}
