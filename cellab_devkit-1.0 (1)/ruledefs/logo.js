/*

        The CelLab Animated Logo

        This rule uses the 4 bit to decide whether a
        cell runs the Brain rule (background) or the
        Time Tunnel rule (foreground).

*/

    rule.reqworld = 1;          // 2D torus world
    rule.patreq = "logo";
    rule.palreq = "logo";


    function logo(oldstate,     nw, n  , ne,
                                w, self, e,
                                sw, s  , se) {
        var ttmap = [ 0, 1, 1, 1, 1, 0 ];

        //  Cells with the 8 bit set are invariant
        if (oldstate & 8) {
            return oldstate;
        }

        //  Cells with the 4 bit set run Brain
        if (oldstate & 4) {
            var count = nw + n + ne + w + self + e + sw + s + se;
            var nstate;

            oldstate &= 3;                  // Strip rule flag bit
            if (oldstate == 2) {            // If in refractory state...
                nstate = 0;                 // ...become ready.
            } else if (oldstate == 1) {     // If firing...
                nstate = 2;                 // ...go to refractory state.
            } else {
                nstate = (count == 2) ? 1 : 0;  /* If ready, fire if precisely
                                                   two neighbours are firing. */
            }
            return nstate | 4;
        }

        //  Other cells run TimeTun
        return (ttmap[self + n + s + w + e] ^ ((oldstate >> 1) & 1)) |
                (self << 1);
    }
