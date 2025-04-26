
//  Wind

top

ruleprog wind

banner 20
<h1>Wind</h1>
<p>Wind is a simulation of a wind tunnel using
computational fluid dynamics.  The flow of fluid is
shown in a false color display.  The fluid flows from
left to right, and encounters impermeable barriers
drawn in black.
</p>

<p><b>Note:</b> this rule is extremely
computationally-intensive: it performs on the order of
a million floating-point operations per generation.  If
you have a slower or older computer, or try to run this
rule on a mobile platform, updates may seem so slow it
appears your computer has stalled.  Press the stop button,
wait for the evaluation to stop (it may take a while) and
try something else.</p>

<p>
We'll start by demonstrating flow past a rectangular barrier.
Vortices will appear and extend into a &ldquo;tail&rdquo; that
wags, then detach and form a K&aacute;rm&aacute;n vortex street
behind the barrier.
</p>
--

wait 1.5

speed 200       // Prepare for ridiculous speed!
run 1500

banner 10
<p>Now we'll try a elliptical barrier followed by an
asymmetrically-positioned rectangle.  The interplay among
the vortices never settles down into a stable
configuration.</p>
--

pattern wind1
generation 0
wait 2
run 3000

banner 10
<p>Here is an airfoil profile.  This time we'll show the density
of the air flowing around it.  Note that the density above the
airfoil is lower (more blue) than below.  This difference in
density is responsible for the lift the airfoil produces. The
sharp increase in density at the leading edge causes drag as the
airfoil moves through the air.  The transients that occur when
the flow starts are rapidly damped out to a steady-state
condition.</p>
--

pattern airfoil
patch evaluator /display = 4/ "display = 0"
patch evaluator /contrast = 0/ "contrast = 10"
generation 0
wait 2

run 400

banner 10
<p>By placing barriers at the top and bottom, we can restrict
the fluid flow to a &ldquo;letterbox&rdquo; in the center of
the map.  This dramatically speeds up evaluation, as there
are fewer cells of fluid to update.</p>
--

pattern wind_karman
patch evaluator /display = 0/ "display = 4"
patch evaluator /contrast = 10/ "contrast = 0"
generation 0
wait 2

run 1000

speed 33

