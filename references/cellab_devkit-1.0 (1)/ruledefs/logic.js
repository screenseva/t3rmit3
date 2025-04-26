    /*

        This is the Logic rule from Toffoli & Margolus,
        discussed in section 12.8.4, p. 136.

        This version uses the "margolus" evaluator, which
        handles all of the spatial and temporal phase for us,
        allowing us to use the logical relative neighbours.

    */

    rule.worldtype = 13;         // 2D torus world, user evaluator
    rule.patreq = "logic";
    rule.palreq = "logic";
    rule.ocodereq = "margolus"; // Margolus neighbourhood

    function logic(oldstate) {

        //  Annotations are preserved but do nothing
        if ((oldstate & 0xFF) >= 0xF0) {
            return oldstate & 0xFF;
        }

        //  Extract Margolus plane 0 relative neighbours: bits
        var CENTER = BITV(0),
            CW = BITV(14),
            CCW = BITV(12),
            OPP = BITV(10);
            
        //  Plane 1 values contain wires
        var CENTERp = BITV(1),
            CWp = BITV(15),
            CCWp = BITV(13),
            OPPp = BITV(11);

        //  Number of wires in this block
        var wires = CENTERp + CWp + CCWp + OPPp;

        //  Stack of signals in this block
        var signals = [];
        if (OPPp) {
            signals.push(OPP);
        }
        if (CWp) {
            signals.push(CW);
        }
        if (CCWp) {
            signals.push(CCW);
        }

        //  Stack of controls (bits not on wires) in this block
        var controls = [];
        if (OPPp == 0) {
            controls.push(OPP);
        }
        if (CWp == 0) {
            controls.push(CW);
        }
        if (CCWp == 0) {
            controls.push(CCW);
        }

        var nc = 0;         // New cell's bit value

        if (CENTERp) {
            switch (wires) {
                case 0:     // No wires: new state is zero
                    nc = 0;
                    break;

                case 1:     // One wire: state = 1 if 1 cell nearby
                    nc = OPP | CW | CCW;
                    break;

                case 2:     // Two wires: propagate the bit
                    nc = signals.pop() ^ ((CWp | CCWp) ? OPP : 0);
                    break;

                case 3:     // Three wires: AND or OR the incoming signals
                            // depending upon whether there's a control bit
                    if (controls.pop()) {
                        nc = signals.pop() & signals.pop();
                    } else {
                        nc = signals.pop() | signals.pop();
                    }
                    break;

                case 4:     // Four wires: allow signals to cross unchanged
                    nc = OPP;
                    break;

            }
        } else {            // No wires here: bit state is unchanged
            nc = CENTER;
        }

        /*  For debugging patterns, we encode the number of wires
            in a cell in the high nybble of the cell state.  This
            does not affect the operation of the rule, but it allows
            our logic.jcc pattern, when configured for debugging,
            to show the number of wires found in the cell in each
            generation.  This helps solve even-odd problems in the
            placement of wires in the blocks.  */
        return nc | (CENTERp << 1) | (wires << 4);

        //  Return bit from oldstate
        function BITV(p) {
            return (oldstate >> p) & 1;
        }
    }
