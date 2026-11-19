"""Render an episode: python3 render.py ep13v.js tl-vaka.json out.mp4 [--preview t1,t2,...] [--workers 2]"""
import sys, json, subprocess, os, math, argparse
from multiprocessing import Process
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
FPS = 30


LIBS = ['kit.js', 'chars.js']


def page_html(ep, tl):
    libs = ''.join(f'<script src="file://{HERE}/{f}"></script>' for f in LIBS)
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>html,body{{margin:0;background:#000}}#root{{width:1080px;height:1920px;overflow:hidden}}</style>
    {libs}<script>const TL={json.dumps(tl, ensure_ascii=False)};</script><script src="file://{HERE}/{ep}"></script></head>
    <body><div id="root"></div></body></html>"""


def open_page(p, ep, tl):
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--disable-gpu', '--allow-file-access-from-files', '--font-render-hinting=none'])
    pg = b.new_page(viewport={'width': 1080, 'height': 1920})
    path = os.path.join(HERE, f'.page-{os.getpid()}.html')
    open(path, 'w').write(page_html(ep, tl))
    pg.goto('file://' + path)
    pg.wait_for_timeout(300)
    return b, pg


def shot(pg, t):
    pg.evaluate(f"document.getElementById('root').innerHTML = renderAt({t:.4f})")
    return pg.screenshot(type='jpeg', quality=93, clip={'x': 0, 'y': 0, 'width': 1080, 'height': 1920})


def worker(ep, tl, f0, f1, out):
    with sync_playwright() as p:
        b, pg = open_page(p, ep, tl)
        ff = subprocess.Popen(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'mjpeg', '-i', '-',
                               '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '14', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
        for i in range(f0, f1):
            ff.stdin.write(shot(pg, i / FPS))
            if (i - f0) % 150 == 0: print(f'{out}: {i - f0}/{f1 - f0}', flush=True)
        ff.stdin.close(); ff.wait(); b.close()


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('ep'); ap.add_argument('tl'); ap.add_argument('out')
    ap.add_argument('--preview'); ap.add_argument('--workers', type=int, default=2); ap.add_argument('--libs', default='')
    a = ap.parse_args()
    LIBS += [x for x in a.libs.split(',') if x]
    tl = json.load(open(a.tl))
    if a.preview:
        with sync_playwright() as p:
            b, pg = open_page(p, a.ep, tl)
            for t in a.preview.split(','):
                open(f'{a.out}-{float(t):05.2f}.jpg', 'wb').write(shot(pg, float(t)))
            b.close()
        sys.exit()
    n = math.ceil(tl['duration'] * FPS)
    k = a.workers; step = math.ceil(n / k); parts = []
    procs = []
    for j in range(k):
        part = f'{a.out}.part{j}.mp4'; parts.append(part)
        pr = Process(target=worker, args=(a.ep, tl, j * step, min(n, (j + 1) * step), part)); pr.start(); procs.append(pr)
    for pr in procs: pr.join()
    with open(a.out + '.txt', 'w') as f:
        for part in parts: f.write(f"file '{os.path.abspath(part)}'\n")
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', a.out + '.txt', '-c', 'copy', a.out], check=True)
    for part in parts: os.remove(part)
    os.remove(a.out + '.txt')
    print('done', a.out)
