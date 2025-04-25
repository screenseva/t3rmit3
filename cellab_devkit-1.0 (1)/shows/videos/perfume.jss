
//  Gas Diffusion: PerfumeX
    
top
palette perfume
pattern perfume

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
Gas Diffusion<br />
<br />
</h1>
--

ruleprog perfumex

wait 1.5

banner 15
<h1>PerfumeX</h1>
<p>
The rule simulates the diffusion of a gas through collisions
of particles.  The initial coherent collections of gas are
randomized entirely through deterministic collisions: no
random input is used.  Gas particles propagate along diagonals,
collide with one another and with the walls of the vessels.
Note how particles escape more readily from the open bottle
at the left than the loosely-stoppered one at the right.
</p>
--

run 2500

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
