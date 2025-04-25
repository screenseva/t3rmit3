    /*

        End of the World

        (Toffoli & Margolus, section 18.3.2, page 219)
        
        This rule demonstrates how a Margolus neighbourhood rule
        can be implemented in a Moore neighbourhood without any
        special external inputs and can, in addition, be made
        reversible.  The price is having an extremely contrived
        low-entropy initial state, created by running the BBM
        rule with memory to encode cells' current and previous
        states in planes #4 and #5.  We request horizontal and
        vertical texture in planes 4 and 5, and record our own
        history in plane #1.
        
        We load such a state and evolve the rule, which uses the
        trick of performing two updates per generation, which in
        turn works because two generations cancels out the
        alternation of the grid.
        
        All of this works swimmingly until some troublemaker
        changes the state of a cell in the current or historical
        map without making the corresponding change to the other,
        This is "the end of the world".  The rogue cell will spawn
        cells spewing out and quickly corrupting the ordered map
        into a seething mess.
        
        You can reverse this rule at any time by swapping planes
        #0 and #1, which can be accomplished with the Swap button
        on the control panel or with the Bit Plane Editor.

    */

    "use strict";

    rule.worldtype = 1;          // 2D torus world
    rule.patreq = "bbmrev";
    rule.palreq = "bbm";

    rule.texthb = 4;            // Horizontal texture
    rule.texthn = 1;

    rule.textvb = 5;            // Vertical texture
    rule.textvn = 1;

    function endworld(oldstate,     nw, n  , ne,
                                    w, self, e,
                                    sw, s  , se) {

        var HV = ((oldstate & 0x30) >> 4);  // Horizontal, vertical texture
        var U = self;                       // Shortcut for our own state

        var b1, b2;                         // Results from the two steps

        //  Perform step with time = 0
        b1 = compMarg(0);

        //  Now step with time = 3
        b2 = compMarg(3);

        return (b1 ^ b2 ^ ((oldstate & 2) >> 1)) |  // New state
               (U << 1) |                           // Previous state
               (oldstate & 0xFC);                   // Preserve texture and tag bits

        //  Compute update in synthetic Margolus neighbourhood
        function compMarg(time) {
            var HVxT = HV ^ time;       // Texture adjusted by time
            var CW = ((HVxT & 1) ? ((HVxT & 2) ? w : s) :
                                   ((HVxT & 2) ? n : e));
            var CCW = ((HVxT & 1) ? ((HVxT & 2) ? n : w) :
                                    ((HVxT & 2) ? e : s));
            var OPP = ((HVxT & 1) ? ((HVxT & 2) ? nw : sw) :
                                    ((HVxT & 2) ? ne : se));
            var RUL2 = ((U == OPP) ? CW : U);

            switch (U + CW + CCW + OPP) {
               case 0:
               case 3:
               case 4:
                  return U;

               case 1:
                  return OPP;

               case 2:
                  return RUL2;

            }
        }
   }
