import json,sys,re,subprocess,numpy as np
from scipy.io import wavfile
from align import segs, align, vow
from syl import nuclei
SR=48000; TEMPO=1.0
PUNCT=tuple(',.!?:…;')
def word_times(words, spans):
    wv=[max(vow(w),0.6) for w in words]
    n,m=len(words),len(spans)
    if m>n:  # more pauses than words: merge shortest gaps
        while len(spans)>n:
            gi=min(range(len(spans)-1),key=lambda i:spans[i+1][0]-spans[i][1])
            a,b=spans[gi],spans[gi+1]; spans=spans[:gi]+[(a[0],b[1],a[2]+b[2])]+spans[gi+2:]
        m=len(spans)
    tot=sum(sp[1]-sp[0] for sp in spans); r=tot/sum(wv)
    INF=1e9; dp=[[INF]*(n+1) for _ in range(m+1)]; bk=[[0]*(n+1) for _ in range(m+1)]; dp[0][0]=0
    for j in range(1,m+1):
        d=spans[j-1][1]-spans[j-1][0]
        for i in range(j,n+1):
            for k in range(j-1,i):
                V=sum(wv[k:i]); c=dp[j-1][k]+np.log(d/(V*r))**2
                if j<m and words[i-1].endswith(PUNCT): c-=0.35
                if j<m and not words[i-1].endswith(PUNCT): c+=0.15
                if c<dp[j][i]: dp[j][i]=c; bk[j][i]=k
    cuts=[]; i=n
    for j in range(m,0,-1): k=bk[j][i]; cuts.append((k,i)); i=k
    cuts=cuts[::-1]; W=[]
    for (k,i),(sa,sb,nuc) in zip(cuts,spans):
        ws=words[k:i]; vv=wv[k:i]; V=sum(vv); nuc=sorted(nuc)
        starts=[]; c=0
        for q,w in enumerate(ws):
            if q==0: st=sa
            elif nuc:
                idx=min(len(nuc)-1,int(round(c*len(nuc)/V))); sn=max(sa,nuc[idx]-0.07)
                sl=sa+(sb-sa)*c/V; wgt=min(1.0,len(nuc)/V)*0.8; st=wgt*sn+(1-wgt)*sl
            else: st=sa+(sb-sa)*c/V
            starts.append(max(st, starts[-1]+0.08 if starts else st)); c+=vv[q]
        for q,w in enumerate(ws):
            en=starts[q+1] if q+1<len(ws) else sb
            W.append((w,round(starts[q],3),round(max(en,starts[q]+0.08),3)))
    return W

def build(fn, lines, out, lead=0.2, gap=0.42, inner=0.28, tail=1.8, extra_gap=None):
    S,_=segs(fn); S=[s for s in S if s[1]-s[0]>0.1]
    NUC=nuclei(fn)
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
            off=t-(a-pad)/TEMPO
            nuc=[off+p/TEMPO for p in NUC if a<=p<=b]
            pieces.append(seg); spans.append((t+pad/TEMPO,t+n/SR-pad/TEMPO,nuc)); t+=n/SR
        W=word_times(l['text'].split(), spans)
        tl.append(dict(l,start=round(start,3),end=round(t,3),words=W))
    pieces.append(np.zeros(int(tail*SR),np.float32)); t+=tail
    y=np.concatenate(pieces); wavfile.write(out,SR,y)
    return dict(duration=round(t,3),lines=tl)
if __name__=='__main__':
    spec=json.load(open(sys.argv[1]))
    r=build(spec['wav'],spec['lines'],spec['out'],**spec.get('opts',{}))
    json.dump(r,open(spec['timeline'],'w'),ensure_ascii=False,indent=1)
    print(r['duration']); [print(f"{l['start']:6.2f}-{l['end']:6.2f} {l['who']:8s} {l['text'][:50]}") for l in r['lines']]
