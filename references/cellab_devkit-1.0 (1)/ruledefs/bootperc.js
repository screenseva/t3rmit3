    /*

                        Bootstrap Percolation

        This rule demonstrates process of bootstrap percolation:

            https://en.wikipedia.org/wiki/Bootstrap_percolation

        on a 2D lattice in either the von Neumann or Moore
        neighbourhoods (configured by the setting of vonnN
        in the code below).

        Cells, once set to 1, are never reset to 0.  Zero cells
        turn on if the number of neighbours which are nonzero
        equals or exceeds threshold, which defaults to 2 for the
        von Neumann neighbourhood and 4 for the Moore
        neighbourhood. The map is seeded with a random pattern
        of initial one cells with a density set by the
        rule.rseedp assignment below.

        Bootstrap percolation exhibits a critical density, below
        which the map will almost always remain isolated
        clusters and above which it will almost always become
        entirely one cells.  For the von Neumann neighbourhood
        the critical density is around 4.5, and for the Moore
        neighbourhood, it's around 7.7.  (If you change vonnN,
        don't forget to adjust rule.rseedp accordingly.) You can
        experiment with values around the critical density by
        re-randomising the map with the Random button and
        different densities.

        The companion bootperc.jcc colour palette shows zero
        cells as black, initially on cells as white, and cells
        turned on by the process of percolation in a false
        colour code indicating their age.  Cells just turned on
        are bright green, and highlight the advancing front.
        Older cells are shown with a gradient running from red
        to deep blue according to their age.  A map which has
        evolved to all cells on will show the initially-on cells
        in white against a deep blue background. The age is used
        only to colour the map and plays no part in the
        evaluation of the rule.

    */

    rule.worldtype = 1;         // 2D torus world
    rule.patreq = "zero";       // Guarantee planes 1-7 clear
    rule.palreq = "bootperc";
    rule.rseedb = 0;
    rule.rseedn = 1;
    rule.rseedp = Math.round(8 * (255.0 / 50));

    function bootperc(oldstate,     nw, n  , ne,
                                    w, self, e,
                                    sw, s  , se) {

        /*  Set vonnN true to evaluate in von Neumann
            neighbourhood (4 neighbours), false for Moore
            neighbourhood (8 neighbours).  */

        var vonnN = false;
        var sum, threshold;

        if (vonnN) {
            sum = n + e + s + w;
            threshold = 2;
        } else {
            sum = n + e + s + w + nw + ne + sw + se;
            threshold = 4;
        }

        if (self) {
            var age = oldstate >> 1;
            return 1 | ((age == 0) ? 0 : Math.max(age - 1, 1) << 1);
        }

        // If threshold met, turn on cell, start age at 125
        return ((sum >= threshold) ? (1 | (125 << 1)) : 0);
    }
