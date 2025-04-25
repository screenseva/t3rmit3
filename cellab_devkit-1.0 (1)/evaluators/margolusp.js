    /*
    
                Margolus neighbourhood evaluator
        
        This evaluator implements the alternating four cell
        block Margolus neighbourhood without the need for the
        rule definition to handle the housekeeping of horizontal,
        vertical, and temporal phases, reducing the complexity
        of the rule definition and freeing up the bits in the
        cell which would have been used by them for other
        purposes.
        
        We maintain a variable (in the static rule.evaluator
        object) called phase, which keeps track of the row and
        column number and assigns the cells in the map position
        numbers in a grid like:
        
                        0 1 0 1 ..
                        2 3 2 3 ..
                        0 1 0 1 ..
                        2 3 2 3 ..
                        : : : :

        This lattice is then divided into blocks of four cells on
        successive generations as:
        
               A blocks 0 1   and  B blocks 3 2
                        2 3                 1 0

        with the cell's position in the A blocks used on even
        numbered generations and the B blocks on odd generations.
        
        Neighbours are defined as:
        
            CW      Clockwise
            CCW     Counter-clockwise
            OPP     Opposite
            
        If * represents the current cell, its neighbours
        thus have the following representations, depending
        upon the position in the block for the current
        generation and its position number from the spatial
        phase (0-3):
        
             *  CW  | CCW  * | CW  OPP | OPP CCW
            CCW OPP | OPP CW |  *  CCW | CW   *
            
        See Toffoli & Margolus, Chapter 12, p. 119 for additional
        details.
        
        Our phase variable contains a value from 0 to 7,
        with the bits assigned as follows:
        
            Bit 0   Horizontal phase: inverted every column
            Bit 1   Vertical phase:   inverted every row
            Bit 2   Temporal phase:   inverted every generation
            
        It is evident that the two low-order bits of this
        value partition the map into the lattice of numbered
        cells given above, and the high bit can be used to
        select which block assignment is used for a given
        generation.
        
        In practice, the phase variable is used directly as an
        index to the CW/CCW/OPP arrays (kept as Int16Arrays for
        efficiency), which give the offset from the current cell
        p's location at which the logical neighbour is to be
        found.
        
        The index to the lookup table is formed from the low
        order two bits of each of the three logical neighbours
        in the high byte of the index, as follows:
        
            CW1 CW0 CCW1 CCW0 OPP1 OPP0 0 P
         
         where the 1 and 0 indicate the bit numbers in the named
         neighbour cells.  The low order bit supplies the
         temporal phase to the rule, if it's interested.  If the
         rule needs the spatial phase, it can devote two bits of
         the cell's state to it in the conventional manner or
         use the margolus.js evaluator, which supplies it (but
         doesn't provide temporal phase, due to the 16 bit
         limitation on the lookup table index.  The low order
         byte of the lookup table index is the cell's old state
         in the conventional manner.  The rule can obtain the
         cell's own state by extracting it from the oldstate
         argument passed to it.
    */
    
    //  Composite phase
    rule.evaluator.phase = 0;
    
    //  Column counter (used to determine end of row)
    rule.evaluator.column = 0;
    
    //  Offsets to neighbours used in defining the arrays below
    rule.evaluator.NW = -(map[0].phyx + 1);
    rule.evaluator.N = -map[0].phyx;
    rule.evaluator.NE = -(map[0].phyx - 1);
    rule.evaluator.W = -1;
    rule.evaluator.E = 1;
    rule.evaluator.SW = map[0].phyx - 1;
    rule.evaluator.S = map[0].phyx;
    rule.evaluator.SE = map[0].phyx + 1;
    
    //  CW neighbour
    rule.evaluator.CW = new Int16Array([
                                //  Temporal phase 0
            rule.evaluator.E,       //  Position 0
            rule.evaluator.S,       //           1
            rule.evaluator.N,       //           2
            rule.evaluator.W,       //           3
                                //  Temporal phase 1
            rule.evaluator.W,       //  Position 0
            rule.evaluator.N,       //           1
            rule.evaluator.S,       //           2
            rule.evaluator.E        //           3            
                                       ]);
    
    //  CCW neighbour
    rule.evaluator.CCW = new Int16Array([
                                //  Temporal phase 0
            rule.evaluator.S,       //  Position 0
            rule.evaluator.W,       //           1
            rule.evaluator.E,       //           2
            rule.evaluator.N,       //           3
                                //  Temporal phase 1
            rule.evaluator.N,       //  Position 0
            rule.evaluator.E,       //           1
            rule.evaluator.W,       //           2
            rule.evaluator.S        //           3            
                                        ]);
    
    //  OPP neighbour
    rule.evaluator.OPP = new Int16Array([
                                //  Temporal phase 0
            rule.evaluator.SE,      //  Position 0
            rule.evaluator.SW,      //           1
            rule.evaluator.NE,      //           2
            rule.evaluator.NW,      //           3
                                //  Temporal phase 1
            rule.evaluator.NW,      //  Position 0
            rule.evaluator.NE,      //           1
            rule.evaluator.SW,      //           2
            rule.evaluator.SE       //           3            
                                        ]);

    //  When something changes, reset the phase to zero
    rule.evaluator.onChange = function(w) {
        rule.evaluator.generationFirstDone = false;
    };
    
    //  Before the first generation, set phase to zero
    rule.evaluator.generationFirst = function() {
        rule.evaluator.phase = 0;
    };
    
    /*  At end of generation, reset horizontal and vertical
        phases (shouldn't be necessary, but you can't be too
        careful) and invert the temporal phase.  */
    rule.evaluator.generationEnd = function() {
//if (rule.evaluator.phase & 1) {
//    alert("Blooie!  Spatial phase (" + rule.evaluator.phase + ") nonzero at end of map.");
//    running = false;
//}
        rule.evaluator.phase = (rule.evaluator.phase & 0xFC) ^ 4;
    };       

    function margolusp(cells, phyx, phyy, p, lut) {
        //  Fill in old state and temporal phase in index
        var idx = (cells[p] | ((rule.evaluator.phase & 4) << 6)) |
        
        //  Add state of CW cell
            ((cells[p + rule.evaluator.CW[rule.evaluator.phase]] & 3) << 14) |
        
        //  Add state of CCW cell
            ((cells[p + rule.evaluator.CCW[rule.evaluator.phase]] & 3) << 12) |
        
        //  Add state of OPP cell
            ((cells[p + rule.evaluator.OPP[rule.evaluator.phase]] & 3) << 10);

        rule.evaluator.phase ^= 1;      // Update horizontal phase
        rule.evaluator.column++;        // Increment column in map
        if (rule.evaluator.column >= map[0].dimx) {
//if (rule.evaluator.phase & 1) {
//    alert("Blooie!  Horizontal phase nonzero at end of row.");
//    running = false;
//}
            rule.evaluator.column = 0;  // Reset column counter
            rule.evaluator.phase ^= 2;  // Update vertical phase
        }

        return lut[idx];
    }
