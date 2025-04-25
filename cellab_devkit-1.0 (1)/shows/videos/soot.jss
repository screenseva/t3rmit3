
//  Accretion: Soot
    
top
palette perfume
pattern soot

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
Accretion<br />
<br />
</h1>
--

ruleprog soot
run 1

banner 15
<h1>Soot</h1>
<p>
Randomly-propagating gas, in blue, accretes upon the yellow dot
in the middle and the yellow border, forming an <em>accretion
fractal</em>.  Why does this process form branching trees? 
Because it's easier for a randomly-moving particle to contact
the end of a branch than make it up a fork to contact a particle
closer to the root.
</p>
--

run 700

wait 2

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
