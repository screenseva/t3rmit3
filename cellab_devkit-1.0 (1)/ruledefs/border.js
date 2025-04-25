    /*

	This rule alternates between two cycles: In cycle 0,
	every cell touching a firing cell is turned on.  In
	cycle 1, any cell which is the center of a block of 9
	firing cells is turned off.  Bit #0 is the firing bit
	and bit #7 is the cycle bit.

    */

    rule.worldtype = 1;          // 2D torus world
    rule.patreq = "square";
    rule.palreq = "mask1";
    
    function border(oldstate,     nw, n  , ne,
                                  w, self, e,
                                  sw, s  , se) {
        var nineSum = nw + n + ne + w + self + e + sw + s + se, 
            cycle = (oldstate >> 7) & 1,
            newCycle = cycle ^ 1,
            newSelf = 0;

        switch (cycle) {
            case 0:
                newSelf = (nineSum > 0) ? 1 : 0;
                break;

            case 1:
                newSelf = (nineSum == 9) ? 0 : self;
                break;
        }

        return (newCycle << 7) | newSelf;
    }
