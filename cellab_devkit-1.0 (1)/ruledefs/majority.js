    /*

        Majority voting rule.  Cell agrees with the majority of its
        neighbours.

        (Toffoli & Margolus, section 5.4, page 41)

        Number of neighbours       New state
              0-4                     Off
              5-9                     On
    */

    rule.worldtype = 1;         // 2D torus world
    rule.patreq = "dot";    	// Use dot pattern to clear old pattern
    rule.palreq = "default";
    
    rule.rseedb = 0;
    rule.rseedn = 1;
    rule.rseedp = 255;

    function majority(oldstate,     nw, n  , ne,
                                    w, self, e,
                                    sw, s  , se) {
        var count = nw + n + ne + w + self + e + sw + s + se;

        if (count < 5) {
           return 2;
        }
        return 1;
    }
