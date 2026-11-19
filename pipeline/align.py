import sys,re,subprocess,numpy as np
def segs(f):
    out=subprocess.run(['ffmpeg','-nostdin','-i',f,'-af','silencedetect=n=-38dB:d=0.25','-f','null','-'],capture_output=True,text=True).stderr
    st=[float(v) for v in re.findall(r'silence_start: ([\d.]+)',out)]; en=[float(v) for v in re.findall(r'silence_end: ([\d.]+)',out)]
    dur=float(re.search(r'time=(\d+):(\d+):([\d.]+)',out.split('size=')[-1]).group(3)) if False else None
    S=[];cur=0.0;p=list(zip(st,en))
    if p and p[0][0]<0.01: cur=p[0][1];p=p[1:]
    for s,e in p: S.append((cur,s));cur=e
    return S,cur
def vow(t): return len(re.findall(r'[aeıioöuüAEIİOÖUÜ]',t))+0.0
def align(S,lines):
    S=[s for s in S if s[1]-s[0]>0.1]
    n=len(S);m=len(lines);V=[vow(l) for l in lines]
    tot=sum(b-a for a,b in S); r=tot/sum(V)
    INF=1e9;dp=np.full((m+1,n+1),INF);bk=np.zeros((m+1,n+1),int);dp[0,0]=0
    for i in range(1,m+1):
        for j in range(1,n+1):
            for k in range(i-1,j):
                d=S[j-1][1]-S[k][0]
                c=dp[i-1,k]+np.log(d/(V[i-1]*r))**2
                if c<dp[i,j]: dp[i,j]=c;bk[i,j]=k
    out=[];j=n
    for i in range(m,0,-1):
        k=bk[i,j];out.append((S[k][0],S[j-1][1]));j=k
    return out[::-1]
