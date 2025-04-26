    /*

            Unconstrained growth: triangles

            (Toffoli & Margolus, section 5.1, page 38)

    */

    rule.worldtype = 1;          // 2D torus world
    rule.patreq = "dot";
    rule.palreq = "default";

    function triangs(oldstate,     nw, n  , ne,
                                   w, self, e,
                                   sw, s  , se) {
        return n || w || self || e;
    }
