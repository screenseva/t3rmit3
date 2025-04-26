
//  BBM reversibility

top

banner 8
<h1>Billiard-Ball Computer Reversibility</h1>
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

banner 8
<p>Note how collisions of the balls with the barriers
and one another have randomized their positions.  But
they are, in fact, in a very special state.  We'll now
reload the evaluator, which will force the temporal
phase to 0, and run for the same number of generations
as before.</p>
--

run 501

wait 2.5

banner 3
<p>A myriad collisions have conspired to reconstruct
the original pattern.</p>
--
