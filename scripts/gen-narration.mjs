// Gera narração (TTS) de um post do blog e salva em /public/audio/<slug>.mp3,
// atualizando o frontmatter com `audio: /audio/<slug>.mp3`.
//
// Uso:
//   ELEVENLABS_API_KEY=xxx node scripts/gen-narration.mjs <slug> [--provider elevenlabs|minimax]
//   (ou MINIMAX_API_KEY=xxx ... --provider minimax)
//
// Voz: ELEVEN_VOICE_ID (default: Sarah) | MINIMAX_VOICE_ID (default: female-yujie)

import fs from "node:fs";
import path from "node:path";

const slug = process.argv[2];
if (!slug) { console.error("Informe o slug: node scripts/gen-narration.mjs <slug>"); process.exit(1); }
const providerArg = (process.argv.find((a) => a.startsWith("--provider")) || "").split("=")[1]
  || (process.argv[process.argv.indexOf("--provider") + 1]) || "elevenlabs";

const ROOT = process.cwd();
const mdPath = path.join(ROOT, "content", "blog", `${slug}.md`);
if (!fs.existsSync(mdPath)) { console.error("Post não encontrado:", mdPath); process.exit(1); }

const raw = fs.readFileSync(mdPath, "utf8");
const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
const body = fm ? fm[2] : raw;

// Markdown -> texto limpo para narração
function toSpeech(md) {
  return md
    .split(/\r?\n/)
    .filter((l) => !/^\s*\|/.test(l))               // remove linhas de tabela
    .map((l) => l
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")          // remove imagens
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")       // links -> texto
      .replace(/^#{1,6}\s*/, "")                      // títulos -> frase
      .replace(/^>\s?/, "")                           // blockquote
      .replace(/[*_`#]+/g, "")                        // ênfases
      .trim())
    .join("\n")
    .replace(/\n{2,}/g, ". ")
    .replace(/\s{2,}/g, " ")
    .replace(/\.\s*\.\s*/g, ". ")
    .trim();
}
const text = toSpeech(body);
console.log(`Texto: ${text.length} caracteres`);

function chunk(str, max) {
  const parts = [];
  let cur = "";
  for (const sentence of str.split(/(?<=[.!?])\s+/)) {
    if ((cur + " " + sentence).length > max && cur) { parts.push(cur.trim()); cur = sentence; }
    else cur += " " + sentence;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

async function ttsEleven(chunks) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("Falta ELEVENLABS_API_KEY");
  const voice = process.env.ELEVEN_VOICE_ID || "EXAVITQu4vr4xnSDxMaL"; // Sarah (multilingual)
  const out = [];
  for (let i = 0; i < chunks.length; i++) {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ text: chunks[i], model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.2 } }),
    });
    if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${(await r.text()).slice(0, 200)}`);
    out.push(Buffer.from(await r.arrayBuffer()));
    console.log(`  chunk ${i + 1}/${chunks.length} ok`);
  }
  return Buffer.concat(out);
}

async function ttsMiniMax(chunks) {
  const key = process.env.MINIMAX_API_KEY;
  if (!key) throw new Error("Falta MINIMAX_API_KEY");
  let gid = "";
  try { gid = JSON.parse(Buffer.from(key.split(".")[1], "base64").toString("utf8")).GroupID || ""; } catch {}
  const voice = process.env.MINIMAX_VOICE_ID || "female-yujie";
  const out = [];
  for (let i = 0; i < chunks.length; i++) {
    const r = await fetch(`https://api.minimax.io/v1/t2a_v2?GroupId=${gid}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "speech-02-hd", text: chunks[i], stream: false, language_boost: "Portuguese", voice_setting: { voice_id: voice, speed: 1, vol: 1, pitch: 0 }, audio_setting: { sample_rate: 32000, bitrate: 128000, format: "mp3", channel: 1 } }),
    });
    const j = await r.json();
    if (!j?.data?.audio) throw new Error(`MiniMax: ${JSON.stringify(j.base_resp || j).slice(0, 200)}`);
    out.push(Buffer.from(j.data.audio, "hex"));
    console.log(`  chunk ${i + 1}/${chunks.length} ok`);
  }
  return Buffer.concat(out);
}

const maxChars = providerArg === "minimax" ? 4000 : 2500;
const chunks = chunk(text, maxChars);
console.log(`Provider: ${providerArg} | ${chunks.length} chunk(s)`);

const audio = providerArg === "minimax" ? await ttsMiniMax(chunks) : await ttsEleven(chunks);

fs.mkdirSync(path.join(ROOT, "public", "audio"), { recursive: true });
const outPath = path.join(ROOT, "public", "audio", `${slug}.mp3`);
fs.writeFileSync(outPath, audio);
console.log(`Áudio salvo: ${outPath} (${(audio.length / 1024 / 1024).toFixed(2)} MB)`);

// atualiza frontmatter com o campo audio (se ainda não tiver)
if (fm && !/^audio:/m.test(fm[1])) {
  const newFm = fm[1] + `\naudio: /audio/${slug}.mp3`;
  fs.writeFileSync(mdPath, raw.replace(fm[1], newFm));
  console.log("Frontmatter atualizado com audio:");
}
