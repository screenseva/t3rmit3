/*

    A one dimensional rule with two neighbors, and 4 bits of each
    neighbor visible.  This is run as a sixteen state rule, where
            NewC = (L + OldC + R) / 3 + 1.

*/

    rule.worldtype = 9;     	// 1D ring world, 2 neighbours
    rule.palreq = "aurora";
    rule.rseedb = 0;            // Initial random seed, planes 0-3
    rule.rseedn = 4;

    function aurora(oldstate,     l, self, r) {
        return ((l + (oldstate & 15) + r) / 3) + 1;
    }
