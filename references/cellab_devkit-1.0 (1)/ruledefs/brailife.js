    /*

            This rule runs Life and Brain in parallel and lets them
            interact only within a certain masked region.  In this region,
            firing Brain cells turn on Life cells, and firing Life cells
            keep Brain cells from turning on.
	    
	    We use the eight bits of state as follows:
		Bit #0 is used to show either the Brain
        	       or the Life bit to neighbors;
		Bit #1 is the Life bit,
		Bit #2 is the firing Brain bit,
		Bit #3 is the refractory Brain bit,
		Bit #4 is the mask bit,and
		Bit #7 is the cycle bit.

    */

    rule.worldtype = 1;
    /* The starting BraiLife pattern has all bit 7s set to 0
       (for synchronized cycles), has two adjacent cells of
        plane #2 turned on to start Brain, and has a big disk
        mask in plane #4. */
    rule.patreq = "brailife";
    /* The brailife.jcc colorpalette looks at bits 4,3,2, &
       1.  I got my colorpalette by disabling planes 0,5,6,7 of
       the Default.JCC and saving it as brailife.jcc. */
    rule.palreq = "brailife";
    
    function brailife(oldstate,     nw, n  , ne,
                                    w, self, e,
                                    sw, s  , se) {
        var r = 0, l, newL, b, newB, bR, newBR,
            mask, cycle, newCycle, eightSum;

        eightSum = nw + n + ne + e + se + s + sw + w;
        cycle = (oldstate >> 7) & 1;
        mask = (oldstate >> 4) & 1;
        bR = (oldstate >> 3) & 1;
        b = (oldstate >> 2) & 1;
        l = (oldstate >> 1) & 1;

        if (cycle == 0) {

            //  Life update cycle

            if ((eightSum == 3) || ((eightSum == 2) && (l == 1))) {
                newL = 1;
            } else {
                newL = 0;
            }
            //  Turned on by firing Brain cells within region of mask
            if (mask == 1 && b == 1) {
                newL = 1;
            }
            newCycle = 1;
            r = (newCycle << 7) | (mask << 4) | (bR << 3) |
                (b << 2) | (newL << 1) | b;
        } else {

            //  Brain update cycle

            if (((bR == 0) && (b == 0)) && (eightSum == 2)) {
                newB = 1;
            } else {
                newB = 0;
            }
            //  Turned off by firing Life cells within region of mask
            if (l == 1 && mask == 1) {
                newB = 0;
            }
            newBR = b;
            newCycle = 0;
            r = (newCycle << 7) | (mask << 4) | (newBR << 3) |
                (newB << 2) | (l << 1) | l;
        }
        return r;
    }
