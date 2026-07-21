/**
 * Batch-generates the 100 recipe images with OpenAI's gpt-image-1, reading
 * prompts from content/image-prompts.json (produced by
 * scripts/generate-image-prompts.ts). Run:
 *
 *   npm run generate:images            # all 100
 *   LIMIT=3 npm run generate:images    # just the first 3, to sanity-check style/cost before committing to all 100
 *   SLUGS=a,b,c npm run generate:images  # only these specific slugs, e.g. one per category for a QA pass
 *
 * Requires OPENAI_API_KEY in .env.local (see .env.example) with billing
 * enabled on the account -- this spends real money (~$0.01-0.07 per image
 * depending on QUALITY, so 100 images is roughly $1-7 USD at "medium").
 * Idempotent: skips any slug that already has a file in public/recipes/.
 */
import { config } from "dotenv";
config({ path: ".env" });
config({ path: ".env.local", override: true });
import OpenAI from "openai";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";

type PromptEntry = {
  slug: string;
  category: string;
  prompt: string;
  alt: { es: string; en: string; fr: string };
};

const OUT_DIR = path.join(process.cwd(), "public", "recipes");
const QUALITY: "low" | "medium" | "high" = (process.env.IMAGE_QUALITY as "low" | "medium" | "high") ?? "medium";
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 4);
const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : undefined;
const SLUGS = process.env.SLUGS ? new Set(process.env.SLUGS.split(",").map((s) => s.trim())) : undefined;

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY. Add it to .env.local (see .env.example) and try again.");
  process.exit(1);
}

const client = new OpenAI();

const allPrompts: PromptEntry[] = JSON.parse(
  readFileSync(path.join(process.cwd(), "content", "image-prompts.json"), "utf-8")
);
let prompts = SLUGS ? allPrompts.filter((p) => SLUGS.has(p.slug)) : allPrompts;
if (LIMIT) prompts = prompts.slice(0, LIMIT);

mkdirSync(OUT_DIR, { recursive: true });

async function generateOne(entry: PromptEntry, index: number, total: number) {
  const outPath = path.join(OUT_DIR, `${entry.slug}.png`);
  if (existsSync(outPath)) {
    console.log(`[${index + 1}/${total}] skip (already exists): ${entry.slug}`);
    return;
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await client.images.generate({
        model: "gpt-image-1",
        prompt: entry.prompt,
        size: "1536x1024",
        quality: QUALITY,
      });
      const b64 = result.data?.[0]?.b64_json;
      if (!b64) throw new Error("No image data returned");
      writeFileSync(outPath, Buffer.from(b64, "base64"));
      console.log(`[${index + 1}/${total}] done: ${entry.slug}`);
      return;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[${index + 1}/${total}] attempt ${attempt} failed for ${entry.slug}: ${message}`);
      if (attempt === 3) console.error(`[${index + 1}/${total}] GAVE UP: ${entry.slug}`);
      else await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
}

async function runPool() {
  let cursor = 0;
  const active: Promise<void>[] = [];

  async function next(): Promise<void> {
    const i = cursor++;
    if (i >= prompts.length) return;
    await generateOne(prompts[i], i, prompts.length);
    return next();
  }

  for (let w = 0; w < Math.min(CONCURRENCY, prompts.length); w++) {
    active.push(next());
  }
  await Promise.all(active);
}

async function main() {
  console.log(`Generating ${prompts.length} image(s) at quality="${QUALITY}", concurrency=${CONCURRENCY}...`);
  await runPool();
  console.log("Done. Images written to public/recipes/*.png");
}

main();
