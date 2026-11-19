import json
from sfx import *
TL = json.load(open('tl-vaka.json')); L = TL['lines']; D = TL['duration']
cut = lambda i: (L[i]['end'] + L[i + 1]['start']) / 2
wT = lambda i, w: next(x[1] for x in L[i]['words'] if x[0].lower().startswith(w.lower()))
E_ = [(0.0, boom(), .55), (0.05, whoosh(), .5), (wT(0, 'alarm') - .05, alarm(2.6), .16), (wT(0, 'Gün'), pop(), .5)]
for i in range(8): E_.append((cut(i) - .15, whoosh(), .45))
E_ += [(cut(0) + .1, tinkle(), .35), (wT(1, 'sigortalı'), pop(), .5), (wT(1, 'çalınmıştı'), pop(), .5),
       (cut(1) + .1, glass(), .45), (wT(2, 'cam'), pop(), .5)]
for li in (3, 4, 5, 6):
    E_.append((L[li]['start'] - .1, pop(), .45))
    for w in L[li]['words']:
        for j in range(len(w[0])):
            tt = w[1] + (w[2] - w[1]) * j / max(1, len(w[0]))
            if j % 2 == 0: E_.append((tt, key(), .18))
E_ += [(cut(6), caw(), .5), (cut(6) + .05, boom(), .4), (wT(7, 'Biri'), stamp(), .45)]
t0 = cut(7)
E_ += [(t0 + .1 + .15 * i, pop(), .45) for i in range(4)]
for w in ('Bir', 'iki', 'üç', 'hiçbiri'): E_.append((wT(8, w), pop(), .35))
E_ += [(t0 + 1.0, stamp(), .3), (L[10]['start'] - 1.2, riser(1.2), .3), (L[10]['end'] + .2, caw(), .45)]
mix('voice-vaka.wav', E_, 'mix-vaka.wav', D)
print('ok', D)
