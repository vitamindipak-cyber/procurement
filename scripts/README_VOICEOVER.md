# प्राकृतिक तथा स्वाभाविक भ्वाइस-ओभर गाइड

सार्वजनिक खरिदका ३० वटा भिडियो पाठहरूमा **Microsoft Azure Neural TTS** (`ne-NP-SagarNeural` / `ne-NP-HemkalaNeural`) प्रयोग गरिएको छ। ब्राउजरमा Web Audio API आधारित EQ chain थपिएको छ।

---

## १. Audio Generation Script

### तयारी
```bash
pip install edge-tts
```

### सबै ३० पाठ एकैपटक (Sagar — पुरुष आवाज)
```bash
python scripts/generate_natural_voiceovers.py --all
```

### एउटा पाठ मात्र
```bash
python scripts/generate_natural_voiceovers.py --lesson annual-procurement-plan
```

### Hemkala — महिला आवाज
```bash
python scripts/generate_natural_voiceovers.py --all --voice ne-NP-HemkalaNeural
```
यो आवाजले `.female.ne.mp3` variant बनाउँछ; `--remux-video` थप्दा पुरुष MP4 यथावत् राखेर `.female.mp4` variant बनाउँछ।

### बोल्ने गति मिलाउन (default: +20%)
```bash
# अलि ढिलो
python scripts/generate_natural_voiceovers.py --all --rate +10%

# अलि छिटो
python scripts/generate_natural_voiceovers.py --all --rate +30%
```

### भिडियोमा नयाँ audio merge गर्न (FFmpeg आवश्यक)
```bash
python scripts/generate_natural_voiceovers.py --all --remux-video
```

---

## २. Transcript बाट narration

Generator ले `## दृश्य` heading मुनिका narration अनुच्छेद मात्र बोल्छ; शीर्षक, टिप्पणी र Markdown metadata बोल्दैन। Edge TTS लाई plain text दिइन्छ, SSML markup होइन, र गति `--rate` विकल्पबाट सिधै मिलाइन्छ।

### Phonetic Dictionary
३५+ procurement acronyms लाई Nepali ध्वनिमा बदल्छ:
| Acronym | उच्चारण |
|---------|---------|
| e-GP / EGP | ई-जी-पी |
| BOQ | बी-ओ-क्यु |
| TOR | टी-ओ-आर |
| RFP | आर-एफ-पी |
| PPMO | पी-पी-एम-ओ |
| PPRC | पी-पी-आर-सी |
| IP | आई-पी |
| GRN | जी-आर-एन |
| LOI / LOA / EOI | अक्षर-अक्षर |

English terms `Red Flag(s)` पनि देवनागरी उच्चारणमा बदलिन्छन्। Slash (`/`) ले छुट्याएका विकल्पलाई बोल्दा “वा” भनिन्छ।

---

## ३. Browser-side EQ Chain (`src/utils/audioEnhancer.ts`)

Neural voice लाई browser मा थप polish दिने ५-चरणे chain:

| Node | Setting | Effect |
|------|---------|--------|
| Low-shelf warmth | +2.5 dB @ 220 Hz | Chest resonance, natural warmth |
| Presence boost | +1.8 dB @ 1200 Hz | Nepali vowel clarity (अ/आ/इ) |
| Metallic notch | −3.0 dB @ 3000 Hz | MP3 digital buzz कम गर्छ |
| Air shelf cut | −1.5 dB @ 7000 Hz | High-freq compression artefact घटाउँछ |
| Compressor | Ratio 3:1, −20 dB | Narration level consistent राख्छ |

Ambient BGM bed: F2+C3+A3 pure-tone chord, lowpass @ 300 Hz — barely audible pad जसले रोबोटिक silence gaps छोप्छ।

---

## ४. Voice comparison

| Voice | Gender | Character |
|-------|--------|-----------|
| `ne-NP-SagarNeural` | Male | Formal, clear — सरकारी पाठका लागि उपयुक्त |
| `ne-NP-HemkalaNeural` | Female | Warm, approachable — tutorial शैलीका लागि उपयुक्त |
