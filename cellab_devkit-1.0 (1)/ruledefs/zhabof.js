    /*

        The fast Zhabotinsky reaction of Margolus & Toffoli.

    */

    rule.worldtype = 1;          // 2D torus world
    rule.palreq = "zhabo";

    rule.tempb = 1;             // Temporal phase
    rule.tempn = 2;

    function zhabof(oldstate,     nw, n  , ne,
                                  w, self, e,
                                  sw, s  , se) {
        var alarm, time, newself;
        var alarmset;

        var SUM_8 = nw + n + ne + w + e + sw + s + se;
        alarmset = BITSET(3);
        time = TPHASE();

        newself = (time == 0) ? 1 : 0;

        time = (time > 0) ? time - 1 : 0;

        if (self == 1 && alarmset) {
           time = 3;
        }

        alarm = (SUM_8 > 2) ? 1 : 0;

        return BF(alarm, 3) | BF(time, 1) | newself;
                    
        //  Return bit set for plane
        function BIT(p) {
            return 1 << p;
        }
        
        //  Test if bit p is set in oldstate
        function BITSET(p) {
            return (oldstate & BIT(p)) != 0;
        }
        
        //  Place a value in a specified bit field
        function BF(v, p) {
            return v << p;
        }

        //  Return temporal phase of oldstate
        function TPHASE() {
            return (oldstate >> rule.tempb) & BITMASK(0, rule.tempn);
        }
    }
