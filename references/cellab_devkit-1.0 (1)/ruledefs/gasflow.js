    /*

        Gas flow with biased random motion and impermeable
        barriers.  Particle number is conserved.

        No lookup table is used.

    */

    rule.worldtype = 13;        // 2D torus world, user evaluator
    rule.patreq = "gasflow";
    rule.palreq = "gasflow";
    rule.ocodereq = "gasflow";
    rule.rseedb = 0;            // Random seed for gas particles
    rule.rseedn = 1;
    rule.rseedp = 40;

    function gasflow(oldstate) {
        return 0;               // No lookup table
    }
