
//  Reversibility: the Time Tunnel
    
top
pattern timetun

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
Reversibility<br />
<br />
</h1>
--

ruleprog timetun

wait 1.5

banner 5
<h1>The Time Tunnel</h1>
<p>
This is a reversible rule.  First we'll start the
rule and let it run for 1000 generations.
</p>
--

run 1000

banner 5
<p>
Now interchange bit planes 0 and 1, then run for
another 1000 generations.
</p>
--
swap 0 1
run 1000

banner 5
<p>
We're right back where we started!
</p>
--
    
banner 5
<p>
Now let's see what happens if we change a single
bit in the map before reversing the automaton.
Again, run 1000 generations.
</p>
--

run 1000

banner 5
<p>
Now, after we swap planes 0 and 1, we'll change a
single bit in the map.
</p>
--

swap 0 1
cell ^1 160 100

banner 5
<p>
Now watch what happens when we run backwards 1000
generations.
</p>
--

run 1000

banner 5
<p>
The entire coherence of the map has been destroyed by
changing a single bit!
</p>
--

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
