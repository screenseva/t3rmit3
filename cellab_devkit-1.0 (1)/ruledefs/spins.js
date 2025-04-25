/*
	Spin-only Ising system

	(Toffoli & Margolus, section 17.3, page 190)
    
    This rule is reversible: if you run it for a while,
    pause and invert plane 3 with the Bit Plane Editor,
    then restart, it will return to the starting
    configuration.
*/

    rule.worldtype = 1;          // 2D torus world
    rule.patreq = "spins";
    rule.palreq = "mask1";

    rule.texthb = 1;            // Horizontal phase
    rule.texthn = 1;
    
    rule.textvb = 2;            // Vertical phase
    rule.textvn = 1;

    rule.tempb = 3;             // Temporal phase
    rule.tempn = 1;

    function spins(oldstate,     nw, n  , ne,
                                 w, self, e,
                                 sw, s  , se) {
	var texture = HPHASE() ^ VPHASE();
	var time = TPHASE();
	var ntex = oldstate & BITMASK(rule.texthb, 2);
	if (texture ^ time) {
	   return ntex | TPUPD((((n + s + w + e) == 2) ? !self : self));
	}
	return ntex | TPUPD(self);
                    
        //  Return bit set for plane
        function BIT(p) {
            return 1 << p;
        }
        
        //  Test if bit p is set in oldstate
        function BITSET(p) {
            return (oldstate & BIT(p)) != 0;
        }
	
        /*  Mask for N contiguous bits with low order bit in plane P.  Note
            how this definition craftily generates masks of zero when a
            zero bit field is specified.  */
        function BITMASK(p, n) {
            return BIT(p + n) - BIT(p);
        }
                
        //  Return horizontal phase of oldstate
        function HPHASE() {
            return (oldstate >> rule.texthb) & BITMASK(0, rule.texthn);
        }

        //  Return vertical phase of oldstate
        function VPHASE() {
            return (oldstate >> rule.textvb) & BITMASK(0, rule.textvn);
        }

        //  Return horizontal and vertical phase together, vertical most sig.
        function HVPHASE() {
            return (VPHASE() << rule.texthn) | HPHASE();
        }

        //  Return temporal phase of oldstate
        function TPHASE() {
            return (oldstate >> rule.tempb) & BITMASK(0, rule.tempn);
        }
        
        //  Update temporal phase in state x
        function TPUPD(x) {
            return (x & (~(BITMASK(rule.tempb, rule.tempn)))) |
                    (((TPHASE() + 1) & BITMASK(0, rule.tempn)) << rule.tempb);
        }
    }
