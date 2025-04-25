/*

        This is modelled on the Hodgepodge rule of Gerhardt and
        Schuster, but is not a close enough model to produce a
        Zhabotinsky reaction except after extremely long run times.

        The start pattern used is the Shroud of Turing visage of
        "Bob".  Bob is the High Epopt of the Church of the SubGenius.
        For more information about Bob and the Church, send $1 and a
        long stamped self-addressed envelope to:

                The SubGenius Foundation
                Box 181417,
		Cleveland Heights, OH  44118-1417
                USA

        The image of Bob is a registered trademark of the Church of
        the Subgenius and is used by special arrangement with Douglas
        St. Claire Smith, a.k.a. Ivan Stang.  Inquiries about
        further usage of Bob's image should be directed to Mr. Smith
        c/o The SubGenius Foundation.

*/

    rule.worldtype = 1;          // 2D torus world
    rule.ruleName = "bob";
    rule.patreq = "bob";
    rule.palreq = "bob";
    
    function bob(oldstate,     nw, n  , ne,
                               w, self, e,
                               sw, s  , se) {

        var eightSum = nw + n + ne + e + se + s + sw + w,
            sickness, newState;

        if (oldstate == 0) {
            if (eightSum == 0) {
                newState = 0;
            } else {
                newState = eightSum | 1;
            }
        } else {
            sickness = oldstate >> 1;
            if (sickness == 64) {
                newState = 0;
            } else {
                sickness = sickness + eightSum + 3;
                if (sickness > 64) {
                    sickness = 64;
                }
                newState = (sickness << 1) | 1;
            }
        }
        return newState;
    }
