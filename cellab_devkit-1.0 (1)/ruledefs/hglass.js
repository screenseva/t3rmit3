    /*

        The Hglass rule from page 29 of Margolus and Toffoli.

    */

    rule.worldtype = 1;          // 2D torus world

    function hglass(oldstate,     nw, n  , ne,
                                  w, self, e,
                                  sw, s  , se) {
       var r = 0;

        switch ((16 * e) + (8 * w) + (4 * s) + (2 * n) + self) {
            case 1: case 2: case 3: case 11: case 21:
            case 25: case 29: case 30: case 31:
                r = 1;
                break;

            default:
                r = 0;
                break;
        }
        return r;
    }
