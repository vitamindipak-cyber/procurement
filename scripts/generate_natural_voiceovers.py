#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate High-Quality Natural Voice-Over for Public Procurement Animated Lessons.
Uses Microsoft Edge Neural TTS (ne-NP-SagarNeural & ne-NP-HemkalaNeural)
with custom phonetic dictionary & prosody tuning for procurement terminology.

Prerequisites:
    pip install edge-tts
"""

import argparse
import asyncio
import os
import re
import subprocess
import sys

# Standard phonetic replacements for Public Procurement terms in Nepali TTS
PHONETIC_REPLACEMENTS = {
    r'\bE-GP\b': 'ई-जी-पी',
    r'\be-GP\b': 'ई-जी-पी',
    r'\bEGP\b': 'ई-जी-पी',
    r'\bBOQ\b': 'बी-ओ-क्यु',
    r'\bTOR\b': 'टी-ओ-आर',
    r'\bToR\b': 'टी-ओ-आर',
    r'\bSBD\b': 'एस-बी-डी',
    r'\bPPMO\b': 'पी-पी-एम-ओ',
    r'\bPPRC\b': 'पी-पी-आर-सी',
    r'\bPAN\b': 'प्यान',
    r'\bVAT\b': 'भ्याट',
    r'\bEOT\b': 'ई-ओ-टी',
    r'\bICB\b': 'आई-सी-बी',
    r'\bNCB\b': 'एन-सी-बी',
    r'\bJV\b': 'जे-भी',
    r'\bAudit\b': 'अडिट',
    r'\bSpecification\b': 'स्पेसिफिकेसन',
    r'\bSchedule\b': 'सेड्युल',
    r'\bEstimate\b': 'इस्टिमेट',
    r'\bContract\b': 'कन्ट्रयाक्ट',
    r'\bVariation\b': 'भे रिएसन',
}

def apply_phonetic_tuning(text: str) -> str:
    """Replaces procurement acronyms and jargon with natural Nepali phonetic spellings."""
    tuned = text
    for pattern, replacement in PHONETIC_REPLACEMENTS.items():
        tuned = re.sub(pattern, replacement, tuned, flags=re.IGNORECASE)
    return tuned

def parse_transcript_scenes(md_content: str):
    """Extracts scenes and narration paragraphs from transcript markdown."""
    scenes = []
    # Split by scene headings (e.g. ## दृश्य 1, ## दृश्य १)
    sections = re.split(r'\n(?=## दृश्य)', md_content)
    for section in sections:
        if not section.strip().startswith('## दृश्य'):
            continue
        lines = [line.strip() for line in section.split('\n') if line.strip()]
        if not lines:
            continue
        title = lines[0].replace('##', '').strip()
        body_lines = [l for l in lines[1:] if not l.startswith('>') and not l.startswith('#') and not l.startswith('---')]
        narration = ' '.join(body_lines).strip()
        if narration:
            scenes.append({'title': title, 'narration': narration})
    return scenes

async def generate_lesson_audio(lesson_id: str, transcript_path: str, output_audio: str, voice: str = "ne-NP-SagarNeural", rate: str = "-3%"):
    try:
        import edge_tts
    except ImportError:
        print("ERROR: edge-tts is not installed. Please run: pip install edge-tts", file=sys.stderr)
        return False

    if not os.path.exists(transcript_path):
        print(f"Transcript not found: {transcript_path}", file=sys.stderr)
        return False

    with open(transcript_path, 'r', encoding='utf-8') as f:
        content = f.read()

    scenes = parse_transcript_scenes(content)
    if not scenes:
        print(f"No scenes found in transcript {transcript_path}", file=sys.stderr)
        return False

    print(f"Generating voiceover for {lesson_id} ({len(scenes)} scenes) using voice '{voice}'...")

    # Build SSML text with natural pauses between sentences and scenes
    full_text_parts = []
    for scene in scenes:
        scene_text = apply_phonetic_tuning(scene['narration'])
        # Micro pauses after full-stops and commas for natural breathing rhythm
        scene_text = scene_text.replace('।', '। ')
        scene_text = scene_text.replace(',', ', ')
        full_text_parts.append(scene_text)

    # Join with distinct scene pause (3 spaces and period for TTS break)
    combined_script = " ... ".join(full_text_parts)

    communicate = edge_tts.Communicate(text=combined_script, voice=voice, rate=rate)
    os.makedirs(os.path.dirname(os.path.abspath(output_audio)), exist_ok=True)
    await communicate.save(output_audio)

    print(f"[OK] Saved audio to {output_audio}")
    return True

def remux_video_with_audio(video_input: str, audio_input: str, output_video: str):
    """Uses ffmpeg to replace audio in mp4 video."""
    if not os.path.exists(video_input):
        print(f"Input video not found: {video_input}", file=sys.stderr)
        return False
    if not os.path.exists(audio_input):
        print(f"Input audio not found: {audio_input}", file=sys.stderr)
        return False

    cmd = [
        'ffmpeg', '-y',
        '-i', video_input,
        '-i', audio_input,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest',
        output_video
    ]
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"[OK] Updated video: {output_video}")
        return True
    except (subprocess.SubprocessError, FileNotFoundError) as e:
        print(f"FFmpeg failed or not found: {e}", file=sys.stderr)
        return False

def main():
    parser = argparse.ArgumentParser(description="Generate natural Nepali TTS for procurement lessons.")
    parser.add_argument('--lesson', type=str, help='Specific lessonId (e.g. annual-procurement-plan)')
    parser.add_argument('--all', action='store_true', help='Process all available lessons')
    parser.add_argument('--voice', type=str, default='ne-NP-SagarNeural', choices=['ne-NP-SagarNeural', 'ne-NP-HemkalaNeural'], help='Edge TTS voice model')
    parser.add_argument('--rate', type=str, default='-3%', help='Playback rate modification, e.g. -3%')
    parser.add_argument('--remux-video', action='store_true', help='Use ffmpeg to merge new audio into videos/*.mp4')

    args = parser.parse_args()

    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    transcripts_dir = os.path.join(base_dir, 'public', 'transcripts')
    audio_dir = os.path.join(base_dir, 'public', 'audio')
    videos_dir = os.path.join(base_dir, 'public', 'videos')

    lesson_files = []
    if args.lesson:
        fname = f"{args.lesson}.ne.md"
        lesson_files.append((args.lesson, os.path.join(transcripts_dir, fname)))
    elif args.all:
        for f in sorted(os.listdir(transcripts_dir)):
            if f.endswith('.ne.md'):
                lesson_id = f[:-6]
                lesson_files.append((lesson_id, os.path.join(transcripts_dir, f)))
    else:
        print("Please provide --lesson <id> or --all. Use --help for more information.")
        sys.exit(1)

    print(f"Found {len(lesson_files)} lesson transcript(s) to process.")

    loop = asyncio.get_event_loop()
    for lesson_id, transcript_path in lesson_files:
        audio_out = os.path.join(audio_dir, f"{lesson_id}.ne.mp3")
        success = loop.run_until_complete(
            generate_lesson_audio(lesson_id, transcript_path, audio_out, voice=args.voice, rate=args.rate)
        )
        if success and args.remux_video:
            video_in = os.path.join(videos_dir, f"{lesson_id}.mp4")
            temp_out = os.path.join(videos_dir, f"{lesson_id}.temp.mp4")
            if remux_video_with_audio(video_in, audio_out, temp_out):
                os.replace(temp_out, video_in)

if __name__ == '__main__':
    main()
