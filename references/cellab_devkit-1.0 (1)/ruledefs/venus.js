    /*

                                 Venus
                             by Rudy Rucker

                   Start this rule on a random pattern.

    */

    rule.worldtype = 1;          // 2D torus world

    function venus(oldstate,     nw, n  , ne,
                                 w, self, e,
                                 sw, s  , se) {
        var r = 0;

        switch (oldstate & 3) {
            case 0:
                r = 2 * (nw ^ sw) + w;
                break;

            case 1:
                r = 2 * (nw ^ ne) + n;
                break;

            case 2:
                r = 2 * (ne ^ se) + e;
                break;

            case 3:
                r = 2 * (se ^ sw) + s;
                break;
        }
        return r;
    }
