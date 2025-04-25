    /*

        This is the Tron rule from Toffoli & Margolus,
        discussed in section 12.8.3, p. 134.

        We use the trick from the "Critter-Cycle" rule
        on page 134, in conjunction with a specially
        contrived palette, to avoid the strobe effect
        which would otherwise occur due to the complementing
        of all states every generation.
        
        This version uses the "margolusp" evaluator, which
        does all of the spatial and temporal phase for us,
        allowing us to use the logical relative neighbours.

    */

    rule.worldtype = 13;         // 2D torus world, user evaluator
    rule.patreq = "grid";
    rule.palreq = "critters";
    rule.ocodereq = "margolusp"; // Margolus neighbourhood, temporal phase

    function tron(oldstate) {

        //  Extract Margolus relative neighbours from oldstate
        var CENTER = BITV(0),
            CW = BITV(14),
            CCW = BITV(12),
            OPP = BITV(10),
            TPHASE = BITV(8);
            
//        var nCENTER = CENTER ^ 1,
//            nOPP = OPP ^ 1;
    
        var nc;
        switch (CENTER + CW + CCW + OPP) {
            case 0:
                nc = 1;
                break;
                
            case 1:
            case 2:
            case 3:
                nc = CENTER;
                break;
                                
            case 4:
                nc = 0;
                break;
        }
        
        return nc | (TPHASE << 1) | 4;

        //  Return bit from oldstate
        function BITV(p) {
            return (oldstate >> p) & 1;
        }
    }
