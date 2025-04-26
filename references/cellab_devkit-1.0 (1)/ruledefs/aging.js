    /*


        Rudy Rucker's aging rule

        "The family of rules that I'm looking at now could be called
        aging rules.  A zero cell stays zero unless the 8sum of
        neighbors' low bits is between two thresholds.  I used 3 and 5
        just now (so if sum is 3, 4, or 5 the cell gets turned on.) To
        turn a cell on you put it in state 1.  A nonzero cell is aged.
        The age is gotten as OldState SHR 1.  The fertility is gotten
        by OldState AND 1.  At each update the age is incremented by
        1.  If the new age is greater than LifeSpan, the cell is set
        to zero.  If the new age is greater than breeding span, the
        cell's low bit is turned off, but it is allowed to keep aging.
        In the Zhabo I just got, I set LifeSpan at 10 and Breeding
        span at 7."

    */

    rule.worldtype = 1;         // 2D torus world
    rule.patreq = "dot";
    rule.palreq = "default";

    //  The rule works well from a random start
    rule.rseedb = 0;
    rule.rseedn = 1;
    rule.rseedp = 255;

    function aging(oldstate,     nw, n  , ne,
                                 w, self, e,
                                 sw, s  , se) {
        var LifeSpan = 10;
        var Breeding = 7;
        var age;

        var SUM_8 = nw + n + ne + w + e + sw + s + se;

        if (oldstate == 0) {
            return ((SUM_8 >= 3) && (SUM_8 <= 5)) ? 1 : 0;
        } else {
            age = oldstate >> 1;
            age++;
            if (age > LifeSpan) {
                return 0;
            }
            return (age << 1) | ((age <= Breeding) ? 1 : 0);
        }
    }
