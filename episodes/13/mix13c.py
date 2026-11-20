import json
from sfx import *
TL = json.load(open('tl-cozum.json')); L = TL['lines']; D = TL['duration']
cut = lambda i: (L[i]['end'] + L[i + 1]['start']) / 2
wT = lambda i, w: next(x[1] for x in L[i]['words'] if x[0].lower().startswith(w.lower()))
E_ = [(0.0, boom(), .5), (0.05, whoosh(), .5)]
E_ += [(.2 + .15 * i, pop(), .4) for i in range(3)]
for w in ('Bir', 'iki', 'üç'): E_.append((wT(0, w), pop(), .3))
tz = wT(0, 'tuzağa'); E_ += [(tz - .1 + .08 * i, whoosh(.2), .25) for i in range(3)] + [(tz + .25, stamp(), .55)]
for i in range(6):
    if i != 5: E_.append((cut(i) - .15, whoosh(), .45))
E_ += [(wT(1, 'Cam'), pop(), .4), (wT(1, 'kırılırsa') + .1, glass(), .5), (wT(1, 'içeri'), pop(), .4)]
E_ += [(wT(2, 'parça'), pop(), .4), (wT(2, 'Hepsi') + .1, pop(), .4), (cut(1) + .1, tinkle(), .25)]
E_ += [(wT(3, 'içeriden') + .15, glass(), .55), (wT(3, 'içeriden') + .25, stamp(), .25), (wT(3, 'İçeride'), boom(), .35)]
E_ += [(cut(3) + .1, stamp(), .3), (wT(4, 'çalınmadı'), pop(), .4), (wT(4, 'sigorta') - .2, whoosh(.3), .4), (wT(4, 'peşindeydi') + .1, stamp(), .55)]
for w in L[5]['words']:
    for j in range(len(w[0])):
        if j % 2 == 0: E_.append((w[1] + (w[2] - w[1]) * j / max(1, len(w[0])), key(), .18))
E_ += [(wT(6, 'Sahte'), stamp(), .7), (wT(6, 'Sahte'), boom(), .35), (cut(6) - .15, whoosh(), .45), (cut(6), caw(), .45),
       (L[7]['start'] - .1, pop(), .4), (L[7]['end'] + .5, caw(), .5)]
E_ += [(cut(2) - .05, projector(cut(3) - cut(2) + .1), .35)]
mix('voice-cozum.wav', E_, 'mix-cozum.wav', D)
print('ok', D)
