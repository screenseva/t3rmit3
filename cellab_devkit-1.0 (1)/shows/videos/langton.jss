
//  Self-Reproduction: Langton
    
top
palette langton
pattern langton

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
Self-Reproduction<br />
<br />
</h1>
--

ruleprog langton

banner 15
<h1>Langton</h1>
<p>
Christopher Langton's self-reproducing machine demonstrates how
a simple cellular automaton can propagate copies of itself based
upon instructions circulating in a loop it contains.  The
automaton would grow forever in an infinite world, but
eventually collides with itself due to wrap-around at the edge
of our finite world.
</p>
--

run 1800

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
