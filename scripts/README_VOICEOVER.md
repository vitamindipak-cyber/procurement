# प्राकृतिक तथा स्वाभाविक भ्वाइस-ओभर (Natural Voice-Over) गाइड

सार्वजनिक खरिदका ३० वटा भिडियो पाठहरूमा रहेको सिन्थेटिक आवाज (TTS) लाई स्वाभाविक, मानवजस्तै र आकर्षक बनाउन यस प्रोजेक्टमा दुई तहको सुधार लागू गरिएको छ:

---

## १. ब्राउजरमा तत्काल लागू (Client-Side Real-time Audio Enhancement)
`src/components/simulation/AnimatedLearningView.tsx` र `src/utils/audioEnhancer.ts` मा **Web Audio API** आधारित दुईवटा विशेष फिचर जोडिएको छ:

1. **स्वाभाविक आवाज फिल्टर (Natural Voice Filter / Vocal Warmth):**
   * **Low-Shelf Warmth Filter (+3.2dB @ 180Hz):** सिन्थेटिक आवाजमा मानव स्वरको छातीको गम्भीरता र न्यानोपन (chest resonance) थप्छ।
   * **Notch De-buzzing Filter (-3.8dB @ 3150Hz):** रोबोटिक/सिन्थेटिक मोडलको नाकबाट आएजस्तो रुखो मेटालिक आवाज (nasal harshness) हटाउँछ।
   * **High-Shelf Sibilance Filter (-2.2dB @ 6500Hz):** डिजिटल हिज्जे र 'स/ष/श' को खस्रोपन घटाउँछ।
   * **Dynamics Compressor:** आवाजको ठूलो र सानो स्तर मिलाएर एकनासको स्टुडियो ब्रोडकास्ट बनाउँछ।

2. **हल्का पृष्ठभूमि अध्ययन धुन (Soft Ambient Study Bed):**
   * कुनै बाह्य अडियो फाइल लोड नगरी ब्राउजरमै सिन्थेसाइज हुने अत्यन्तै मन्द (soft background chord) धुन बज्छ।
   * यसले आवाजको पछाडिका डिजिटल आर्टिफ्याक्ट्स छोप्छ र वृत्तचित्र वा ई-लर्निङ एकेडेमी जस्तो व्यावसायिक अनुभव दिन्छ।
   * भिडियो/अडियो रोकिँदा (Pause वा End हुँदा) धुन स्वतः बन्द हुन्छ।
   * प्रयोगकर्ताले प्लेयरको तल रहेको बटनबाट जुनसुकै बेला यसलाई अन/अफ गर्न सक्छन्।

---

## २. नयाँ उच्च गुणस्तरको Neural Audio ब्याच उत्पादन (Batch Re-generation Script)
यदि तपाईं सिन्थेटिक अडियो फाइलहरू (`public/audio/*.ne.mp3`) लाई Microsoft Azure Neural आवाजबाट नयाँ रूपमा उत्पादन गर्न चाहनुहुन्छ भने `scripts/generate_natural_voiceovers.py` प्रयोग गर्न सक्नुहुन्छ।

### तयारी:
```bash
pip install edge-tts
```

### सबै ३० वटा पाठको नयाँ प्राकृतिक अडियो उत्पादन गर्न:
```bash
python scripts/generate_natural_voiceovers.py --all --voice ne-NP-SagarNeural
```

### कुनै एउटा पाठ मात्र उत्पादन गर्न:
```bash
python scripts/generate_natural_voiceovers.py --lesson annual-procurement-plan --voice ne-NP-SagarNeural
```

### महिला आवाज (`ne-NP-HemkalaNeural`) प्रयोग गर्न:
```bash
python scripts/generate_natural_voiceovers.py --all --voice ne-NP-HemkalaNeural
```

### भिडियो फाइलहरू (`public/videos/*.mp4`) मा पनि नयाँ अडियो सिङ्क गर्न (FFmpeg आवश्यक):
```bash
python scripts/generate_natural_voiceovers.py --all --remux-video
```

---

## ३. फोनेटिक सुधार र शब्दावली ट्युनिङ (Phonetic Dictionary)
स्क्रिप्टमा सार्वजनिक खरिदका अंग्रेजी तथा संक्षिप्त शब्दहरूलाई नेपाली ध्वनिअनुसार स्वतः परिवर्तन गर्ने सुविधा राखिएको छ:
* `E-GP` / `e-GP` $\rightarrow$ `ई-जी-पी`
* `BOQ` $\rightarrow$ `बी-ओ-क्यु`
* `TOR` $\rightarrow$ `टी-ओ-आर`
* `SBD` $\rightarrow$ `एस-बी-डी`
* `PPMO` $\rightarrow$ `पी-पी-एम-ओ`
* `PPRC` $\rightarrow$ `पी-पी-आर-सी`
* `PAN` $\rightarrow$ `प्यान`
* `VAT` $\rightarrow$ `भ्याट`
* `EOT` $\rightarrow$ `ई-ओ-टी`
* `ICB` $\rightarrow$ `आई-सी-बी`
* `NCB` $\rightarrow$ `एन-सी-बी`
* `JV` $\rightarrow$ `जे-भी`
* `Audit` $\rightarrow$ `अडिट`
* `Specification` $\rightarrow$ `स्पेसिफिकेसन`
* `Variation` $\rightarrow$ `भे रिएसन`

यसले गर्दा मोडलले अंग्रेजी वर्णहरूलाई अड्किएर उच्चारण गर्ने समस्या पूर्ण रूपमा समाधान हुन्छ।
