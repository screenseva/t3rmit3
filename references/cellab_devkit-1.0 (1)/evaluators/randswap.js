
    /*
        Random swap with a neighbour
        
        First put EveryCell's eight bits in the low order bits
        and put the eight bits of a single randomly selected
        neighbor into the high order bits of an index into the
        lookup table.  This will be new EveryCell. Then exchange
        the bytes of the index and use this to index the same
        lookup table to find new neighbour.
          
        Then, after EveryCell's and neighbour's new cells value
        are computed, swap these two cell values.
        
        The rule runs its own randomiser, using JavaScript's
        Math.random().
    */
    
    rule.evaluator.nindex = [ -(map[0].phyx + 1), -map[0].phyx, -(map[0].phyx - 1),
                                      -1,                                1,
                               (map[0].phyx - 1),  map[0].phyx,  (map[0].phyx + 1) ];

    function randswap(cells, phyx, phyy, p, lut, ncells) {

        //  Random index to neighbour offset table
        var r = Math.floor(Math.random() * 8);

        // Neighbour index in cells[]
        var np = neighAddr(p + rule.evaluator.nindex[r]);
                        
        var neigh = cells[np];
        var self = cells[p];
        
        //  New value for self
        var newself = lut[(neigh << 8) | self];
                
        //  New value for neighbour
        var newneigh = lut[(self << 8) | neigh];
        
        //  Update neighbour in old map
        cells[np] = newself;
        
        //  Update neighbour in new map
        ncells[np] = newself;
        
        //  Update self in old map
        cells[p] = newneigh;
        
        //  Return our new state
        return newneigh;

        /*  Return cells[] index of neighbour cell whose
            naive address is a, accounting for wrap-around
            if the world is toroidal.  If the world is open,
            just return the index and let the zeroed border
            cells handle it.  */

        function neighAddr(a) {
            if (rule.worldtype & 1) {
                //      Closed world: Perform manual toroidal wrap-around

                //  Obtain neighbour x and y co-ordinates from neighbour offset
                var neighy = Math.floor(a / phyx);
                var neighx = a % phyx;

                /*  To avoid loss of cells by swapping them into
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
