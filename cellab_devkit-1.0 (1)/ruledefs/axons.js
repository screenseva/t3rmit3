/*

        A one dimensional rule that only looks at one bit of two
        neighbors.  We run it as world type 3, which gets one bit from
        each of 8 neighbors.  The rule is totalistic, meaning that it
        only looks at the SUM of its neighborhood.  The rule is also
        reversible, meaning that it saves its past state and XORs its
        calculated new state with the past state.  A final fillip to
        make this rule look good is that I use my extra six bits of
        state as a five bit clock and as a mask indicator.  Whenever
        the clock counts up to 31, I turn on the bits where mask is
        on.  The start pattern for this consists of two dots with bit
        #0 turned on, all the times set to 0, and a pair of dots with
        mask set to 1.  You can vary the constant WolfCode to get
        other pictures.

*/

    rule.worldtype = 3;          // 1D ring world, 8 neighbours
    rule.patreq = "axons";
    rule.palreq = "mask3";      // Only show low two bits

    function axons(oldstate,     l4, l3, l2, l1,
                                      self,
                                 r1, r2, r3, r4) {
        var WolfCode = 178;
        
        var sum, pastSelf, newSelf, newState, time, mask;

        sum = l1 + self + r1;
        pastSelf = (oldstate >> 1) & 1;
        newSelf = (WolfCode >> sum) & 1;
        newState = (self << 1) | (newSelf ^ pastSelf);
        time = (oldstate >> 2) & 31;
        mask = (oldstate >> 7) & 1;

        return (time == 31) ? ((mask << 7) | newState | mask) :
                              ((mask << 7) | ((time + 1) << 2) | newState);
    }
