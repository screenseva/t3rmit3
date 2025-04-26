/*

                  Four neighbour open world Rug rule

       Running Rug in WorldType 10 does not give a chaotic
       carpet because edge clamping is needed as constant info
       input (info about the screen size).  The WorldType 10
       Heat rule clamps the screen edge (or any other region) at
       the cost of only allowing even values for freely changing
       states, for an effective state number of 128.  This
       program runs a nowrap clamped Rug by using the semi4 own
       code evaluator in WorldType 12.  Note that the edges will
       always be clamped to zero.

*/

    rule.worldtype = 12;         // Own code, 2D open world
    rule.palreq = "autocad";
    rule.ocodereq = "semi4";

    function rugf(lutindex) {
        // Extract 4sum from lookup table index
        return (((lutindex & 1023) >> 2) + 1) & 255;
    }
