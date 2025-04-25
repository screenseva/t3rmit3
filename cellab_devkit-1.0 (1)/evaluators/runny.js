
    /*            User evaluator for "runny paint"
    
        This is an example of the kinds of dirty tricks in which
        one can engage when writing user evaluators.  It should
        *not* be used as a model for sane evaluators written for
        sane purposes by sane people.
        
        What we're doing here is simulating "runny paint" in a rule
        which causes zero cells (assumed to be black in the colour
        palette) which have nonzero cells to the north (assumed to be
        non-black) to swap positions.  This causes an arbitrary pattern
        to "run" downward on the screen until it reaches the bottom
        (where it stops because the rule does not iterate beyond the
        last row).
        
        To make things more interesting visually, we iterate over
        columns first and then within rows and, within each row, once
        we find a pair of columns to swap, we bail out and proceed to
        the next columns.  This makes the runny process proceed
        incrementally generation to generation rather than skipping
        large blocks of black space all at once.
        
        This is accomplished by loop which updates the entire
        old map in place at once, executed only once per
        generation on the first call for the top left cell,
        which we detect by a flag we set in a generationStart()
        function.  After performing the update on cells[], on
        this and subsequent calls we simply return the value
        from the old cell array, now updated, to be copied to
        the new.
        
        No lookup table is used.
        
        Note that no information outside that passed to the function
        is used in accomplishing these nefarious deeds.  If you're
        willing to delve into the context in which the user evaluator
        is called, even more evil can be perpetrated (but all bets are
        off whether it will continue to work on subsequent releases).
    
    */

    rule.evaluator.generationStart = function() {
        rule.evaluator.first = true;
    };
    
    function runny(cells, phyx, phyy, p, lut) {
        //  Ignore all calls except the first per generation
        if (rule.evaluator.first) {
            rule.evaluator.first = false;

            //  Iterate over columns
            for (var x = 0; x < phyx - 2; x++) {
                //  Iterate over rows
                for (var y = 0; y < phyy - 3; y++) {
                    //  Is cell to the south zero?
                    if (cells[p + ((y + 1) * phyx) + x] == 0) {
                        //  Yes.  Are we nonzero?
                        if (cells[p + (y * phyx) + x] != 0) {
                            //  Yes.  Proceed with swap of cells
                            cells[p + ((y + 1) * phyx) + x] =   // Copy self to south
                                cells[p + (y * phyx) + x];
                            cells[p + (y * phyx) + x] = 0;      // Zero self
                            y += 1;    //  Don't further propagate update on this generation
                        }
                    }
                }
            }
        }
        return cells[p];
    }
