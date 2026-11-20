# Komiser Kuzgun video hattı

1. `voice.py <ep>.json` — kaydı sessizliklerden böler, senaryo satırlarına hizalar, boşlukları sıkılaştırır → `voice-*.wav` + `tl-*.json` (satır/kelime zamanları)
2. `render.py epXX.js tl.json raw.mp4 --libs epXXart.js` — HTML/SVG sahneleri Chrome ile kare kare çizer (kit.js: altyazı, etiket, damga, geçiş, ilerleme; chars.js: Kuzgun + şüpheli büstleri)
3. `mixXX.py` — sfx.py ile müzik altlığı + efektler, sese göre ducking
4. `finish.sh raw.mp4 mix.wav out.mp4` — renk/grain, -14 LUFS, H.264

Bölüm dosyaları `episodes/NN/` altında. Çalıştırırken tüm dosyaları aynı klasöre koy.

## Özel sahne görünümleri (fx.js)
- `flashback(t, svg, {iris, sepia})` + `intertitle()` + `filmTime()` — sessiz film / "o gece" geri dönüş sahneleri
- `blueprintBg()`, `bpInk()`, `bpPath()`, `bpArrow()`, `bpDim()`, `bpCircle()` — mavi teknik çizim delil diyagramları
- Örnek: `episodes/13/demo_fx.js` (`render.py demo_fx.js tl-demo.json out.mp4 --libs fx.js,ep13art.js`)
- Teknikler deenukhan/animation-styles'tan (MIT) uyarlandı; bkz. NOTICE.
