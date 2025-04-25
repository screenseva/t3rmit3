    /*

                       Diffuse with dendrite accretion.

        Note that Diffuse needs randomizer set to 50% ones, and that
        Dendrite needs a frozen pattern in plane 7 to accrete to, and an
        initial gas pattern gas in plane 0.

            We use plane #0 to show bits for updating.
            We use planes #1,2,3 for randomizer info.  We don't use plane #4.
            We use plane #5 for the phase:
            If bit #5 is 0 we update the gas motion,
            If bit #5 is 1 we update the accretion,
            We use #6 to indicate frozen cells:
            If bit #6 is 0 we assume the cell is not frozen,
            If bit #6 is 1 we assume the cell is frozen.
            We use #7 to indicate presence of gas.

        We load the Dendrite palette which shows states as white, red, or
        black depending as the high two bits are 10, 01, or anything else,
        respectively.


    */
    rule.worldtype = 1;
    rule.patreq = "dentim";
    rule.palreq = "dendrite";
    rule.randb = 1;
    rule.randn = 1;
    
    function dentim(oldstate,     nw, n  , ne,
                                  w, self, e,
                                  sw, s  , se) {
        var fPhase, newState = 0, direction, newSelf = 0, eightSum, swap;

        newState = (oldstate << 1) & 0xC; // Save two random bits
        newState = newState | (oldstate & 0xC0); // Show two colour bits
        fPhase = (oldstate & 0x60) >> 5;
            
        switch (fPhase) {

           case 0:
               //  Not frozen, update gas
               direction = ((oldstate & 0xE) >> 1);

               switch (direction) {
                 case 0:  newSelf = nw; break;
                 case 1:  newSelf = n; break;
                 case 2:  newSelf = ne; break;
                 case 3:  newSelf = e; break;
                 case 4:  newSelf = se; break;
                 case 5:  newSelf = s; break;
                 case 6:  newSelf = sw; break;
                 case 7:  newSelf = w; break;
               }

               newState = newState & 0x7F; // Turn off gas bit
               newState = newState | (newSelf << 7); // Set gas
               // Show a zero frozen bit
               newState = newState | 0x20; // Set phase to 1
               break;

           case 1:  //  Not frozen, update accrete
               eightSum = nw + n + ne + e + se + s + sw + w;
               if ((eightSum != 0) && ((oldstate & 0x80) != 0)) {
                   newState = 0x40; //  Frozen, phase zero, shown no gas
                } else {
                   newState = newState | ((oldstate & 0x80) >> 7); // Show gas bit
                }
                // Phase bit is already 0
                break;

            case 2:  // Frozen, update gas
                newState = 0x61; // Stay frozen, set phase to 1,show frozen
                break;

            case 3:  // Frozen, update accrete
               newState = 0x40;  // Stay frozen, set phase to zero,show no gas
               break;
        }
        return newState;
    }
