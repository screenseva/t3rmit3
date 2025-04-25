    /*  User evaluator for von Neumann neighbourhood with
        4 bits of state visible from each neighbour and
        the local cell.

        This is an auxiliary lookup table evaluator.  It
        produces a 20 bit index addressing the one megabyte
        lookup table produced by a compatible rule definition
        program and stored in rule.program.lutaux[].  It
        ignores the regular 64K lookup table.

        Neighbourhood is:

                N
              W C E
                S

        and the index to the lookup table is:

           CCCC   NNNN WWWW   EEEE SSSS
    */

    function vonn4(cells, phyx, phyy, p) {
        var self = cells[p];
        var north = cells[p - phyx];
        var south = cells[p + phyx];
        var east = cells[p + 1];
        var west = cells[p - 1];

        return rule.program.lutaux[
                    ((self  & 0xF)  << 16) |
                    ((north & 0xF)  << 12) |
                    ((west  & 0xF)  <<  8) |
                    ((east  & 0xF)  <<  4) |
                     (south & 0xF)];
    }
