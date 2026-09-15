import itertools, math

def hex2rgb(h): h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))
def rgb2hex(r): return '#%02X%02X%02X' % tuple(max(0,min(255,int(round(v)))) for v in r)
def s2lin(c):
    c=c/255.0
    return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def lin2s(c):
    c=max(0.0,min(1.0,c))
    v=12.92*c if c<=0.0031308 else 1.055*(c**(1/2.4))-0.055
    return v*255.0

# Vienot, Brettel & Mollon 1999
def simulate(hexv, kind='deuteranopia'):
    R,G,B=[s2lin(v) for v in hex2rgb(hexv)]
    L=17.8824*R+43.5161*G+4.11935*B
    M=3.45565*R+27.1554*G+3.86714*B
    S=0.0299566*R+0.184309*G+1.46709*B
    if kind=='deuteranopia':
        L2,M2,S2 = L, 0.494207*L+1.24827*S, S
    else:  # protanopia
        L2,M2,S2 = 2.02344*M-2.52581*S, M, S
    R2= 0.0809444479*L2 -0.130504409*M2 +0.116721066*S2
    G2=-0.0102485335*L2 +0.0540193266*M2 -0.113614708*S2
    B2=-0.000365296938*L2 -0.00412161469*M2 +0.693511405*S2
    return rgb2hex([lin2s(R2),lin2s(G2),lin2s(B2)])

def rgb2lab(hexv):
    r,g,b=[s2lin(v) for v in hex2rgb(hexv)]
    X=(0.4124564*r+0.3575761*g+0.1804375*b)/0.95047
    Y=(0.2126729*r+0.7151522*g+0.0721750*b)/1.00000
    Z=(0.0193339*r+0.1191920*g+0.9503041*b)/1.08883
    f=lambda t: t**(1/3) if t>216/24389 else (841/108)*t+4/29
    fx,fy,fz=f(X),f(Y),f(Z)
    return (116*fy-16, 500*(fx-fy), 200*(fy-fz))

def de76(h1,h2):
    a,b=rgb2lab(h1),rgb2lab(h2)
    return math.sqrt(sum((x-y)**2 for x,y in zip(a,b)))

def de2000(h1,h2):
    L1,a1,b1=rgb2lab(h1); L2,a2,b2=rgb2lab(h2)
    C1=math.hypot(a1,b1); C2=math.hypot(a2,b2); Cb=(C1+C2)/2
    G=0.5*(1-math.sqrt(Cb**7/(Cb**7+25**7))) if Cb>0 else 0.5
    a1p,a2p=(1+G)*a1,(1+G)*a2
    C1p,C2p=math.hypot(a1p,b1),math.hypot(a2p,b2)
    h1p=math.degrees(math.atan2(b1,a1p))%360; h2p=math.degrees(math.atan2(b2,a2p))%360
    dLp=L2-L1; dCp=C2p-C1p
    if C1p*C2p==0: dhp=0
    elif abs(h2p-h1p)<=180: dhp=h2p-h1p
    elif h2p-h1p>180: dhp=h2p-h1p-360
    else: dhp=h2p-h1p+360
    dHp=2*math.sqrt(C1p*C2p)*math.sin(math.radians(dhp)/2)
    Lbp=(L1+L2)/2; Cbp=(C1p+C2p)/2
    if C1p*C2p==0: hbp=h1p+h2p
    elif abs(h1p-h2p)<=180: hbp=(h1p+h2p)/2
    elif h1p+h2p<360: hbp=(h1p+h2p+360)/2
    else: hbp=(h1p+h2p-360)/2
    T=1-0.17*math.cos(math.radians(hbp-30))+0.24*math.cos(math.radians(2*hbp))+0.32*math.cos(math.radians(3*hbp+6))-0.20*math.cos(math.radians(4*hbp-63))
    dth=30*math.exp(-((hbp-275)/25)**2)
    Rc=2*math.sqrt(Cbp**7/(Cbp**7+25**7)) if Cbp>0 else 0
    Sl=1+(0.015*(Lbp-50)**2)/math.sqrt(20+(Lbp-50)**2); Sc=1+0.045*Cbp; Sh=1+0.015*Cbp*T
    Rt=-math.sin(math.radians(2*dth))*Rc
    return math.sqrt((dLp/Sl)**2+(dCp/Sc)**2+(dHp/Sh)**2+Rt*(dCp/Sc)*(dHp/Sh))

light={1:'#D7E6EC',2:'#EDE3CF',3:'#E3E1EC',4:'#D9E7DC',5:'#F0DEE4',6:'#DDE1EF'}
dark ={1:'#0B1E28',2:'#1B1710',3:'#17161E',4:'#0F2015',5:'#231521',6:'#141C2B'}

for name,pal in (('LIGHT',light),('DARK',dark)):
    print(f"=== {name} palette — deuteranopia simulation ===")
    sim={k:simulate(v) for k,v in pal.items()}
    for k in pal: print(f"  tint-{k}: {pal[k]} -> {sim[k]}")
    print(f"  --- pairwise ΔE (simulated), {name} ---")
    worst=[]
    for a,b in itertools.combinations(pal,2):
        d76=de76(sim[a],sim[b]); d00=de2000(sim[a],sim[b])
        flag=' <<< COLLISION' if sim[a]==sim[b] else (' <<< critical' if d00<2 else '')
        worst.append((d00,a,b,d76,sim[a],sim[b],flag))
    for d00,a,b,d76,sa,sb,flag in sorted(worst):
        print(f"    {a}-{b}: ΔE00={d00:6.2f}  ΔE76={d76:6.2f}  {sa}/{sb}{flag}")
    print()
