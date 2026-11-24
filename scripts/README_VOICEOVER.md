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

### बोल्ने गति मिलाउन (default: -5%)
```bash
# अलि ढिलो — अझ स्पष्ट सुनिन्छ
python scripts/generate_natural_voiceovers.py --all --rate -8%

# अलि छिटो
python scripts/generate_natural_voiceovers.py --all --rate -2%
```

### भिडियोमा नयाँ audio merge गर्न (FFmpeg आवश्यक)
```bash
python scripts/generate_natural_voiceovers.py --all --remux-video
```

---

## २. Script को मुख्य सुधारहरू (v2)

### SSML Prosody
Plain text को सट्टा SSML document पठाइन्छ:
- `<prosody rate="-5%">` — neural voice लाई lecture-pace मा ल्याउँछ
- `<s>...</s>` — प्रत्येक वाक्यलाई sentence unit दिन्छ
- `<break time="180ms"/>` — वाक्यपछि natural pause
- `<break time="900ms"/>` — दृश्यबीच ठूलो pause

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
| GRN | जी-आर-एन |
| LOI / LOA / EOI | अक्षर-अक्षर |

### Micro-pause Injection
- अल्पविराम (`,`) पछि: 80 ms break
- em-dash (`—`) पछि: 120 ms break

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
