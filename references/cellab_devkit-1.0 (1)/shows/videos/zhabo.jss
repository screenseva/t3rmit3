
//  Belousov-Zhabotinsky Reactions
    
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
Belousov-Zhabotinsky Reaction<br />
<br />
</h1>
--

palette autocad
random 50
ruleprog hodge
speed 10

banner 15
<h1>Hodge</h1>
<p>
Many cellular automata rules spontaneously generate order from
initially random states.  A common form of order resembles, and
models, the nonlinear chemical oscillators called
Belousov-Zhabotinsky (BZ) reactions.  The Hodgepodge rule,
discovered by Martin Gerhardt and Heike Schuster, is an
example.  Starting from a random initial pattern, it quickly
develops into the interlocking spirals characteristic of BZ
reactions.
</p>
--

run 600

wait 3

banner 15
<h1>Zhabo</h1>
<p>
The Zhabo rule is modeled on the feeding behavior of
tubeworms.  It takes a long time to develop structure from
a random start, but eventually settles down into the
characteristic Belousov-Zhabotinsky spirals.
</p>
--

ruleprog zhabo
speed 10
run 600
wait 3

banner 15
<h1>RainZha</h1>
<p>
Finally, here is an extremely simple rule that almost
immediately develops BZ-like spirals, albeit hard-edged
squared-off ones.
</p>
--

random 50
ruleprog rainzha
speed 10
run 150
wait 2

speed 33

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
