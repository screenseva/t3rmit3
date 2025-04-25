    /*
       Like Heat, this is the eight cell averaging rule run with
       certain cells fixed at certain "temperatures".  We use
       low bit to signal "leave alone." and force all other
       states to be even.  Unlike the Heat rule, we increment
       the average by 2.
    */

    rule.worldtype = 10;         // 2D open semitotalistic rule
    rule.palreq = "autocad";

    function heatwave(oldstate, SUM_8) {
        var r;

        /*  oldstate only has five bits, so ranges from 0 to 31.  We
            want to store high and low values in oldstate, so we will
            regard odd oldstates 1-15 as frozen at lowstates 1-15,
            and we will think of odd oldstates 17-31 as frozen at
            224+17 - 224+31.  224 = 11100000b, so for the low five
            bits, 31 is the same as 224+31.  */

        if ((oldstate & 1) == 1) {
            if (oldstate < 16) {
                r = oldstate;
            } else {
                r = 224 + oldstate;
            }
        } else {
            r = ((SUM_8 >> 3) + 2) & 254;
        }
        return r;
    }
