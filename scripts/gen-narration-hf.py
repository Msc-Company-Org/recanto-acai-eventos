# Gera narração de um post via HF Space (Chatterbox Multilingual TTS) — grátis, pt-BR.
# Lê content/blog/_narration/<slug>.txt, gera em trechos (<=290 chars), junta e salva
# em public/audio/<slug>.wav (ou .mp3 se ffmpeg existir), e atualiza o frontmatter.
#
# Uso: uv run --python 3.12 --with gradio_client python scripts/gen-narration-hf.py <slug>

import sys, re, os, wave, time, shutil, subprocess
from gradio_client import Client, handle_file

SPACE = "ResembleAI/Chatterbox-Multilingual-TTS"
REF = "https://github.com/gradio-app/gradio/raw/main/test/test_files/audio_sample.wav"

slug = sys.argv[1]
txt = os.path.join("content", "blog", "_narration", slug + ".txt")
text = open(txt, encoding="utf-8").read().strip()

def chunks(t, mx=290):
    parts, cur = [], ""
    for s in re.split(r"(?<=[.!?])\s+", t):
        while len(s) > mx:  # frase gigante: corta por vírgula/espaço
            cut = s.rfind(" ", 0, mx)
            cut = cut if cut > 0 else mx
            parts.append(s[:cut].strip()); s = s[cut:].strip()
        if len(cur) + len(s) + 1 > mx and cur:
            parts.append(cur.strip()); cur = s
        else:
            cur = (cur + " " + s).strip()
    if cur:
        parts.append(cur.strip())
    return parts

parts = chunks(text)
print(f"{len(parts)} trecho(s)")

c = Client(SPACE)
ref = handle_file(REF)
wavs = []
for i, ch in enumerate(parts):
    for attempt in range(3):
        try:
            r = c.predict(text_input=ch, language_id="pt", audio_prompt_path_input=ref,
                          exaggeration_input=0.5, temperature_input=0.8, seed_num_input=0,
                          cfgw_input=0.5, api_name="/generate_tts_audio")
            wavs.append(r); print(f"  trecho {i+1}/{len(parts)} ok")
            break
        except Exception as e:
            print(f"  trecho {i+1} tentativa {attempt+1} falhou: {str(e)[:120]}")
            time.sleep(20)
    else:
        raise SystemExit("falhou após retries")

os.makedirs(os.path.join("public", "audio"), exist_ok=True)
wav_out = os.path.join("public", "audio", slug + ".wav")
with wave.open(wavs[0], "rb") as w0:
    params = w0.getparams()
with wave.open(wav_out, "wb") as o:
    o.setparams(params)
    for wv in wavs:
        with wave.open(wv, "rb") as w:
            o.writeframes(w.readframes(w.getnframes()))
print("WAV:", wav_out, os.path.getsize(wav_out), "bytes")

# tenta converter pra mp3 (menor) se houver ffmpeg
audio_rel = f"/audio/{slug}.wav"
ff = shutil.which("ffmpeg")
if ff:
    mp3_out = os.path.join("public", "audio", slug + ".mp3")
    try:
        subprocess.run([ff, "-y", "-i", wav_out, "-b:a", "128k", mp3_out], check=True,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        os.remove(wav_out)
        audio_rel = f"/audio/{slug}.mp3"
        print("MP3:", mp3_out, os.path.getsize(mp3_out), "bytes")
    except Exception as e:
        print("ffmpeg falhou, mantendo wav:", str(e)[:100])
else:
    print("sem ffmpeg — mantendo wav")

# atualiza frontmatter
md = os.path.join("content", "blog", slug + ".md")
raw = open(md, encoding="utf-8").read()
m = re.match(r"^(---\r?\n)([\s\S]*?)(\r?\n---)", raw)
if m and "audio:" not in m.group(2):
    new = m.group(1) + m.group(2) + f"\naudio: {audio_rel}" + m.group(3)
    open(md, "w", encoding="utf-8").write(raw.replace(m.group(0), new, 1))
    print("frontmatter atualizado:", audio_rel)
else:
    print("frontmatter já tinha audio ou não casou; use:", audio_rel)
