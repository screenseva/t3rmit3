/*
    
        John Horton Conway's game of Life.  This is a simple
        implementation with no memory trail.  See life.js for
        a version with one bit of memory.
        
*/

    rule.worldtype = 1;          // 2D torus world
    
    function ex_life(oldstate,     nw, n  , ne,
                                   w, self, e,
                                   sw, s  , se) {
        var eightSum, newSelf = 0;

        /*  We sum up the number of firing neighbor cells.  If this
            eightSum is anything other than 2 or 3, the cell gets
            turned off.  If the eightSum is 2, the cell stays in its
            present state.  If the eightSum is 3, the cell gets turned
            on. */

        eightSum = nw + n + ne + e + se + s + sw + w;
        if (eightSum == 2) {
            newSelf = self;
        } else if (eightSum == 3) {
            newSelf = 1;
        }

        return newSelf;
    }
