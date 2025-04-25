
    /*
        Flow of a slightly compressible fluid

        This is based upon the Java cellular automata
        water simulator developed by Janis Elsts (W-Shadow)
        as described in the document:
            http://w-shadow.com/blog/2009/09/01/simple-fluid-simulation/

        The rule is run as a user evaluator with no lookup
        table.  It starts on a map in which air, ground, and
        water are represented by the states given below.  It
        uses the map to initialise a floating point auxiliary
        map which keeps track of the mass of water in each cell.
        At the end of each generation, the mass map is used to
        update the displayed map, with cells containing more
        than MinMass considered water and those that mass or
        less deemed air.

    */

    //  Cell types
    rule.evaluator.AIR = 0;
    rule.evaluator.GROUND = 1;
    rule.evaluator.WATER = 2;

    //  Properties of water
    rule.evaluator.MaxMass = 1.0;
    rule.evaluator.MaxCompress = 0.02;
    rule.evaluator.MinMass = 0.0001;

    // Max units of water moved out of one cell to another per generation
    rule.evaluator.MaxSpeed = 1.0;

    //  Mininum flow between cells per generation
    rule.evaluator.MinFlow = 0.01;
    
//  To make the flow more "lively" (albeit less realistic), use:
rule.evaluator.MaxCompress = 0.10;
rule.evaluator.MaxSpeed = 10.0;
rule.evaluator.MinFlow = 0.5;

    //  Allocate the old and new mass arrays
    rule.evaluator.mass = [];
    rule.evaluator.mass[0] = new Float32Array(new
        ArrayBuffer(map[0].phyx * map[0].phyy * 4));
    rule.evaluator.mass[1] = new Float32Array(new
        ArrayBuffer(map[0].phyx * map[0].phyy * 4));

    rule.evaluator.first = true;    // First time initialisation ?

    //  Relative indices of neighbours
    rule.evaluator.S = map[0].phyx;
    rule.evaluator.W = -1;
    rule.evaluator.E = 1;
    rule.evaluator.N = -map[0].phyx;

    //  When the pattern changes, re-initialise mass from the map
    rule.evaluator.onChange = function(w) {
//console.log("onChange: " + w);
        rule.evaluator.generationFirstDone = false;
    };

    //  Before the first generation, initialise mass from map
    rule.evaluator.generationFirst = function() {
//console.log("generationFirst");

        //  Return linear map address for (x, y) co-ordinates
        //  Can't declare as usual function because it confuses
        //  the evaluator parser.
        var la = function(x, y) {
            return (y * map[0].phyx) + x;
        };

        /*  Initialise the mass arrays from the map.  Each
            cell intially containing water is set to MaxMass,
            all other cells to zero.  Note that we initialise
            the wrap-around cells at the edges of the map,
            which the open world evaluator has already set to
            0 (AIR).  */

        for (var y = 0; y < map[0].phyy; y++) {
            for (var x = 0; x < map[0].phyx; x++) {
                rule.evaluator.mass[0][la(x, y)] =
                    rule.evaluator.mass[1] [la(x, y)] =
                    map[omap].cells[la(x, y)] == rule.evaluator.WATER ?
                        rule.evaluator.MaxMass : 0.0;
            }
        }

    };

    /*  End of generation processing.  After updating each cell
        in the map, the simulator invokes this function which
        synchronises the new and old mass arrays and updates the
        map to reflect the presence or absence of water in each
        cell according to its content in the mass array.  */

    rule.evaluator.generationEnd = function() {
        var nmap = (omap + 1) & 1;

        //  Blast copy new map to old map
        rule.evaluator.mass[omap].set(rule.evaluator.mass[nmap]);

        /*  Update the cells in the new map to indicate
            current presence of water.  */
        var np = map[omap].phyx + 1, x, y;
        for (y = 0; y < map[omap].phyy - 2; y++) {
            for (x = 0; x < map[omap].phyx - 2; x++) {
                if (map[omap].cells[np] != rule.evaluator.GROUND) {
                    if (rule.evaluator.mass[omap][np] >
                        rule.evaluator.MinMass) {
                        map[nmap].cells[np] = rule.evaluator.WATER;
                    } else {
                        map[nmap].cells[np] = rule.evaluator.AIR;
                    }
                }
                np++;
            }
            np += 2;
        }

        //  Clear out the wrap cells in the mass array

        for (x = 0; x < map[omap].phyx; x++) {
            rule.evaluator.mass[omap][x] =
                rule.evaluator.mass[omap][x + (map[omap].phyx * (map[omap].phyy - 1))] = 0;
        }
        for (y = 0; y < map[omap].phyy; y++) {
            rule.evaluator.mass[omap][y * map[omap].phyx] =
                rule.evaluator.mass[omap][(y * map[omap].phyx) + (map[omap].phyx - 1)] = 0;
        }
    }

    function water(cells, phyx, phyy, p, lut, ncells) {
        var self = cells[p];
        var nmap = (omap + 1) & 1;

        //  If it's an inert ground cell, nothing to do
        if (self == rule.evaluator.GROUND) {
            return self;
        }

        var Flow, remaining_mass;

        Flow = 0;
        remaining_mass = rule.evaluator.mass[omap][p];
        //  If no mass left in cell, we're done
        if (remaining_mass <= 0) {
            return self;
        }

        //  Handle propagation to S neighbour
        if (cells[p + rule.evaluator.S] != rule.evaluator.GROUND) {
            Flow = get_stable_state_b(remaining_mass +
                rule.evaluator.mass[omap][p + rule.evaluator.S]) -
                   rule.evaluator.mass[omap][p + rule.evaluator.S];
            if (Flow > rule.evaluator.MinFlow) {
                Flow *= 0.5;    // Leads to smoother flow
            }
            Flow = constrain(Flow, 0, Math.min(rule.evaluator.MaxSpeed, remaining_mass));

            rule.evaluator.mass[nmap][p] -= Flow;
            rule.evaluator.mass[nmap][p + rule.evaluator.S] += Flow;
            remaining_mass -= Flow;

            if (remaining_mass <= 0)  {
                return self;
            }
        }

        //  Equalise water between this cell and its W neighbour
        if (cells[p + rule.evaluator.W] != rule.evaluator.GROUND) {
            Flow = (rule.evaluator.mass[omap][p] -
                rule.evaluator.mass[omap][p + rule.evaluator.W]) / 4;
            if (Flow > rule.evaluator.MinFlow) {
                Flow *= 0.5;
            }
            Flow = constrain(Flow, 0, remaining_mass);

            rule.evaluator.mass[nmap][p] -= Flow;
            rule.evaluator.mass[nmap][p + rule.evaluator.W] += Flow;
            remaining_mass -= Flow;

            if (remaining_mass <= 0) {
                return self;
            }
        }

        //  Equalise water between this cell and its E neighbour
        if (cells[p + rule.evaluator.E] != rule.evaluator.GROUND) {
            Flow = (rule.evaluator.mass[omap][p] -
                rule.evaluator.mass[omap][p + rule.evaluator.E]) / 4;
            if (Flow > rule.evaluator.MinFlow) {
                Flow *= 0.5;
            }
            Flow = constrain(Flow, 0, remaining_mass);

            rule.evaluator.mass[nmap][p] -= Flow;
            rule.evaluator.mass[nmap][p + rule.evaluator.E] += Flow;
            remaining_mass -= Flow;

            if (remaining_mass <= 0) {
                return self;
            }
        }

        //  Allow compressed water to flow up to the N neighbour
        if (cells[p + rule.evaluator.N] != rule.evaluator.GROUND) {
            Flow = remaining_mass -
                get_stable_state_b(remaining_mass +
                    rule.evaluator.mass[omap][p + rule.evaluator.N]);
            if (Flow > rule.evaluator.MinFlow) {
                Flow *= 0.5;
            }
            Flow = constrain(Flow, 0, Math.min(rule.evaluator.MaxSpeed, remaining_mass));

            rule.evaluator.mass[nmap][p] -= Flow;
            rule.evaluator.mass[nmap][p + rule.evaluator.N] += Flow;
        }

        return self;

        /*  Take an amount of water and calculate how it should
            be split between two vertically adjacent cells.
            Returns the amount of water that should be in the
            bottom cell.  */
        function get_stable_state_b(total_mass) {
            if (total_mass <= 1){
                return 1;
            } else if (total_mass < ((2 * rule.evaluator.MaxMass) +
                rule.evaluator.MaxCompress)) {
                return ((rule.evaluator.MaxMass * rule.evaluator.MaxMass)
                    + (total_mass * rule.evaluator.MaxCompress)) /
                    (rule.evaluator.MaxMass + rule.evaluator.MaxCompress);
            } else {
                return (total_mass + rule.evaluator.MaxCompress) / 2;
            }
        }

        //  Constrain a value within a minimum and maximum bound
        function constrain(v, min, max) {
            return Math.max(min, Math.min(v, max));
        }

        return self;
    }
