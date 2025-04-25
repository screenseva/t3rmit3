
    //	Time Tunnel Reversibility Demo

top    
rule timetun

wait 1.5

banner 5
<h1>The Time Tunnel</h1>
<p>
This is a reversible rule.  First we'll start the
rule and let it run for 500 generations.
</p>
--

run 500

banner 5
<p>
Now interchange bit planes 0 and 1, then run for
another 500 generations.
</p>
--
swap 0 1
run 500

banner 5
<p>
We're right back where we started!
</p>
--
    
banner 5
<p>
Now let's see what happens if we change a single
bit in the map before reversing the automaton.
Again, run 500 generations.
</p>
--

run 500

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
Now watch what happens when we run backwards 500
generations.
</p>
--

run 500

banner 5
<p>
The entire coherence of the map has been destroyed by
changing a single bit!
</p>
--
