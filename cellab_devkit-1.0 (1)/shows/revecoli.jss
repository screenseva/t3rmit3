
//  Demonstrate reversing revecoli

top
rule revecoli

banner 5
<h1>Revecoli</h1>
<p>
This is a reversible rule with four bits of state per
cell.  We keep the previous state in the other four bits
of the cell.  The rule can run in reverse by swapping
the old and new states.  Start from a coherent pattern
and run 500 generations.
--

run 500

banner 5
<p>
Now swap planes 0&ndash;3 and 4&ndash;7.
</p>
--

swap 0 4
swap 1 5
swap 2 6
swap 3 7

banner 5
<p>
Run 500 generations after the swap.
</p>
--

run 500

