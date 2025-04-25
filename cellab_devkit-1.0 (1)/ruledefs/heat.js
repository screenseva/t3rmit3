    /*

        This is an eightcell averaging rule with zero increment.

        Odd states are frozen states and even states generate
        even states. One can reanimate the vacuum by
        re-randomising bitplanes 5 or 6.

    */

    rule.worldtype = 10;         // 2D open semitotalistic rule

    function heat(oldstate, SUM_8) {
        var r = 0;

        if ((oldstate & 1) > 0) {
            if (oldstate < 16) {
                r = oldstate;
            } else {
                r = oldstate + 128;
            }
        } else {
            r = (SUM_8 >> 3) & 0xFE;
        }
        return r;
    }
