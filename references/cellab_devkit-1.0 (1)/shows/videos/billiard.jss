
//  Billiard-Ball Computing
    
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
Billiard-Ball Computing<br />
<br />
</h1>
--

ruleprog bbm

banner 25
<h1>Bbm</h1>
<p>
Billiard-Ball Machines are theoretical mechanical computers
which perform logical operations through collisions of perfect
billiard balls with fixed structures and each other. This rule
implements such a system with a simple block rule on an
alternating lattice.  Collisions obey different laws of physics
than balls on a table, but they are consistent and sufficient to
perform all logical operations.  The walls and reflectors are
not special, but simply balls in stable configurations which do
not move.  If you let the rule run long enough, the oscillator
at the lower left will be destroyed by a collision with a ball,
and its components will fly off as four separate balls.
</p>
--

run 1000

wait 3

banner 10
<p>The billiard-ball computer implemented in the
Bbm rule is reversible.  If you run it for a while
and invert the temporal phase of the evaluator, it
will run backward to its starting point.</p>

<p>Here we'll load a complicated pattern and run it
for an odd number of steps, leaving temporal phase
as 1.</p>
--

ruleprog bbm
pattern bbmrev

wait 1.5
run 501

evaluator margolus override

wait 1.5

banner 10
<p>Note how collisions of the balls with the barriers
and one another have randomized their positions.  But
they are, in fact, in a very special state.  We'll now
reload the evaluator, which will force the temporal
phase to 0, and run for the same number of generations
as before.</p>
--

run 501

wait 2.5

banner 5
<p>Myriad collisions have conspired to reconstruct
the original pattern.</p>
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
