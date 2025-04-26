    /*

	    Constrained growth: lichens

	    (Toffoli & Margolus, section 5.2, page 40)

    */

    rule.worldtype = 1;          // 2D torus world
    rule.patreq = "square";
    rule.palreq = "default";

    function lichens(oldstate,     nw, n  , ne,
                                   w, self, e,
                                   sw, s  , se) {
	var sum8 = nw + n + ne + w + e + sw + s + se;
	
	switch (sum8) {

	   case 0:
	   case 1:
	   case 2:
	   case 4:
	   case 5:
	   case 6:
	      return self;

	   case 3:
	   case 7:
	   case 8:
	      return 1;
	}
    }
