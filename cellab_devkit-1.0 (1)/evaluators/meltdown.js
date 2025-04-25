
    /*            User evaluator for "meltdown"

        This user evaluator illustrates a moderately tricky
        application.  It applies a bubble sort algorithm to each
        column of the map on each generation to propagate bytes
        with higher state codes downward until they reach the
        bottom line. This makes histograms from a map, sorted by
        state code, precisely like the [Margolus&Toffoli87]
        SAFE-PASS rule (Page 78).  Unlike that rule, this
        evaluator sorts any map states, 0 to 255, and requires
        neither a lookup table nor any housekeeping bits.  Thus,
        you can load it after running another rule and easily
        produce a histogram.

        For details of the dirty tricks used in this evaluator,
        see the comments in "runny" in the same directory.

    */

    rule.evaluator.generationStart = function() {
        rule.evaluator.first = true;
    };

    function meltdown(cells, phyx, phyy, p, lut) {
        //  Ignore all calls except the first per generation
        if (rule.evaluator.first) {
            rule.evaluator.first = false;

            //  Iterate over columns
            for (var x = 0; x < phyx - 2; x++) {
                //  Iterate over rows
                for (var y = 0; y < phyy - 3; y++) {
                    //  Is cell to the south less than self?
                    if (cells[p + ((y + 1) * phyx) + x] <
                        cells[p + (y * phyx) + x]) {
                        //  Yes.  Proceed with swap of Clem and the Yankee
                        var clem = cells[p + ((y + 1) * phyx) + x];
                        cells[p + ((y + 1) * phyx) + x] =   // Copy self to south
                            cells[p + (y * phyx) + x];
                        cells[p + (y * phyx) + x] = clem;   // Copy south to self
                        y += 1;    //  Don't further propagate update on this generation
                    }
                }
            }
        }
        return cells[p];
    }
