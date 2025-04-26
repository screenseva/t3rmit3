    /*
            Flickercladding Interior Decoration

            Conceived by Rudy Rucker
            Drawn by Gary Wells
            Modeled with AutoCAD
            Rendered by AutoShade
            Perpetrated by Kelvin R. Throop.

            In this rule, we only change the cells whose high
            bits are on. These cells are updated according to
            the TimeTun rule.
    */

    rule.worldtype = 1;          // 2D torus world
    rule.patreq = "openplan";
    rule.palreq = "openplan";

    function flick(oldstate,     nw, n  , ne,
                                 w, self, e,
                                 sw, s  , se) {
        var interest, oldSelf, newSelf, r;
        var SUM_5 = n + w + self + e + s;

        if (!BITSET(7)) {
            r = oldstate;
        } else {
            oldSelf = (oldstate >> 1) & 1;
            interest = (SUM_5 == 0 || SUM_5 == 5) ? 0 : 1;
            newSelf = interest ^ oldSelf;
            r = 0x80 | BF(self, 1) | newSelf;
        }
        return r;
        
        //  Test bit set in oldstate
        function BITSET(n) {
            return ((oldstate >> n) & 1) == 1;
        }
        
        //  Place a value in a specified bit field.

        function BF(v, p) {
            return v << p;
        }
    }
