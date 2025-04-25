
    //  Eight neighbour semitotalistic evaluator defined as own-code

    function semi8(cells, phyx, phyy, p, lut) {
        var s = 0;
        
        s += cells[p - 1];              // w
        s += cells[p + 1];              // e
        s += cells[p - (phyx + 1)];     // nw
        s += cells[p - phyx];           // n
        s += cells[p - (phyx - 1)];     // ne        
        s += cells[p + (phyx - 1)];     // sw
        s += cells[p + phyx];           // s
        s += cells[p + (phyx + 1)];     // se
//  DOESN'T INCLUDE STATE OF CURRENT CELL UNTIL I CAN FIGURE
//  OUT HOW TO REMAP LUT TO ACCOUNT FOR ROTATION.
//        s |= cells[p] << 11;            // self
        
        return lut[s];
    }
