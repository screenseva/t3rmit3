
    /*
    	    Random gas diffusion with wall constraints

        Cells are swapped with a neighbour selected at random.
        The header declaration rule.evaluator.percent specifies
        the percentage of cells which will be updated on each
        generation.  This can be set to make the diffusion of
        the gas more gradual.

        Any cell with the bit defined by rule.evaluator.wall
        is an impermeable wall.  It will remain frozen and
        gas particles will not enter it.  You can use any
        states which do not have this bit set as gas. The
        evaluator is easily modified to reserve only a
        single state for walls; the bit mask is used to
        make it compatible with the Perfume pattern and
        palette.

        The lookup table is not used; this evaluator can run
        with the generic owncode.jc rule.

	The rule runs its own randomiser, using JavaScript's
	Math.random(). Note the dirty trick we use to reuse a
	single call on Math.random() for the percentage test and
	the direction of diffusion. Math.random() is expensive
	to call, and we'd rather not call it twice for every
	cell we update.  The multiply and mod on the subsequent
	uses avoids correlation of direction with whether the
	cell is to be updated.
    */

    //  Percentage of cells to update each generation
    rule.evaluator.percent = 100;

    //  Bit which indicates an impermeable wall
    rule.evaluator.wall = 4;

    //  Indices of neighbours for random propagation direction
    rule.evaluator.nindex = [ -(map[0].phyx + 1), -map[0].phyx, -(map[0].phyx - 1),
                                      -1,                                1,
                               (map[0].phyx - 1),  map[0].phyx,  (map[0].phyx + 1) ];

    function gaswall(cells, phyx, phyy, p, lut, ncells) {

        var self = cells[p];

        //  If self is a wall, leave as-is
        if (self & rule.evaluator.wall) {
            return self;
        }

        var rx = Math.random();

        //  If random value is above update percent, skip cell
        if (Math.floor(rx * 100) >= rule.evaluator.percent) {
            return self;
        }

        //  Random index to neighbour offset table
        var r = Math.floor(((rx * 25523) % 1.0) * 8);

    	// Neighbour index in cells[]
    	var np = neighAddr(p + rule.evaluator.nindex[r]);

        //  Old value for neighbour
        var neigh = cells[np];

        //  If neighbour is a wall, leave as-is
        if (neigh & rule.evaluator.wall) {
            return self;
        }

        //  New value for self
        var newself = neigh;

        //  Update neighbour in old map
        cells[np] = self;

        //  Update neighbour in new map
        ncells[np] = self;

        //  Update self in old map
        cells[p] = newself;

        //  Return our new state
        return newself;
	
	/*  Return cells[] index of neighbour cell whose
	    naive address is a, accounting for wrap-around
	    if the world is toroidal.  If the world is open,
	    just return the index and let the zeroed border
	    cells handle it.  */
	    
	function neighAddr(a) {
            if (rule.worldtype & 1) {
		//	Closed world: Perform manual toroidal wrap-around

        	//  Obtain neighbour x and y co-ordinates from neighbour offset
        	var neighy = Math.floor(a / phyx);
        	var neighx = a % phyx;

        	/*  To avoid loss of gas particles by swapping them into
                    an edge wrap-around region, we must perform the wrap
                    ourselves, wrapping the neighbour's address in the
                    physical map and not relying on the edge cells.
                    The following messy code detects neighbours in the
                    edge region and redirects them to the other end of
                    the map.  */

        	if (neighy == 0) {
                    neighy = phyy - 2;
        	} else if (neighy == (phyy - 1)) {
                    neighy = 1;
        	}
        	if (neighx == 0) {
                    neighx = phyx - 2;
        	} else if (neighx == (phyx - 1)) {
                    neighx = 1;
        	}
        	a = (neighy * phyx) + neighx;
            }
	    return a;
	}
    }
