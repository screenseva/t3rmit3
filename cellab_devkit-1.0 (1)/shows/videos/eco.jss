
//  Ecological Models
    
top

//  Standard introduction    
banner 10
<h1 style="font-style: italic; text-align: center;">CelLab</h1>

<h3 style="font-style: italic; text-align: center;">Cellular
    Automata Laboratory</h3>

<p style="text-align: center;">
<b>http://www.fourmilab.ch/cellab/</b><br />
<br />
<img src="https://www.fourmilab.ch/images/logo/swlogo.png"
    width="82" height="74"
    alt="Fourmilab home" />
</p>
--

//  Title card
banner 8
<h1 style="text-align: center;">
<br />
Ecological Models<br />
<br />
</h1>
--

ruleprog wator

banner 25
<h1>Wator</h1>
<p>
Inspired by a simulation described by A. K. Dewdney in
<cite>Scientific American</cite>, our Wator rule models an
ecosystem of shrimp (red), fish (green), and sharks (blue)
inhabiting a toroidal water world.  Each species has its own
longevity and age of reproduction.  Fish eat shrimp and sharks
eat fish; both die from starvation if they have not fed for a
given time.  You will see waves of boom and bust for
each species propagating around the map.  A school of fish will
burgeon as it consumes shrimp, then begin to die as fish in the
middle, with no access to shrimp, starve. Then a wave of sharks
will tear into the school of fish and proliferate.  Meanwhile,
with fewer fish around, the shrimp population will begin to
recover.
</p>
--

wait 2
run 1000
wait 3

ruleprog mite

banner 20
<h1>Mite</h1>
<p>
Mite is a simulation of a predator-prey ecology developed by Dan
Drake.  It models a strawberry field (the black background) being
attacked by mites (green) which, in turn, are being eaten by
predatory mites (red).  Started from a simple pattern of a block
of prey with a few predators in the center, it evolves into a
complex and ever-changing landscape where islands of prey grow,
only to be colonized and devoured by predators with which they
eventually come into contact. 
</p>
--

wait 2
run 1000
wait 3

ruleprog brailife

banner 20
<h1>BraiLife</h1>
<p>
Two classic cellular automata rules, Brain and Life, exist
within an ecosystem.  Brain dominates space, while Life
is mostly confined to the purple planet.  As Brain colonizes
the planet, it seeds it with Life, which slowly escapes into
the adjacent space.  Brain finds it hard to return to the
planet because Life annihilates it quickly.
</p>
--

wait 2
run 1000
wait 3


//  End card
banner 0
<p style="text-align: center;">
<br />
<br />
<img src="https://www.fourmilab.ch/images/logo/swlogo.png"
    width="82" height="74"
    alt="Fourmilab home" />
<br />
<br />
<br />
<b>http://www.fourmilab.ch/cellab/</b>
</p>
--
