    /*

        This is the BBM rule from Toffoli & Margolus, discussed
        in section 18.2, p. 214.

        The rule is trivially modified to preserve bits
        1-7 of the current cell's state.  This allows drawing
        cells in any odd state, which can be used to distinguish
        individual cells by colour for explanatory purposes.

        This version uses the "margolus" evaluator, which
        does all of the spatial and temporal phase for us,
        allowing us to use the logical relative neighbours.

    */

    rule.worldtype = 13;         // 2D torus world, user evaluator
    rule.patreq = "bbm";
    rule.palreq = "bbm";
    rule.ocodereq = "margolus";  // Margolus neighbourhood

    function bbm(oldstate) {

        //  Extract Margolus relative neighbours from oldstate
        var CENTER = BITV(0),
            CW = BITV(14),
            CCW = BITV(12),
            OPP = BITV(10);

        var nc;
        switch (CENTER + CW + CCW + OPP) {
            case 0:
            case 3:
            case 4:
                nc = CENTER;
                break;

            case 1:
                nc = OPP;
                break;

            case 2:
                nc = (CENTER == OPP) ? CW : CENTER;
                break;
        }

        return nc |                     // New cell state
               ((oldstate & 1) << 1) |  // Previous cell state
               (oldstate & 0xFC);       // Ignored bits (used to colour code)

        //  Return bit from oldstate
        function BITV(p) {
            return (oldstate >> p) & 1;
        }
    }
