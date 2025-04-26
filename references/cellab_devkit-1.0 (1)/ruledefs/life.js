    /*

        The Life rule with one bit of memory.

    */
    
    rule.worldtype = 1;          // 2D torus world
    rule.palreq = "default";
    
    function life(oldstate,     nw, n  , ne,
                                w, self, e,
                                sw, s  , se
                  ) {
        var eightSum, newSelf = 0, newState;

        eightSum = nw + n + ne + e + se + s + sw + w;
        switch (self) {
            case 0:
                if (eightSum == 3) {
                    newSelf = 1;
                } else {
                    newSelf = 0;
                }
                break;

            case 1:
                if (eightSum == 2 || eightSum == 3) {
                    newSelf = 1;
                } else {
                    newSelf = 0;
                }
                break;
        }
        /*  "& 0x2" to only save the most recent bit of state.
            Replace this with "& 0xFE" to see more "trails".  */
        newState = (oldstate << 1) & 0x2;
        
        return newState | newSelf;
    }
