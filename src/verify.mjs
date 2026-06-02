#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { Ajv2020 } from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const LEGAL = {
  "proposed":                  new Set(["in-comment-period", "adopted-regulation", "enacted-awaiting-effective", "withdrawn"]),
  "in-comment-period":         new Set(["adopted-regulation", "enacted-awaiting-effective", "withdrawn"]),
  "adopted-regulation":         new Set(["effective", "amended", "superseded", "sunset", "withdrawn"]),
  "enacted-awaiting-effective":new Set(["effective", "amended", "withdrawn"]),
  "effective":                 new Set(["amended", "superseded", "sunset"]),
  "amended":                   new Set(["effective", "amended", "superseded", "sunset"]),
  "superseded":                new Set(["amended", "effective"]),
  "sunset":                    new Set([]),
  "withdrawn":                 new Set([])
};

function loadJson(p) { return JSON.parse(readFileSync(p, "utf8")); }

function main() {
  const schema = loadJson(new URL("../schema/disclosure-event.schema.json", import.meta.url));
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  const statesDir = new URL("../states/", import.meta.url);
  let files;
  try { files = readdirSync(statesDir).filter((n) => n.endsWith(".ndjson")); }
  catch (e) { console.error(`could not read states/: ${e.message}`); process.exit(4); }

  if (files.length === 0) { console.log("OK — 0 state streams."); return; }

  let schemaErrors = 0, transitionErrors = 0, supersedeErrors = 0, total = 0;

  for (const file of files.sort()) {
    const raw = readFileSync(new URL(`./${file}`, statesDir), "utf8");
    const lines = raw.split(/\r?\n/).filter((l) => l.trim() !== "");
    const events = [];
    for (const [i, line] of lines.entries()) {
      try { events.push(JSON.parse(line)); }
      catch (e) { console.error(`${file}:${i+1} not JSON — ${e.message}`); schemaErrors++; }
    }
    total += events.length;

    for (const [i, ev] of events.entries()) {
      if (!validate(ev)) {
        schemaErrors++;
        console.error(`${file}:${i+1} (${ev.event_id ?? "?"}): schema errors`);
        for (const e of validate.errors ?? []) console.error(`  - ${e.instancePath || "/"} ${e.message}`);
      }
    }

    const seenIds = new Set();
    let prev = null;
    for (const [i, ev] of events.entries()) {
      if (prev && !LEGAL[prev]?.has(ev.lifecycle_state)) {
        transitionErrors++;
        console.error(`${file}:${i+1} (${ev.event_id}): illegal transition ${prev} -> ${ev.lifecycle_state}`);
      }
      if ((ev.lifecycle_state === "superseded" || ev.lifecycle_state === "amended") && ev.supersedes_event_id) {
        if (!seenIds.has(ev.supersedes_event_id)) {
          supersedeErrors++;
          console.error(`${file}:${i+1} (${ev.event_id}): supersedes_event_id ${ev.supersedes_event_id} not found earlier in stream`);
        }
      }
      seenIds.add(ev.event_id);
      prev = ev.lifecycle_state;
    }
  }

  if (schemaErrors > 0)    { console.error(`schema validation failed: ${schemaErrors}/${total}`); process.exit(1); }
  if (transitionErrors > 0){ console.error(`illegal transitions: ${transitionErrors}`); process.exit(2); }
  if (supersedeErrors > 0) { console.error(`supersedes_event_id invalid: ${supersedeErrors}`); process.exit(3); }

  console.log(`OK — ${total} events across ${files.length} state stream(s) validated, transitions legal.`);
}

main();
