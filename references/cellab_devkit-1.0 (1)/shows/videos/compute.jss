
//  Computing
    
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
Computing<br />
<br />
</h1>
--

ruleprog logic

banner 20
<h1>Logic</h1>
<p>
As <cite>CelLab</cite> demonstrates, it is possible to simulate
cellular automata on a conventional computer.  It is possible to
create cellular automata which emulate serial computers? 
<em>Yes!</em>  Logic, a simple rule defined in an alternating
block neighborhood, implements the basic components needed to
build a universal computer.  Signals (red dots) propagate along
blue wires, and are operated on at various junctions according
to their geometry.  From the Invert and And operations, a NAND
gate can be built, which allows computing any function of
Boolean algebra.
</p>
--

wait 2
run 600
wait 3

ruleprog banks

banner 20
<h1>Banks</h1>
<p>
In 1971, Edwin R. Banks described a rule using only a single bit
of state and looking at four neighbors which he proved was
sufficient to build a universal computer.  Signals, represented
by pairs of zero cells, propagate along wires of 1 cells,
encountering structures which act as fan-outs, corners, logic
gates, clocks, and dead-ends.  These primitive components are
sufficient to construct an arbitrarily complex logic circuit
and, hence, computer.  Color is used purely to distinguish
components: all cells have a state of 1 or 0.
</p>
--

wait 2
run 600
wait 3

ruleprog turmite

banner 20
<h1>Turmite</h1>
<p>
The most common abstract model for computation is the Turing
machine, which processes data on a tape that moves back and
forth under a read-write head under the instructions of a
program.  Our Turmites can be thought of as moving Turing
machine heads, which examine the state of cells they encounter
and adjust their direction of travel and leave cells behind
based upon their programs.  Three turmites are shown, each
starting out at the lower left corner of a block of 1 cells
surrounded by zeroes. Their programs, each different, cause them
to trace different patterns as they move.
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
