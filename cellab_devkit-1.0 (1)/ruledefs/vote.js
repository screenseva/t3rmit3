    /*
        Gerard Vichniac's modified voting rule.  Like majority
        voting, but flipped in the middle:

        Number of neighbours       New state
              0-3                     Off
               4                      On
               5                      Off
              6-9                     On

        (Toffoli & Margolus, section 5.4, page 41)
            
        In this version, the seven extra bits are used as memory.
    */

    rule.worldtype = 1;          // 2D torus world

    function vote(oldstate,     nw, n  , ne,
                                w, self, e,
                                sw, s  , se) {
        var r = 0, NineSum = nw + n + ne + e + se + s + sw + w + self;

        switch (NineSum) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 5:
                r = 0;
                break;

            case 4:
            case 6:
            case 7:
            case 8:
            case 9:
                r = 1;
                break;
        }
        return (self << 1) | r;
    }
