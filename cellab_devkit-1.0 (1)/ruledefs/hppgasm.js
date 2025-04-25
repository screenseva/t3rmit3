    /*

        This is the HPP-GAS rule from Toffoli & Margolus,
        section 12.4, p. 125.

        This version uses the "margolus" evaluator, which
        does all of the spatial and temporal phase for us,
        allowing us to use the logical relative neighbours.

    */

    rule.worldtype = 13;         // 2D torus world, user evaluator
    rule.patreq = "bigant";
    rule.palreq = "mask1";
    rule.ocodereq = "margolus";  // Margolus neighbourhood

    function hppgas(oldstate) {

        //  Extract Margolus relative neighbours from oldstate
        var CENTER = BITV(0),
            CW = BITV(14),
            CCW = BITV(12),
            OPP = BITV(10);

        //  Return bit from oldstate
        function BITV(p) {
            return (oldstate >> p) & 1;
        }

        //  Now, after all the boilerplate, this is the entire rule

        return collision() ? CW : OPP;

        function collision() {
            return (CENTER == OPP) &&
                   (CW == CCW) &&
                   (CENTER != CW);
        }
    }
