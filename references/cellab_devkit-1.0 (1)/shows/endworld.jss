
//  End of the World

top

palette bbm
pattern bbmrev

banner 15
<h1>End of the World</h1>
<p>The Endworld rule implements a reversible billiard-ball
computer using the standard evaluator and keeping
track of horizontal and vertical phase by texture
bits in the cells.  Temporal phase is implemented
by performing two steps in each generation with
different mapping of physical to logical neighbors.
The previous state of a cell is copied to plane 1:
swapping planes 0 and 1 makes the rule run backwards.</p>

<p>Let's start by demonstrating reversibility.  Begin with
a highly structured pattern and invariant reflectors and
walls, then run for a while.</p>
--

ruleprog endworld

wait 1.5
run 251

wait 1.5

banner 8
<p>Note how collisions of the balls with the barriers
and one another have randomized their positions.  But
they are, in fact, in a very special state.  Now swap
planes 0 and 1 and run for the same number of steps as
before.</p>
--

swap 0 1
run 250

wait 2.5

banner 6
<p>The original pattern has been restored.  &ldquo;But
what about the &lsquo;end of the world?&rsquo;&thinsp;&rdquo;,
you ask.  All right&mdash;here we go.  Again, run for a while
and let the state randomize.</p>
--

wait 1
run 251

banner 10
<p>The particles appear to be disordered, but actually the map
is in a state with very low entropy, since the positions of the
particles and their history allows reconstruction of the
original pattern.  Most possible states lack this order, and
will disintegrate into chaos if evolved.  Now we'll flip the state
of a single bit in the map <em>without making the corresponding
change to its history</em>.  Now when we run the rule, the discrepancy
will act like a rip in the space-time continuum which will spread
and eventually consume the entire map.</b>
--

cell ^1 180 100

run 251

wait 2.5

banner 6
<p>But the rule remains reversible!  Again, swap planes 0 and 1 and
run back to the origin of the calamity.</p>
--

swap 0 1
run 252

wait 2.5

banner 6
<p>Now fix the defect in space-time (flip the bit back) and run
back to the starting state.</p>
--

cell ^1 180 100

run 249

