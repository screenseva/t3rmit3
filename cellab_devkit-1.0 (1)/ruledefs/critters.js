    /*

        This is the Critters rule from Toffoli & Margolus,
        discussed in section 12.8.2, p. 132.

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
    rule.patreq = "circle";
    rule.palreq = "critters";
    rule.ocodereq = "margolusp"; // Margolus neighbourhood, temporal phase

    function critters(oldstate) {

        //  Extract Margolus relative neighbours from oldstate
        var CENTER = BITV(0),
            CW = BITV(14),
            CCW = BITV(12),
            OPP = BITV(10),
            TPHASE = BITV(8);
            
        var nCENTER = CENTER ^ 1,
            nOPP = OPP ^ 1;
    
        var nc;
        switch (CENTER + OPP + CW + CCW) {
            case 0:
            case 1:
                nc = nCENTER;
                break;
                                
            case 2:
                nc = CENTER;
                break;
                
            case 3:
                nc = nOPP;
                break;

            case 4:
                nc = nCENTER;
                break;
        }
        
        return nc | (TPHASE << 1) | 4;

        //  Return bit from oldstate
        function BITV(p) {
            return (oldstate >> p) & 1;
        }
    }
