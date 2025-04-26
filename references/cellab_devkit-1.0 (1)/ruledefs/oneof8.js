    /*

	    Constrained growth: 1 out of 8 rule

	    (Toffoli & Margolus, section 5.2, page 39)

    */

    rule.worldtype = 1;          // 2D torus world
    rule.patreq = "dot";
    rule.palreq = "default";

    function oneof8(oldstate,     nw, n  , ne,
                                  w, self, e,
                                  sw, s  , se) {
	var sum8 = nw + n + ne + w + e + sw + s + se;
        return (sum8 == 1) ? 1 : self;
    }
