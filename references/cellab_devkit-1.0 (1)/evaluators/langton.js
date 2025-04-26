    
    //  Own code evaluator for the Langton rule
    
    function langton(cells, phyx, phyy, p, lut) {
        /*  The index to the lookup table consists of three
            bits of state from each of the Von Neumann
            neighbours plus four bits of state from the
            cell being updated.  Due to the bit rotation in
            the original state map, the states were doubled
            to as to appear in the low-order bits of the
            rotated map.  We must compensate for that here.
            The Langton rule actually only uses three of the
            four bits of state from the cell.  The lookup
            table index is:
            
                C C C C N N N E   E E S S S W W W
            */
            
            var s;
            
            s = (cells[p - 1] >> 1) & 7;            // w
            s |= ((cells[p + phyx] >> 1) & 7) << 3; // s
            s |= ((cells[p + 1] >> 1) & 7) << 6;    // e
            s |= ((cells[p - phyx] >> 1) & 7) << 9; // n
            s |= ((cells[p] >> 1) & 0xF) << 12;     // self
            
            return lut[s];
    }
