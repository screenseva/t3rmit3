    /*	
	Annealing driven by randomness around the centre

	(Toffoli & Margolus, section 8.3, page 70)
	
	We request 3 bits of random input and test the bits
	for zero in order to obtain a random density of 1/8.
	Random stimulus doesn't allow us to request a density,
	so we fake it this way.
    */
    
    rule.worldtype = 1;
    rule.palreq = "default";
    rule.randb = 4;
    rule.randn = 3;

    function sraneal(oldstate,     nw, n  , ne,
                                   w, self, e,
                                   sw, s  , se) {
				   
    	var randbit = ((oldstate >> 4) & 7) == 0;
	var count = n + w + self + e + s;
	
	switch (count) {
	   case 0:
	   case 1:
	      return 2; 	   // State 2 makes it look like water

	   case 2:
	      return randbit ? 1 : 2;

	   case 3:
	      return (!randbit) ? 1 : 2;

	   case 4:
	   case 5:
	      break;
	}
	return 1;
    }
