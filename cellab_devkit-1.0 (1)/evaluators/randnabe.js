
    /*  Random choice of a neighbour
    
        This evaluator is similar to randswap() above, but
        it does not do the physical swapping of neighbours.
        Instead, it picks one of eight neighbours of the
        current cell and constructs a lookup table index
        from the current cell's state as the low-order 8
        bits and the neighbour's state as the high-order
        8 bits.  It then sets the current cell to the value
        from the lookup table at that index.
        
        The rule runs its own randomiser, using JavaScript's
        Math.random().
    */
    
    rule.evaluator.nindex = [ -(map[0].phyx + 1), -map[0].phyx, -(map[0].phyx - 1),
                                      -1,                                1,
                               (map[0].phyx - 1),  map[0].phyx,  (map[0].phyx + 1) ];

    function randnabe(cells, phyx, phyy, p, lut) {

        //  Random index to neighbour offset table
        var r = Math.floor(Math.random() * 8);
                        
        var neigh = cells[p + rule.evaluator.nindex[r]];
        var self = cells[p];
        
        //  New value for self
        var newself = lut[(neigh << 8) | self];
                        
        //  Return our new state
        return newself;
    }
