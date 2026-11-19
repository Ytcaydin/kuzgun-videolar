# Komiser Kuzgun video hattı

1. `voice.py <ep>.json` — kaydı sessizliklerden böler, senaryo satırlarına hizalar, boşlukları sıkılaştırır → `voice-*.wav` + `tl-*.json` (satır/kelime zamanları)
2. `render.py epXX.js tl.json raw.mp4 --libs epXXart.js` — HTML/SVG sahneleri Chrome ile kare kare çizer (kit.js: altyazı, etiket, damga, geçiş, ilerleme; chars.js: Kuzgun + şüpheli büstleri)
3. `mixXX.py` — sfx.py ile müzik altlığı + efektler, sese göre ducking
4. `finish.sh raw.mp4 mix.wav out.mp4` — renk/grain, -14 LUFS, H.264

Bölüm dosyaları `episodes/NN/` altında. Çalıştırırken tüm dosyaları aynı klasöre koy.
