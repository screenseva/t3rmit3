
    /*  User evaluator for the Laplace averaging.  All
        computation is in the code: no lookup table is
        used.  */
    
    function laplace(cells, phyx, phyy, p, lut) {
        //  Compute Laplace average of neighbours
        //      LaplaceAverage = (4 x (N + E + S + W) +
        //      (NW + NE + SE + SW)) / 20
        var s = 0;
        
        s += cells[p - phyx];           // n
        s += cells[p - 1];              // w
        s += cells[p + 1];              // e
        s += cells[p + phyx];           // s
        s *= 4;
         
        s += cells[p - (phyx + 1)];     // nw
        s += cells[p - (phyx - 1)];     // ne
        s += cells[p + (phyx - 1)];     // sw
        s += cells[p + (phyx + 1)];     // se
        
        return Math.floor((s + 10) / 20);
    }
