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

    /*  This is a special evaluator which is patched to
        demonstrate abiogenesis.  Three stochastic state
        stimulators will be placed on the map which will
        inject, in each generation, a sequence of states
        generated by a probabilistic finite state machine
        implemented in generationStart.  There is nothing
        magic about the location of the stimulus sites: I
        just picked them to evenly spread around the map.  */

    rule.evaluator.stimx = [ 160, 220, 60 ];    // X coordinate of stimulus
    rule.evaluator.stimy = [ 100, 160, 50 ];    // Y coordinate of stimulus
    rule.evaluator.stimstate = [ 0, 3, 6 ];     // Stimulus state
    rule.evaluator.stimp = [ 0, 0, 0 ];         // Map index of stimulus
    rule.evaluator.stimn = [ 0, 0, 0 ];         // Value to inject this generation

    rule.evaluator.generationStart = function () {

        /*  Loop through the stimulus table, update the state
            machine for each generator, and compute the value
            to inject at each site on this generation.  */
        for (var i = 0; i < rule.evaluator.stimx.length; i++) {
            rule.evaluator.stimp[i] = (rule.evaluator.stimy[i] * map[0].phyx) +
                rule.evaluator.stimx[i];
            var snew;

            //  This is the state machine that generates stimuli
            switch (rule.evaluator.stimstate[i]++) {
                case 0:         // Base state
                    snew = 0;
                    break;

                case 1:         // Emit a 1, make random branch to 2 or 6
                    snew = 1;
                    if (Math.random() < 0.05) {
                        rule.evaluator.stimstate[i] = 2;
                    } else {
                        rule.evaluator.stimstate[i] = 6;
                    }
                    break;

                case 2:         // Turn branch.  We come here one in 20 times
                    snew = 4;
                    break;

                case 3:
                    snew = 0;
                    break;

                case 4:
                    snew = 1;
                    break;

                case 5:
                    snew = 4;
                    rule.evaluator.stimstate[i] = 0;
                    break;

                case 6:         // Extend branch.  We come here 19 of 20 times
                    snew = 7;
                    rule.evaluator.stimstate[i] = 0;
                    break;
            }

            rule.evaluator.stimn[i] = snew;
        }
    };


    function Svonn4(cells, phyx, phyy, p) {

        /*  If this is a stimulus site, return stimulus computed
            at generationStart().  */
        for (var i = 0; i < rule.evaluator.stimp.length; i++) {
            if (p == rule.evaluator.stimp[i]) {
                return rule.evaluator.stimn[i];
            }
        }

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
