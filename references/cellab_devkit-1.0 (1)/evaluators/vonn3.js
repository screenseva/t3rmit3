    /*  User evaluator for von Neumann neighbourhood with
        3 bits of state visible from each neighbour and 4 bits
        of local state.
        
        Neighbourhood is:
        
                N
              W C E
                S
        
        and index to the lookup table is:
        
            CCCCNNNW WWEEESSS
    */
    
    function vonn3(cells, phyx, phyy, p, lut) {
        var self = cells[p];
        var north = cells[p - phyx];
        var south = cells[p + phyx];
        var east = cells[p + 1];
        var west = cells[p - 1];

        return lut[((self & 0xF) << 12) |
                   ((north & 7) << 9) |
                   ((west & 7) << 6) |
                   ((east & 7) << 3) |
                    (south & 7)];  
    }
