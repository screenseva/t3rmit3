
//  The WebCA Demo

top

ruleprog logo
run =500

pattern billbord
wait 1

banner 5
<h1>Faders</h1>
--
ruleprog faders
pattern billbord
run

banner 5
<h1>Ruglap</h1>
<p>A rule with Laplace averaging.</p>
--
ruleprog ruglap
pattern bob
palette bleach
run

banner 5
<h1>Fredmem</h1>
<p>Fredkin's parity rule with memory.</p>
--
ruleprog fredmem
palette default
run

banner 5
<h1>Brailife</h1>
<p>Brain and Life in an ecosystem.</p>
--
ruleprog brailife
run

banner 5
<h1>Gyre</h1>
<p>Gosper's gyre.</p>
--
ruleprog gyre
run

banner 5
<h1>SoundCA</h1>
<p>A one-dimensional cellular automaton.  Used to make sound;
got better.</p>
--
ruleprog soundca
pattern shortpi
palette mask1
run

banner 5
<h1>Bob</h1>
<p>Watch how the averaging rule turns a subgenius into
a brilliant display.</p>
--
ruleprog bob
run

banner 5
<h1>Ranch</h1>
<p>Rudy's Ranch starts from a random pattern, evolving it
into land and sea using the Vote rule.  On land, the Life
rule runs, while in the sea, the Brain rule is in control.</p>
--
random 50
ruleprog ranch
run

banner 5
<h1>Langton</h1>
<p>Langton's self-reproducing machine.  The automaton would
grow forever in an infinite world, but eventually collides
with itself due to wrap-around at the edge of the finite
world.</p>
--
ruleprog langton
run

banner 5
<h1>XTC</h1>
<p>Compares two kinds of lattice gases: &ldquo;X&rdquo;
and &ldquo;T&rdquo;.  The letter &ldquo;C&rdquo; is made
up of an overlay of the two kinds of gas.</p>
--
ruleprog xtc
run

banner 5
<h1>Axons</h1>
<p>This is a one-dimensional cellular automaton with
Wofram Code 22, made reversible.</p>
--
ruleprog axons
run

banner 5
<h1>Pond</h1>
<p>Uses two copies of a lattice gas to simulate the
spread of waves when a stone is dropped into a pond.</p>
--
ruleprog pond
run

banner 5
<h1>Hodge</h1>
<p>Inspired by the Gerhardt and Schuster &ldquo;hodgepodge
machine&rdquo;, this rule quickly evolves into spirals
resembling the Belusov-Zhabotinsky reaction.</p>
--
ruleprog hodge
pattern bigant
palette default
run

banner 5
<h1>Dendrite</h1>
<p>Accretion of a randomly propagating gas onto a fixed
teapot.  Gas particles stick when touching a red
particle.</p>
--
ruleprog dendrite
pattern teapot
run

banner 5
<h1>Ecolibra</h1>
<p>An ecology where Brain runs in the dark sea and
Life runs on the red land.  A concentration of Brain
or Life can turn sea into land or vice versa.</p>
--
ruleprog ecolibra
run

banner 5
<h1>VoteDNA</h1>
<p>The Vote rule with history marking the boundaries
resembles tangled strands of DNA.</p>
--
ruleprog votedna
random 50
run

banner 5
<h1>ShortPI</h1>
<p>A one dimensional rule with two bits of state from
two neighbors on each side exhibits interacting gliders.</p>
--
ruleprog shortpi
pattern shortpi
palette default
run

banner 5
<h1>Life</h1>
<p>The classic game of Life with a one-state history.</p>
--
ruleprog life
random 50
run

banner 5
<h1>Heat</h1>
<p>An averaging rule simulates the flow of heat between hot
and cold objects.</p>
--
ruleprog heat
pattern heat
run

banner 5
<h1>Heatwave</h1>
<p>Heat flow with cycling non-fixed cells to produce turbulence.</p>
--
ruleprog heatwave
pattern startrek
palette autocad
run

banner 5
<h1>Sublime</h1>
<p>Sublimation of a solid into gas is simulated by a random
gas diffusion rule.</p>
--
ruleprog sublime
run

banner 5
<h1>RainZha</h1>
<p>A simple NLUKY rule quickly generates Zhabotinsky-type
spiral patterns.</p>
--
ruleprog rainzha
pattern bob
run

banner 5
<h1>Aurora</h1>
<p>A one-dimensional rule averages each cell with four bits of
state of its left and right neighbors.</p>
--
ruleprog aurora
run

banner 5
<h1>Soot</h1>
<p>Randomly diffusing gas freezes when touching yellow fixed
cells, creating accretion fractal patterns.</p>
--
ruleprog soot
run

banner 5
<h1>Rug</h1>
<p>An eight-cell averaging rule with an increment produces
chaotic, ever-changing patterns.</p>
--
ruleprog rug
pattern rug
palette autocad
run

banner 5
<h1>Vote</h1>
<p>A voting rule that sets each cell to the majority of
itself and its neighbors, but if the election is within
one vote, flips it the other way.  This behaves like
annealing in metals.</p>
--
ruleprog vote
random 50
palette default
run

banner 5
<h1>PerfumeX</h1>
<p>A lattice gas with diagonal propagation is used to
simulate diffusion of a gas from two containers, one
open and one loosely stoppered.</p>
--
ruleprog perfumex
run

banner 5
<h1>Fractal</h1>
<p>A four neighbor parity rule makes fractal patterns
from a simple start and can be reversed by swapping
bit planes 0 and 1.</p>
--
ruleprog fractal
palette default
run

banner 5
<h1>Dentim</h1>
<p>Dr. Tim's face dissolves into gas which accretes
on the cyberspace ant.</p>
--
ruleprog dentim
run

banner 5
<h1>Venus</h1>
<p>A simple combinatoric rule produces, from a random start, a
scene reminiscent of the swampy Venus of Golden Age science
fiction.</p>
--
ruleprog venus
random 50
palette default
run

banner 5
<h1>Banks</h1>
<p>A one-bit, four neighbor, rule allows constructing an
arbitrarily complex computer from simple components.</p>
--
ruleprog banks
run

banner 5
<h1>Parks</h1>
<p>A one-dimensional rule with six neighbors spews gliders
both right and left.</p>
--
ruleprog parks
run

banner 5
<h1>Faders</h1>
<p>Discovered by Rudy Rucker, Faders is an NLUKY rule (code
127 2 2 2 2) which creates persistent gliders that leave a
colorful trail.</p>
--
ruleprog faders
pattern faderegg
palette autocad
run

banner 5
<h1>Flick</h1>
<p>Coming soon&mdash;cellular automata carpets!</p>
--
ruleprog flick
run

banner 5
<h1>Timetun</h1>
<p>This is a reversible four neighbor rule.  We'll run it for
a while, swap bit planes 0 and 1, and watch it return to the
start.</p>
--
ruleprog timetun
run
wait 1.5
swap 0 1
run

banner 5
<h1>Zhabo</h1>
<p>Here is a high-fidelity simulation of the Belusov-Zhabotinsky
reaction.  We start from a pattern saved after evolving more
than an hour from a random start.</p>
--
ruleprog zhabo
run

banner 5
<h1>Wator</h1>
<p>Simulation of an ecosystem with &ldquo;Sharks&rdquo;,
&ldquo;Fish&rdquo;, and &ldquo;Shrimp&rdquo;.  Evolves
into waves of population explosions and crashes.</p>
--
ruleprog wator
run

banner 5
<h1>Mite</h1>
<p>Simulation of a predator-prey ecosystem.  From a simple
start, evolves into a complex terrain.</p>
--
ruleprog mite
run

banner 5
<h1>Turmites</h1>
<p>Turmites simulates the heads of Turing machines moving
through the map while executing instructions and leaving
their results behind.  Three different programs are
illustrated.</p>
--
ruleprog turmite4
run

banner 5
<h1>Earthgas</h1>
<p>Nice planet you've got there.  It'd be too bad if
somebody turned off the gravity.  Random gas diffusion
with particle conservation.</p>
--
ruleprog earthgas
wait 1
run

banner 5
<h1>Sraneal</h1>
<p>Annealing is simulated by a majority voting rule with
ties broken by random input.  Compare the results with Vote.</p>
--
ruleprog sraneal
random 50
run

banner 5
<h1>Spins</h1>
<p>A spin-only Ising system models domains in a
magnetic material.  The rule is reversible; if you
stop and invert bit plane #3, it will run backward.</p>
--
ruleprog spins
run /2
banner 5
<p>Now invert the temporal phase plane and watch the
rule run backwards.</p>
--
plane 8 invert
run /2
wait 1.5

banner 5
<h1>Meltdown</h1>
<p>Swapping cells with those to the south with lower state
numbers makes a histogram at the bottom of the screen.</p>
--
ruleprog owncode
evaluator meltdown
pattern rat
palette rat
wait 1
run

banner 5
<h1>Glooper</h1>
<p>A continuous-value rule models the flow of a viscous fluid
through a contraption.  Demonstrates how WebCA can be extended
to do finite-element computations and fluid mechanics.</p>
--
ruleprog glooper
run

banner 5
<h1>Runny</h1>
<p>Swapping cells with black cells to the south creates the
illusion of runny paint and causes an image to collapse toward
the bottom of the screen.</p>
--
ruleprog owncode
evaluator runny
pattern x29
palette x29
wait 1
run

banner 5
<h1>Griff</h1>
<p>David Griffeath's cyclic cellular automaton evolves into
waves of cells devouring their neighbors, only to be devoured
by others.</p>
--
ruleprog griff
run

banner 5
<h1>Gasflow</h1>
<p>Gas flow is modeled by random particle diffusion with a
bias toward left-to-right motion.  Particles pile up on and
eventually move around impermeable barriers in yellow.  Particle
number is conserved.</p>
--
ruleprog gasflow
run

banner 5
<h1>Bbm</h1>
<p>A billiard-ball computer builds balls, walls, and mirrors all
from the same one-bit state.  The rule is reversible.</p>
--
ruleprog bbm
run

banner 5
<h1>Critters</h1>
<p>Critters depart from an initially-circular region dissolving
into chaos.  As they row horizontally and vertically, they
collide and interact, making a variety of patterns which remain
until another critter collides with them.</p>
--
ruleprog critters
run

banner 5
<h1>Forest</h1>
<p>Forest fire propagation is simulated by random lightning
strikes which set trees on fire.  Burning trees set adjacent
trees on fire, propagating the conflagration. Burning trees
become open ground where new trees grow randomly.</p>
--
ruleprog forest
run

banner 5
<h1>Bootperc</h1>
<p>Boostrap percolation explores the critical density which
determines whether a random map, under a simple rule, develops
into isolated regions or eventually fills all cells.</p>
--
ruleprog bootperc
run

banner 5
<h1>Logic</h1>
<p>A simple cellular automaton rule can simulate all of the
fundamental operations of Boolean algebra, and hence emulate
any digital logic circuit.  This example shows the operations
upon which arbitrarily complex circuits can be built.</p>
--
ruleprog logic
run

wait 1

palette default
pattern billbord

banner 20
<p>Thanks for watching the demo.  Now
<a href="../index.html">explore WebCA</a> further
on your own.</p>
--

stop
