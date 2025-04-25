    /*  User evaluator to apply a bit mask to every cell
        in the map.
    */
    
    function maskmap(cells, phyx, phyy, p, lut) {
        var andmap = 0xEF;
        var ormap = 0;

        return (cells[p] & andmap) | ormap;  
    }
