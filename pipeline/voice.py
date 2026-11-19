import json,sys,re,subprocess,numpy as np
from scipy.io import wavfile
from align import segs, align, vow
SR=48000; TEMPO=1.0
def build(fn, lines, out, lead=0.2, gap=0.42, inner=0.28, tail=1.8, extra_gap=None):
    S,_=segs(fn); S=[s for s in S if s[1]-s[0]>0.1]
    groups=align(S,[l['text'] for l in lines])
    raw=subprocess.check_output(['ffmpeg','-nostdin','-v','error','-i',fn,'-af',f'atempo={TEMPO}','-ac','1','-ar',str(SR),'-f','f32le','-'])
    x=np.frombuffer(raw,np.float32)
    T=lambda t:int(t/TEMPO*SR)
    pieces=[np.zeros(int(lead*SR),np.float32)]; t=lead; tl=[]
    for li,(l,(ga,gb)) in enumerate(zip(lines,groups)):
        if li: 
            g=gap+(extra_gap or {}).get(str(li),0); pieces.append(np.zeros(int(g*SR),np.float32)); t+=g
        segl=[s for s in S if s[0]>=ga-1e-6 and s[1]<=gb+1e-6]
        start=t; spans=[]
        for k,(a,b) in enumerate(segl):
            if k:
                g=min((a-segl[k-1][1])/TEMPO,inner); pieces.append(np.zeros(int(g*SR),np.float32)); t+=g
            pad=0.03
            seg=x[T(max(0,a-pad)):T(b+pad)].copy(); n=len(seg); f=int(0.01*SR)
            seg[:f]*=np.linspace(0,1,f); seg[-f:]*=np.linspace(1,0,f)
            pieces.append(seg); spans.append((t+pad/TEMPO,t+n/SR-pad/TEMPO)); t+=n/SR
        # word timings: distribute by vowels over spoken spans
        words=l['text'].split(); wv=[max(vow(w),0.6) for w in words]
        tot=sum(b-a for a,b in spans); cum=np.cumsum([0]+wv)/sum(wv)*tot
        def at(u):
            for a,b in spans:
                if u<=b-a+1e-9: return a+u
                u-=b-a
            return spans[-1][1]
        W=[(w,round(at(cum[i]),3),round(at(cum[i+1]),3)) for i,w in enumerate(words)]
        tl.append(dict(l,start=round(start,3),end=round(t,3),words=W))
    pieces.append(np.zeros(int(tail*SR),np.float32)); t+=tail
    y=np.concatenate(pieces); wavfile.write(out,SR,y)
    return dict(duration=round(t,3),lines=tl)
if __name__=='__main__':
    spec=json.load(open(sys.argv[1]))
    r=build(spec['wav'],spec['lines'],spec['out'],**spec.get('opts',{}))
    json.dump(r,open(spec['timeline'],'w'),ensure_ascii=False,indent=1)
    print(r['duration']); [print(f"{l['start']:6.2f}-{l['end']:6.2f} {l['who']:8s} {l['text'][:50]}") for l in r['lines']]
