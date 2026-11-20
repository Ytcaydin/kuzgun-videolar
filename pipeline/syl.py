import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfiltfilt, find_peaks
from align import segs
def nuclei(fn):
    sr,x=wavfile.read(fn); x=x.astype(np.float32)/32768
    sos=butter(4,[300,2500],'band',fs=sr,output='sos'); y=sosfiltfilt(sos,x)
    hop=int(0.01*sr); e=np.array([np.sqrt((y[i:i+2*hop]**2).mean()) for i in range(0,len(y)-2*hop,hop)])
    db=20*np.log10(e+1e-9); k=np.hanning(7);k/=k.sum(); db=np.convolve(db,k,'same')
    pk,_=find_peaks(db,prominence=4,distance=8,height=db.max()-35)
    return pk*0.01
if __name__=='__main__':
    import sys
    for fn in sys.argv[1:]:
        P=nuclei(fn); S,_=segs(fn); S=[s for s in S if s[1]-s[0]>0.1]
        for i,(a,b) in enumerate(S,1): print(f'{i:2d} {a:6.2f}-{b:6.2f} syl={((P>=a)&(P<=b)).sum()}')
        print()
