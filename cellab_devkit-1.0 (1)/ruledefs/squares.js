    /*

            Unconstrained growth: squares

            (Toffoli & Margolus, section 5.1, page 37)

    */

    rule.worldtype = 1;          // 2D torus world
    rule.patreq = "dot";
    rule.palreq = "default";

    function squares(oldstate,     nw, n  , ne,
                                   w, self, e,
                                   sw, s  , se) {
        return nw || n || ne || w || self || e || sw || s || se;
    }
