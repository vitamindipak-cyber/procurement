#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys, io
# Force UTF-8 on Windows stdout so Nepali/arrow chars don't crash
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
elif sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
"""
Generate polished Nepali neural voice-over for procurement lessons.

Uses Microsoft Edge TTS (ne-NP-SagarNeural / ne-NP-HemkalaNeural) with:
  - mstts:express-as style="newscast-formal" for authoritative lecture tone
  - Per-sentence <s> units so the neural model infers its own intonation
  - Calibrated SSML breaks: sentence · comma · dash · scene boundary
  - Phonetic dictionary: 40+ procurement acronyms → Nepali letter-by-letter
  - Emphasis prosody on key Nepali instructional phrases
  - Retry logic (3 attempts, 8-second back-off) for transient network errors

Prerequisites:
    pip install edge-tts

Usage:
    python scripts/generate_natural_voiceovers.py --all
    python scripts/generate_natural_voiceovers.py --lesson annual-procurement-plan
    python scripts/generate_natural_voiceovers.py --all --voice ne-NP-HemkalaNeural
    python scripts/generate_natural_voiceovers.py --all --rate -8%
    python scripts/generate_natural_voiceovers.py --all --remux-video   # needs FFmpeg
    python scripts/generate_natural_voiceovers.py --all --force         # re-generate even if exists
"""

import argparse
import asyncio
import os
import re
import subprocess
import sys
import time
import xml.sax.saxutils as saxutils


# ─────────────────────────────────────────────────────────────────────────────
# 1. PHONETIC DICTIONARY
#    Procurement acronyms and English loanwords → Nepali phonetic spellings.
#    The neural model reads Devanagari syllable-by-syllable, so hyphens between
#    letters produce clean letter-spelling (ई-जी-पी sounds like "ee-jee-pee").
# ─────────────────────────────────────────────────────────────────────────────
PHONETIC_REPLACEMENTS: dict[str, str] = {
    # e-GP variants
    r'\bE-GP\b':  'ई-जी-पी',
    r'\be-GP\b':  'ई-जी-पी',
    r'\bEGP\b':   'ई-जी-पी',
    r'\be\.GP\b': 'ई-जी-पी',
    # Procurement documents
    r'\bBOQ\b':   'बी-ओ-क्यु',
    r'\bBoQ\b':   'बी-ओ-क्यु',
    r'\bTOR\b':   'टी-ओ-आर',
    r'\bToR\b':   'टी-ओ-आर',
    r'\bRFP\b':   'आर-एफ-पी',
    r'\bSBD\b':   'एस-बी-डी',
    r'\bSOW\b':   'एस-ओ-डब्लु',
    # Regulatory bodies
    r'\bPPMO\b':  'पी-पी-एम-ओ',
    r'\bPPRC\b':  'पी-पी-आर-सी',
    # Tax & finance
    r'\bPAN\b':   'प्यान',
    r'\bVAT\b':   'भ्याट',
    r'\bLCs?\b':  'एल-सी',
    # Contract & process terms
    r'\bEOT\b':   'ई-ओ-टी',
    r'\bICB\b':   'आई-सी-बी',
    r'\bNCB\b':   'एन-सी-बी',
    r'\bJV\b':    'जे-भी',
    r'\bGRN\b':   'जी-आर-एन',
    r'\bMSR\b':   'एम-एस-आर',
    r'\bLOI\b':   'एल-ओ-आई',
    r'\bLOA\b':   'एल-ओ-ए',
    r'\bEOI\b':   'ई-ओ-आई',
    r'\bNTP\b':   'एन-टी-पी',
    r'\bMoU\b':   'एम-ओ-यु',
    # English loanwords — written in Devanagari to avoid robotic English pronunciation
    r'\bAudit\b':          'अडिट',
    r'\baudit\b':          'अडिट',
    r'\bSimulation\b':     'सिमुलेसन',
    r'\bsimulation\b':     'सिमुलेसन',
    r'\bspecification\b':  'स्पेसिफिकेसन',
    r'\bSpecification\b':  'स्पेसिफिकेसन',
    r'\bvariation\b':      'भेरिएसन',
    r'\bVariation\b':      'भेरिएसन',
    r'\bschedule\b':       'सेड्युल',
    r'\bSchedule\b':       'सेड्युल',
    r'\bcontract\b':       'कन्ट्र्याक्ट',
    r'\bContract\b':       'कन्ट्र्याक्ट',
    r'\bdeliverable\b':    'डेलिभरेबल',
    r'\bDeliverable\b':    'डेलिभरेबल',
    r'\bworkflow\b':       'वर्कफ्लो',
    r'\bWorkflow\b':       'वर्कफ्लो',
    r'\bcheckl?ist\b':     'चेकलिस्ट',
    r'\binventory\b':      'इन्भेन्टरी',
    r'\bInventory\b':      'इन्भेन्टरी',
    r'\bcritical.path\b':  'क्रिटिकल पाथ',
    r'\bopen.item\b':      'खुला बुँदा',
}

# ─────────────────────────────────────────────────────────────────────────────
# 2. EMPHASIS PATTERNS
#    Nepali instructional keywords that should receive a mild pitch/rate lift.
#    Key: regex pattern  →  Value: (pitch_delta, rate_delta)
#    Keep values small — neural voices exaggerate large prosody shifts.
# ─────────────────────────────────────────────────────────────────────────────
EMPHASIS_PATTERNS: list[tuple[str, str, str]] = [
    # Action imperatives
    (r'(जाँच्नुहोला|जाँच्नुपर्छ)',          '+4%',  '+0%'),
    (r'(पुष्टि\s*गर्नुहोला)',               '+4%',  '+0%'),
    (r'(अभिलेख\s*गर्नुहोला)',              '+3%',  '+0%'),
    # Warnings / "do-not" phrases
    (r'(न[मर]ान्नुहोस्|नगर्नुहोस्|नराख्नुहोस्)', '-3%', '-2%'),
    (r'(अनुमान\s*नगर्नुहोला)',              '-3%',  '-2%'),
    # Summary cues
    (r'(सारांशमा)',                          '+5%',  '-5%'),
    (r'(अब\s*(?:ज्ञान-जाँच|अभ्यास))',       '+4%',  '-3%'),
]

# ─────────────────────────────────────────────────────────────────────────────
# 3. TIMING CONSTANTS  (milliseconds)
# ─────────────────────────────────────────────────────────────────────────────
MS_AFTER_SENTENCE  = 200   # after दण्ड (।) — a full breath
MS_AFTER_COMMA     =  90   # after comma / अल्पविराम — micro-pause
MS_AFTER_DASH      = 130   # after em-dash (—) — clause boundary
MS_AFTER_COLON     = 100   # after colon (:) — slight pause before list
MS_BETWEEN_SCENES  = 950   # between दृश्यs — listener resets
MS_OPENER_PAUSE    = 400   # after the first introductory sentence of scene 1

# SSML rate & pitch defaults
DEFAULT_RATE  = "-5%"
DEFAULT_PITCH = "+0Hz"

# ─────────────────────────────────────────────────────────────────────────────
# 4. TEXT HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def apply_phonetic_tuning(text: str) -> str:
    """Replace acronyms and loanwords with Nepali phonetic forms."""
    for pattern, replacement in PHONETIC_REPLACEMENTS.items():
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    return text


def _brk(ms: int) -> str:
    return f'<break time="{ms}ms"/>'


def _apply_emphasis(text: str) -> str:
    """
    Wrap emphasis-pattern matches in <prosody> tags.
    Only applied inside sentence fragments, not around SSML tags already present.
    """
    for pattern, pitch, rate in EMPHASIS_PATTERNS:
        def replacer(m: re.Match) -> str:
            word = saxutils.escape(m.group(0))
            if pitch == '+0%' and rate == '+0%':
                return word
            attrs = []
            if pitch != '+0%':
                attrs.append(f'pitch="{pitch}"')
            if rate != '+0%':
                attrs.append(f'rate="{rate}"')
            return f'<prosody {" ".join(attrs)}>{word}</prosody>'
        text = re.sub(pattern, replacer, text)
    return text


def sentence_to_ssml(raw: str, scene_index: int, sent_index: int) -> str:
    """
    Convert a single Nepali sentence to an SSML fragment:
      1. XML-escape the text
      2. Insert micro-pauses after commas, colons, em-dashes
      3. Apply emphasis prosody on key phrases
      4. Add a slightly longer opener pause after the very first sentence
    """
    s = saxutils.escape(raw.strip())

    # Micro-pauses within the sentence
    s = re.sub(r',', f',{_brk(MS_AFTER_COMMA)}', s)
    s = re.sub(r'।', f'।{_brk(MS_AFTER_COMMA)}', s)   # mid-sentence dandas (rare)
    s = re.sub(r':', f':{_brk(MS_AFTER_COLON)}', s)
    s = re.sub(r'—', f'—{_brk(MS_AFTER_DASH)}', s)

    # Emphasis
    s = _apply_emphasis(s)

    # Opener pause: give the listener a moment after the very first sentence
    opener_break = _brk(MS_OPENER_PAUSE) if (scene_index == 0 and sent_index == 0) else ''

    return f'<s>{s}</s>{opener_break}'


def scene_to_ssml_block(title: str, narration: str, scene_index: int) -> str:
    """
    Build one SSML <p> paragraph for a scene.
    Splits on the Nepali danda (।) to get individual sentences.
    """
    tuned = apply_phonetic_tuning(narration)

    # Split on दण्ड (।), keeping it attached to its sentence
    parts = re.split(r'(।)', tuned)
    sentences: list[str] = []
    buf = ""
    for chunk in parts:
        buf += chunk
        if chunk == '।':
            stripped = buf.strip()
            if stripped:
                sentences.append(stripped)
            buf = ""
    if buf.strip():
        sentences.append(buf.strip())

    ssml_parts: list[str] = []
    for idx, sent in enumerate(sentences):
        if not sent:
            continue
        ssml_parts.append(sentence_to_ssml(sent, scene_index, idx))
        ssml_parts.append(_brk(MS_AFTER_SENTENCE))

    return "<p>\n" + "\n".join(ssml_parts) + "\n</p>"


def build_full_ssml(
    scenes: list[dict],
    voice: str = "ne-NP-SagarNeural",
    rate: str  = DEFAULT_RATE,
    pitch: str = DEFAULT_PITCH,
    use_express_as: bool = True,
) -> str:
    """
    Assemble a complete SSML document for the given scenes.

    use_express_as: wraps content in <mstts:express-as style="newscast-formal">
                    for a calm, authoritative lecture tone.
                    Set False if the voice does not support express-as.
    """
    scene_divider = f"\n{_brk(MS_BETWEEN_SCENES)}\n"
    blocks = [
        scene_to_ssml_block(s['title'], s['narration'], i)
        for i, s in enumerate(scenes)
    ]
    inner = scene_divider.join(blocks)

    if use_express_as:
        inner = (
            f'<mstts:express-as style="newscast-formal">\n'
            f'{inner}\n'
            f'</mstts:express-as>'
        )

    return f"""<speak version="1.0"
  xmlns="http://www.w3.org/2001/10/synthesis"
  xmlns:mstts="http://www.w3.org/2001/mstts"
  xml:lang="ne-NP">
  <voice name="{voice}">
    <prosody rate="{rate}" pitch="{pitch}">
{inner}
    </prosody>
  </voice>
</speak>"""


# ─────────────────────────────────────────────────────────────────────────────
# 5. TRANSCRIPT PARSER
# ─────────────────────────────────────────────────────────────────────────────

def parse_transcript_scenes(md_content: str) -> list[dict]:
    """
    Extract scene title + narration paragraphs from a transcript .md file.
    Handles both Devanagari (## दृश्य १) and ASCII digit (## दृश्य 1) headings.
    Strips blockquote (> ...) lines and horizontal rules (---).
    """
    scenes: list[dict] = []
    sections = re.split(r'\n(?=##\s*दृश्य)', md_content)
    for section in sections:
        lines = section.strip().splitlines()
        if not lines:
            continue
        heading = lines[0].strip()
        if not re.match(r'^##\s*दृश्य', heading):
            continue
        title = re.sub(r'^##\s*', '', heading).strip()
        body: list[str] = []
        for line in lines[1:]:
            stripped = line.strip()
            if not stripped:
                continue
            # Skip blockquotes, sub-headings, HR, footnotes
            if stripped.startswith('>') or stripped.startswith('#') \
               or stripped.startswith('---') or stripped.startswith('*') \
               or stripped.startswith('नेपाली voice-over'):
                continue
            body.append(stripped)
        narration = ' '.join(body).strip()
        if narration:
            scenes.append({'title': title, 'narration': narration})
    return scenes


# ─────────────────────────────────────────────────────────────────────────────
# 6. AUDIO GENERATION  (with retry on network errors)
# ─────────────────────────────────────────────────────────────────────────────

async def _attempt_save(communicate, output_path: str) -> None:
    """Call communicate.save() — extracted so we can retry it."""
    await communicate.save(output_path)


async def generate_lesson_audio(
    lesson_id: str,
    transcript_path: str,
    output_audio: str,
    voice: str = "ne-NP-SagarNeural",
    rate: str  = DEFAULT_RATE,
    max_retries: int = 5,
    retry_delay: float = 15.0,
) -> bool:
    try:
        import edge_tts
    except ImportError:
        print("  ERROR: pip install edge-tts", file=sys.stderr)
        return False

    if not os.path.exists(transcript_path):
        print(f"  Transcript not found: {transcript_path}", file=sys.stderr)
        return False

    with open(transcript_path, encoding='utf-8') as f:
        content = f.read()

    scenes = parse_transcript_scenes(content)
    if not scenes:
        print(f"  No scenes in {transcript_path}", file=sys.stderr)
        return False

    print(f"  → {lesson_id}: {len(scenes)} scenes, voice={voice}, rate={rate}")

    # Try with express-as first; fall back without it if unsupported
    for use_express in (True, False):
        ssml = build_full_ssml(scenes, voice=voice, rate=rate, use_express_as=use_express)
        communicate = edge_tts.Communicate(text=ssml, voice=voice)

        for attempt in range(1, max_retries + 1):
            try:
                os.makedirs(os.path.dirname(os.path.abspath(output_audio)), exist_ok=True)
                await _attempt_save(communicate, output_audio)
                # Verify non-empty output
                size = os.path.getsize(output_audio)
                if size < 10_000:
                    raise RuntimeError(f"Output suspiciously small: {size} bytes")
                kb = size // 1024
                label = "express-as" if use_express else "plain"
                print(f"  OK {output_audio} ({kb} KB) [{label}]")
                return True
            except Exception as exc:
                print(f"  Attempt {attempt}/{max_retries} failed: {exc}")
                if attempt < max_retries:
                    time.sleep(retry_delay)
                else:
                    if use_express:
                        print("  Retrying without express-as style...")
                        break  # try without express-as
                    return False

    return False


# ─────────────────────────────────────────────────────────────────────────────
# 7. OPTIONAL: FFmpeg video remux
# ─────────────────────────────────────────────────────────────────────────────

def remux_video_with_audio(video_input: str, audio_input: str, output_video: str) -> bool:
    for path, label in [(video_input, "video"), (audio_input, "audio")]:
        if not os.path.exists(path):
            print(f"  {label} not found: {path}", file=sys.stderr)
            return False
    cmd = [
        'ffmpeg', '-y',
        '-i', video_input, '-i', audio_input,
        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
        '-shortest', output_video,
    ]
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"  ✓ Video updated: {output_video}")
        return True
    except (subprocess.SubprocessError, FileNotFoundError) as exc:
        print(f"  FFmpeg error: {exc}", file=sys.stderr)
        return False


# ─────────────────────────────────────────────────────────────────────────────
# 8. CLI
# ─────────────────────────────────────────────────────────────────────────────

def main() -> None:
    ap = argparse.ArgumentParser(
        description="Generate polished Nepali neural TTS voice-overs.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python scripts/generate_natural_voiceovers.py --all
  python scripts/generate_natural_voiceovers.py --lesson annual-procurement-plan
  python scripts/generate_natural_voiceovers.py --all --voice ne-NP-HemkalaNeural
  python scripts/generate_natural_voiceovers.py --all --rate -8%
  python scripts/generate_natural_voiceovers.py --all --force
  python scripts/generate_natural_voiceovers.py --all --remux-video
        """,
    )
    ap.add_argument('--lesson',       type=str,  help='Lesson ID')
    ap.add_argument('--all',          action='store_true')
    ap.add_argument('--voice',        type=str,  default='ne-NP-SagarNeural',
                    choices=['ne-NP-SagarNeural', 'ne-NP-HemkalaNeural'])
    ap.add_argument('--rate',         type=str,  default=DEFAULT_RATE,
                    help='SSML rate, e.g. -5%% or -8%%')
    ap.add_argument('--force',        action='store_true',
                    help='Re-generate even if audio already exists')
    ap.add_argument('--remux-video',  action='store_true')
    args = ap.parse_args()

    base          = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    transcripts   = os.path.join(base, 'public', 'transcripts')
    audio_dir     = os.path.join(base, 'public', 'audio')
    videos_dir    = os.path.join(base, 'public', 'videos')

    if args.lesson:
        lesson_files = [(args.lesson, os.path.join(transcripts, f"{args.lesson}.ne.md"))]
    elif args.all:
        lesson_files = [
            (f[:-len('.ne.md')], os.path.join(transcripts, f))
            for f in sorted(os.listdir(transcripts))
            if f.endswith('.ne.md')
        ]
    else:
        ap.print_help()
        sys.exit(1)

    print(f"Voice: {args.voice}  |  Rate: {args.rate}  |  "
          f"Lessons: {len(lesson_files)}  |  Force: {args.force}\n")

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    ok = fail = skipped = 0

    for lesson_id, transcript_path in lesson_files:
        audio_out = os.path.join(audio_dir, f"{lesson_id}.ne.mp3")

        if not args.force and os.path.exists(audio_out):
            size = os.path.getsize(audio_out)
            if size > 200_000:
                print(f"  SKIP {lesson_id} ({size // 1024} KB already exists)")
                skipped += 1
                continue

        success = loop.run_until_complete(
            generate_lesson_audio(lesson_id, transcript_path, audio_out,
                                  voice=args.voice, rate=args.rate)
        )
        if success:
            ok += 1
            if args.remux_video:
                vin  = os.path.join(videos_dir, f"{lesson_id}.mp4")
                vout = os.path.join(videos_dir, f"{lesson_id}.remux.mp4")
                if remux_video_with_audio(vin, audio_out, vout):
                    os.replace(vout, vin)
        else:
            fail += 1

    loop.close()
    print(f"\nComplete — OK: {ok}  Skipped: {skipped}  Failed: {fail}")


if __name__ == '__main__':
    main()
