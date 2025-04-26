
//  Annealing
    
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
Annealing<br />
<br />
</h1>
--

random 50
ruleprog majority

banner 15
<h1>Majority</h1>
<p>
Annealing is the process in metallurgy of controlling
the crystal structure of a material by controlled
heating and cooling.  Disorganized domains grow into
larger ones, rendering the metal less brittle and
more workable.  Let's start with a random pattern and
apply the Majority rule, which looks at a cell and
its eight neighbors and sets the cell to the state
(1 or 0) which is in the majority among the nine
cells.
</p>
--

run 100

wait 3

banner 10
<p>
The initial random pattern grows into interpenetrating
domains, but then rapidly freezes into a state which is
more ordered, but in which the domains remain relatively
small.  Let's try a rule which keeps things boiling.
</p>
--

banner 15
<h1>Vote</h1>
<p>
The Vote rule is like the Majority rule, except that in
close elections (5&ndash;4 and 4&ndash;5) the outcomes
are <em>reversed</em>: the cell is set to the state which
lost with four votes.  This causes stable domains to remain
stable, but creates constant flipping back and forth at
the edges, allowing domains to encounter one another and
consolidate.  We'll once again start with a random pattern.
</p>
--

random 50
ruleprog vote

wait 2

run 800

wait 2

banner 10
<p>
Smaller domains continue to consolidate into larger ones.
If we let the rule run long enough, there would be one
large red area and one large black one, with continued
fizzing along the border and a few stable or oscillating
patterns.  Every time we start from a random pattern, we'll
end up with a different final result.
</p>
--

generation 0
random 50
wait 1
run 500
wait 1

generation 0
random 50
wait 1
run 500
wait 1

generation 0
random 50
wait 1
run 500
wait 1

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
