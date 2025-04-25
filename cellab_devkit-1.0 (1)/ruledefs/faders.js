    /*

        Faders:  

        N = 127  L = 2  U = 2  K = 2  Y = 2

        To evaluate any NLUKY rule, just change the parameters
        in the definition below to the desired values.

    */

    rule.worldtype = 1;          // 2D torus world
    rule.palreq = "faders";

    function faders(oldstate,     nw, n  , ne,
                                  w, self, e,
                                  sw, s  , se) {
        var N = 127, L = 2, U = 2, K = 2, Y = 2;

        var SUM_8 = nw + n + ne + w + e + sw + s + se;
        var n = 0;

        if ((oldstate == 0) && (L <= SUM_8) && (SUM_8 <= U)) {
            n = 1;
        }
        if (oldstate == 1) {
            if ((K <= SUM_8) && (SUM_8 <= Y)) {
                n = 1;
            } else {
                n = 2;
            }
        }
        if (((oldstate & 1) == 0) && (0 < oldstate) && (oldstate < (2 * N))) {
            n = oldstate + 2;
        }
        return n;
    }
