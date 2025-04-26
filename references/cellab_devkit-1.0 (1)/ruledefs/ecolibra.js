/*
     This rule runs Brain in the sea and AntiLife on land.  Six or
     seven firing Brain cells turn a sea cell into land.  Seven
     "antifiring" Antilife cells turn a land cell into sea.
*/

    rule.worldtype = 1;          // 2D torus world
    rule.patreq = "ecolibra";
    rule.palreq = "default";
    
    function ecolibra(oldstate,     nw, n  , ne,
                                    w, self, e,
                                    sw, s  , se) {

        /*  Here rather than thinking of bits, we think of state numbers.

            State 0 is dead sea
            State 1 is firing brain in sea
            State 2 is refractory brain in sea
            State 3 is dead land
            State 4 is firing life on land  */

        var newState;
        var SUM_8 = nw + n + ne + w + e + sw + s + se;
        
        if ((oldstate & 1) != 0) {
            newState = 3;
        } else {
            newState = 0;
        }

        if (oldstate == 0) {
            switch (SUM_8) {
                case 2:
                    newState = 1;
                    break;

                case 6:
                case 7:
                    newState = 3;
                    break;

                default:
                    newState = 0;
                    break;
            }
        } else if (oldstate == 1) {
            newState = 2;
        } else if (oldstate == 2) {
            newState = 0;
        } else if (oldstate == 3) {
            switch (SUM_8) {
                case 5:
                    newState = 4;
                    break;

                case 1:
                    newState = 0;
                    break;

                default:
                    newState = 3;
                    break;
            }
        } else if (oldstate == 4) {
            if (SUM_8 == 5 || SUM_8 == 6) {
                newState = 4;
            } else {
                newState = 3;
            }
        }
        return newState;
    }
