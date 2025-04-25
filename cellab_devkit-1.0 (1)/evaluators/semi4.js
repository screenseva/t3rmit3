    /*  Four neighbour semitotalistic evaluator defined as own-code
    
	    This assumes a lookup table built with the upper 6 bits of the
	    index representing the local state of the centre cell and the
	    lower 10 bits the arithmetic sum for the four neighbouring
	    cells (0 to 1020).  Note this is NOT compatible with the
	    built-in world type of 11--this definition gives you one more
	    bit of local state and lets you choose either an open or a
	    closed world.  */


    function semi4(cells, phyx, phyy, p, lut) {
        var s = 0;
        
        s += cells[p - 1];              // w
        s += cells[p + 1];              // e
        s += cells[p - phyx];           // n
        s += cells[p + phyx];           // s
//  DOESN'T INCLUDE STATE OF CURRENT CELL UNTIL I CAN FIGURE
//  OUT HOW TO REMAP LUT TO ACCOUNT FOR ROTATION.
//        s |= cells[p] << 10;            // self
        
        return lut[s];
    }
