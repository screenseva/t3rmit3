    /*

        The Fredkin rule with the seven extra bits used as memory

    */

    rule.worldtype = 1;          // 2D torus world
    rule.patreq = "square";

    function fredmem(oldstate,     nw, n  , ne,
                                   w, self, e,
                                   sw, s  , se) {
        var SUM_9 = nw + n + ne + w + self + e + sw + s + se;
        
        return ((oldstate << 1) & 0xFE) | (SUM_9 & 1);
    }
