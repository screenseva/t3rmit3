    /*

        This is the Logic rule from Toffoli & Margolus,
        discussed in section 12.8.4, p. 136.

        This version uses the "margolus" evaluator, which
        handles all of the spatial and temporal phase for us,
        allowing us to use the logical relative neighbours.

    */


class Logic extends ruletable {

    void jcruleModes() {
        setWorld(13);
        setPatternRequest("logic");
        setPaletteRequest("logic");
        setOwnCodeRequest("margolus");
    }

    static final boolean B(int i) {
        return i != 0;
    }

    int jcrule(int oldstate) {
    
        //  Annotations are preserved but do nothing
        if ((oldstate & 0xFF) >= 0xF0) {
            return oldstate & 0xFF;
        }

        //  Number of wires in this block
        int wires = CENTERp + CWp + CCWp + OPPp;


        //  Stack of signals in this block
        int[] signals = new int[5];
        int signalsp = 0;
        if (B(OPPp)) {
            signals[signalsp++] = OPP;
        }
        if (B(CWp)) {
            signals[signalsp++] = CW;
        }
        if (B(CCWp)) {
            signals[signalsp++] = CCW;
        }

        //  Stack of controls (bits not on wires) in this block
        int[] controls = new int[5];
        int controlsp = 0;
        if (OPPp == 0) {
            controls[controlsp++] = OPP;
        }
        if (CWp == 0) {
            controls[controlsp++] = CW;
        }
        if (CCWp == 0) {
            controls[controlsp++] = CCW;
        }

        int nc = 0;         // New cell's bit value

        if (CENTERp != 0) {
            switch (wires) {
                case 0:     // No wires: new state is zero
                    nc = 0;
                    break;

                case 1:     // One wire: state = 1 if 1 cell nearby
                    nc = OPP | CW | CCW;
                    break;

                case 2:     // Two wires: propagate the bit
                    nc = signals[--signalsp] ^ (B(CWp | CCWp) ? OPP : 0);
                    break;

                case 3:     // Three wires: AND or OR the incoming signals
                            // depending upon whether there's a control bit
                    if (B(controls[--controlsp])) {
                        nc = signals[--signalsp] & signals[--signalsp];
                    } else {
                        nc = signals[--signalsp] | signals[--signalsp];
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
     }

}

public class logic {
    public static void main(String args[]) {
        (new Logic()).generateRuleFile("logic");
    }
}
