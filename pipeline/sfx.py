import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt
SR = 48000
R = np.random.default_rng(7)
def t_(d): return np.arange(int(d * SR)) / SR
def env(n, a=.005, r=None):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    if r: e *= np.exp(-np.arange(n) / SR / r)
    return e
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f): return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
def norm(x, p=.9): return x / (np.abs(x).max() + 1e-9) * p

def whoosh(d=.4):
    n = int(d * SR); x = R.standard_normal(n); out = np.zeros(n); k = 1024
    for i in range(0, n, k):
        f = 400 + 3000 * np.sin(np.pi * i / n); out[i:i + k] = bp(x[i:i + k], f * .6, f * 1.4)
    return norm(out * np.sin(np.pi * np.arange(n) / n) ** 2, .7)
def boom(d=1.6):
    t = t_(d); f = 55 * np.exp(-t * 1.2) + 30
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), .003, .45) + lp(R.standard_normal(len(t)), 200) * env(len(t), .002, .12) * .5
    return norm(x, .95)
def glass(d=1.0):
    n = int(d * SR); x = hp(R.standard_normal(n), 3000) * env(n, .001, .08) * .8
    for _ in range(26):
        st = int(R.uniform(0, .45) * SR); f = R.uniform(2500, 7500); m = n - st; tt = np.arange(m) / SR
        x[st:] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * R.uniform(6, 14)) * R.uniform(.15, .4)
    return norm(x, .8)
def tinkle(d=1.2):
    n = int(d * SR); x = np.zeros(n)
    for _ in range(9):
        st = int(R.uniform(0, .8) * SR); f = R.uniform(3000, 8000); m = n - st; tt = np.arange(m) / SR
        x[st:] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 9) * R.uniform(.2, .5)
    return norm(x, .5)
def alarm(d=2.4):
    t = t_(d); f = np.where((t * 4).astype(int) % 2 == 0, 960, 760)
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .5 + np.sin(2 * np.pi * np.cumsum(f) / SR) * .5
    return norm(lp(x, 2500) * env(len(t), .01) * np.clip((d - t) / .4, 0, 1), .6)
def pop():
    t = t_(.18); return norm(np.sin(2 * np.pi * (180 * np.exp(-t * 18) + 60) * t) * env(len(t), .002, .05) + hp(R.standard_normal(len(t)), 2000) * env(len(t), .001, .01) * .3, .7)
def stamp():
    t = t_(.5); return norm(np.sin(2 * np.pi * 70 * t) * env(len(t), .001, .09) + lp(R.standard_normal(len(t)), 900) * env(len(t), .001, .05), .95)
def key():
    t = t_(.05); return norm(hp(R.standard_normal(len(t)), 1500) * env(len(t), .0005, .008) + np.sin(2 * np.pi * 1800 * t) * env(len(t), .0005, .006) * .3, .5)
def riser(d=1.2):
    t = t_(d); n = len(t); x = hp(R.standard_normal(n), 1500) * (t / d) ** 2
    return norm(x + np.sin(2 * np.pi * np.cumsum(200 + 600 * t / d) / SR) * (t / d) ** 2 * .3, .5)
def caw():
    sr, x = wavfile.read('caw.wav'); return norm(x.astype(np.float32), .9)

def bed(d, seed=1, key_hz=73.42):
    t = t_(d); n = len(t)
    drone = (np.sin(2 * np.pi * key_hz * t) * .5 + np.sin(2 * np.pi * key_hz * 1.5 * t + .3) * .25 + np.sin(2 * np.pi * key_hz * 2 * t) * .15)
    drone *= .75 + .25 * np.sin(2 * np.pi * t / 7)
    pad_notes = [key_hz * 4, key_hz * 4 * 1.189, key_hz * 4 * 1.498]
    pad = sum(np.sin(2 * np.pi * f * t + i) * (.5 + .5 * np.sin(2 * np.pi * t / (9 + i * 2) + i)) for i, f in enumerate(pad_notes)) * .06
    pulse = np.zeros(n); beat = .78
    for k in range(int(d / beat)):
        st = int(k * beat * SR); m = min(int(.4 * SR), n - st); tt = np.arange(m) / SR
        a = 1 if k % 2 == 0 else .55
        pulse[st:st + m] += np.sin(2 * np.pi * (60 * np.exp(-tt * 10) + 42) * tt) * np.exp(-tt * 9) * a
    tick = np.zeros(n)
    for k in range(int(d / (beat / 2))):
        st = int((k * beat / 2 + beat / 4) * SR); m = min(int(.04 * SR), n - st)
        if m > 0: tick[st:st + m] += hp(R.standard_normal(m), 5000) * np.exp(-np.arange(m) / SR * 120) * .08
    air = lp(R.standard_normal(n), 900) * .03
    x = drone * .45 + pad + pulse * .5 + tick + air
    fade = np.clip(t / 1.0, 0, 1) * np.clip((d - t) / 1.5, 0, 1)
    return norm(lp(x, 5000) * fade, .5)

def mix(voice_path, events, out, dur, bed_gain=.32, sfx_gain=1.0):
    sr, v = wavfile.read(voice_path); v = v.astype(np.float32)
    n = int(dur * SR); vo = np.zeros(n); vo[:min(n, len(v))] = v[:n]
    # duck envelope from voice
    h = int(.02 * SR); e = np.sqrt(np.convolve(vo ** 2, np.ones(h) / h, 'same'))
    on = (e > .02).astype(float); k = int(.25 * SR)
    sm = np.convolve(on, np.ones(k) / k, 'same'); duck = 1 - .55 * np.clip(sm * 1.5, 0, 1)
    b = bed(dur) * bed_gain * duck
    fx = np.zeros(n)
    for tm, x, g in events:
        st = int(tm * SR); m = min(len(x), n - st)
        if m > 0 and st >= 0: fx[st:st + m] += x[:m] * g * sfx_gain
    y = vo + b + fx
    y = np.stack([y, y], 1)
    wavfile.write(out, SR, (y / max(1, np.abs(y).max()) * .95).astype(np.float32))
