    /*

        Based on Me-Neither rule, [Margolus&Toffoli87], p.132

    */

    rule.worldtype = 1;          // 2D torus world
    rule.patreq = "square";

    function fractal(oldstate,     nw, n  , ne,
                                   w, self, e,
                                   sw, s  , se) {
        var mem, sum, newSelf;

        mem = (oldstate >> 1) & 1;
        sum = ne + nw + se + sw + mem;
        newSelf = ((sum & 1) == 1) ? 1 : 0;
        
        return (self << 1) | newSelf;
    }
