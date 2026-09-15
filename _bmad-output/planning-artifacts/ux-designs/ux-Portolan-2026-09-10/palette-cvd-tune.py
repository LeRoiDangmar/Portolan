import math, itertools, random
exec(open("palette-cvd-check.py").read().split("light={")[0])
def relL(h):
    r,g,b=[s2lin(v) for v in hex2rgb(h)]
    return 0.2126729*r+0.7151522*g+0.0721750*b
def contrast(h1,h2):
    a,b=relL(h1),relL(h2)
    if a<b:a,b=b,a
    return (a+0.05)/(b+0.05)
def lab(h): return rgb2lab(h)
def chroma(h):
    L,a,b=lab(h); return math.hypot(a,b)
def hue(h):
    L,a,b=lab(h); return math.degrees(math.atan2(b,a))%360
GROUND={'dark':'#06080A','light':'#EDF1F3'}
BAND=(1.13,1.19)
def pool(mode, cmin, cmax, step=1):
    g=GROUND[mode]; out=[]
    for r in range(0,256,step):
        for gg in range(0,256,step):
            for b in range(0,256,step):
                h=rgb2hex((r,gg,b))
                if not (BAND[0]<=contrast(h,g)<=BAND[1]): continue
                c=chroma(h)
                if c<cmin or c>cmax: continue
                out.append(h)
    return out
def angdiff(a,b):
    d=abs(a-b)%360
    return min(d,360-d)
def tune(mode, cmin, cmax, tol=14, step=2):
    P=pool(mode,cmin,cmax,step)
    if len(P)<6: return None
    simD={h:simulate(h,'deuteranopia') for h in P}
    simP={h:simulate(h,'protanopia') for h in P}
    H={h:hue(h) for h in P}
    best=None;bestv=-1;bestoff=None
    for off in range(0,60,3):
        slots=[]
        ok=True
        for k in range(6):
            tgt=(off+k*60)%360
            cand=[h for h in P if angdiff(H[h],tgt)<=tol]
            if not cand: ok=False;break
            slots.append(cand)
        if not ok: continue
        random.seed(5)
        pick=[random.choice(s) for s in slots]
        def score(sel):
            dD=min(de2000(simD[a],simD[b]) for a,b in itertools.combinations(sel,2))
            dP=min(de2000(simP[a],simP[b]) for a,b in itertools.combinations(sel,2))
            dT=min(de2000(a,b) for a,b in itertools.combinations(sel,2))
            return min(dD,dP) if dT>=5 else -1
        cur=score(pick)
        for _ in range(4000):
            i=random.randrange(6); n=random.choice(slots[i])
            if n==pick[i]: continue
            t=list(pick); t[i]=n; v=score(t)
            if v>cur: cur,pick=v,t
        if cur>bestv: bestv,best,bestoff=cur,list(pick),off
    return best,bestv,bestoff,simD,simP
for mode,cmin in (('dark',4.0),('light',4.0)):
    res=tune(mode,cmin,12.0)
    if not res or res[0] is None:
        print(f"{mode}: no solution at C* in [{cmin},12]"); continue
    best,val,off,simD,simP=res
    best=sorted(best,key=hue)
    dD=min(de2000(simD[a],simD[b]) for a,b in itertools.combinations(best,2))
    dP=min(de2000(simP[a],simP[b]) for a,b in itertools.combinations(best,2))
    dT=min(de2000(a,b) for a,b in itertools.combinations(best,2))
    sfx='-light' if mode=='light' else ''
    print(f"=== {mode.upper()} — even rotation, offset {off}deg, C* in [{cmin},12] ===")
    for i,h in enumerate(best,1):
        print(f"  zone-tint-{i}{sfx}: '{h}'  C*={chroma(h):4.1f}  hue={hue(h):5.1f}  contrast={contrast(h,GROUND[mode]):.3f}")
    print(f"  min dE00: deuteranopia {dD:.2f} | protanopia {dP:.2f} | trichromat {dT:.2f}  -> threshold 3.0 {'MET' if min(dD,dP)>=3.0 else 'NOT MET'}")
    print()
