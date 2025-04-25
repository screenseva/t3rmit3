    /*

     Rule suggested by William Gosper.  We lay down a mask marking
     the cartesian plane's four quadrants (Qs for short) by the numbers 0-3 in
     the arrangement    2  0
                        3  1.
     And we tell Q0 cells to copy SE, Q1 copy SW, Q2 copy NE, Q3 copy NW.
     A block of cell stuff will refract.

    */

    rule.worldtype = 0;          // 2D open world
    rule.patreq = "gyre";
    rule.palreq = "gyre";

    function gyre(oldstate,     nw, n  , ne,
                                w, self, e,
                                sw, s  , se
                   ) {
        var r, barrier, quadrant, newSelf = 0;

        barrier = (oldstate >> 3) & 1;
        quadrant = (oldstate >> 1) & 3;

        //  Barrier cells stay barrier cells
        if (barrier == 1) {
            r = 8;
        } else {
            switch (quadrant) {
                case 0:
                    newSelf = se;
                    break;

                case 1:
                    newSelf = sw;
                    break;

                case 2:
                    newSelf = ne;
                    break;

                case 3:
                    newSelf = nw;
                    break;
            }
            r = (quadrant << 1) | newSelf;
        }
        return r;
    }
