    /*

        This is an four cell averaging rule with zero increment.

        Odd states are frozen states and even states generate
        even states. One can reanimate the vacuum by
        re-randomising bitplanes 5 or 6.

    */

    rule.worldtype = 11;         // 2D open semitotalistic rule

    function heat(oldstate, SUM_4) {
        var r = 0;

        if ((oldstate & 1) > 0) {
            if (oldstate < 16) {
                r = oldstate;
            } else {
                r = oldstate + 224;
            }
        } else {
            r = (SUM_4 >> 2) & 0xFE;
        }
        return r;
    }
