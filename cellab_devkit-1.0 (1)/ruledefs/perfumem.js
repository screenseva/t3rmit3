    /*

        This is HPP-GAS/WALLS rule from Toffoli & Margolus,
        discussed (but not given explicitly) in section 15.2, p.
        159.

        This version uses the "margolus" evaluator, which
        does all of the spatial and temporal phase for us,
        allowing us to use the logical relative neighbours.

    */

    rule.worldtype = 13;         // 2D torus world, user evaluator
    rule.patreq = "perfumem";
    rule.palreq = "perfumem";
    rule.ocodereq = "margolus";  // Margolus neighbourhood

    function perfumem(oldstate) {

        //  Extract Margolus relative neighbours from oldstate
        var CENTER = BITV(0),
            CW = BITV(14),
            CCW = BITV(12),
            OPP = BITV(10);
        //  You only need these if you care about plane 1 values
        var CENTERp = BITV(1),
            CWp = BITV(15),
            CCWp = BITV(13),
            OPPp = BITV(11);

        //  Return bit from oldstate
        function BITV(p) {
            return (oldstate >> p) & 1;
        }

        //  Now, after all the boilerplate, this is the entire rule

        return (wall() ? CENTER :
            (collision() ? CW : OPP)) | (CENTERp << 1);

        //  Detect a collision between two particles
        function collision() {
            return (CENTER == OPP) &&
                   (CW == CCW) &&
                   (CENTER != CW);
        }

        //  Detect the presence of a wall
        function wall() {
            return (CENTERp | CWp | OPPp | CCWp);
        }
    }
