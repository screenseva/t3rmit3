    /*

        This rule implements two independent copies of TGas (TMGas) at the
        same time, producing two interpenetrating gases.  See xtc.java for
        more about TGas.  The point of this rule is to show a "sound
        wave".

            We use the eight bits of state as follows:

            Bit   #0 is the machine visible bit for update
            Bit   #1 is T gas (vertical/horizontal)
            Bit   #2 is X gas (diagonal)
            Bit   #3 is reserved for a self-erasing startup mask
            Bits  #4 and #5 hold a position number between 0 & 3
            Bit   #6 and #7 control the cycle.
                  In cycle 0 we update the T gas in lattice A.
                  In cycle 1 we update the T gas in lattice B.
                  In cycle 2 we update the X gas in lattice A.
                  In cycle 3 we update the X gas in lattice B.

    */

    rule.worldtype = 1;          // 2D torus world
    /* The starting pond pattern is a hole marked by 1s in plane 3
       This nukes out a hole in the start gas at first cycle and
       disappears.  I do such contortions to make pond.cap small. */
    rule.patreq = "pond";
    // The pond palette shows white iff bit 1 AND 2 are on
    rule.palreq = "pond";
    
    rule.rseedb = 0;            // Initial random seed (3 low order bits)
    rule.rseedn = 3;
            
    rule.texthb = 4;            // Horizontal texture
    rule.texthn = 1;
    
    rule.textvb = 5;            // Vertical texture
    rule.textvn = 1;

    rule.tempb = 6;             // Temporal phase
    rule.tempn = 2;

    function pond(oldstate,     nw, n  , ne,
                                w, self, e,
                                sw, s  , se) {
        var Collision;
        var Cycle, NewCycle, Position, Hole, TGas1, TGas0,
            NewSelf = 0, NewState, r;

        Cycle = TPHASE();
        Position = HVPHASE();

        /* For all the gas updates we simply calculate NewSelf
           and worry about where to store them below. */

        switch (Cycle) {
            case 0:                   // TGas A.  Rotate CCW if no collision
            case 2:
                switch (Position) {

                    case 0:
                        Collision = (self == se) && (e == s);
                        if (!Collision) {
                            NewSelf = e;
                        } else {
                            NewSelf = self;
                        }
                        break;

                    case 1:
                        Collision = (self == sw) && (w == s);
                        if (!Collision) {
                            NewSelf = s;
                        } else {
                            NewSelf = self;
                        }
                        break;

                    case 2:
                        Collision = (self == ne) && (e == n);
                        if (!Collision) {
                            NewSelf = n;
                        } else {
                            NewSelf = self;
                        }
                        break;

                    case 3:
                        Collision = (self == nw) && (w == n);
                        if (!Collision) {
                            NewSelf = w;
                        } else {
                            NewSelf = self;
                        }
                        break;
                }
                break;

            case 1:                   // TGas B.  Rotate CW if no collision
            case 3:
                switch (Position) {
                    case 0:
                        Collision = (self == nw) && (w == n);
                        if (!Collision) {
                            NewSelf = n;
                        } else {
                            NewSelf = self;
                        }
                        break;

                    case 1:
                        Collision = (self == ne) && (e == n);
                        if (!Collision) {
                            NewSelf = e;
                        } else {
                            NewSelf = self;
                        }
                        break;

                    case 2:
                        Collision = (self == sw) && (w == s);
                        if (!Collision) {
                            NewSelf = w;
                        } else {
                            NewSelf = self;
                        }
                        break;

                    case 3:
                        Collision = (self == se) && (e == s);
                        if (!Collision) {
                            NewSelf = s;
                        } else {
                            NewSelf = self;
                        }
                        break;
                }
                break;
        }

        TGas0 = BITFIELD(1);
        TGas1 = BITFIELD(2);
        Hole = BITFIELD(3);
        NewCycle = (Cycle + 1) & 3;
        // This is just the easy stuff
        NewState = BF(NewCycle, 6) | BF(Position, 4); 
        if (Hole == 1) {
            r = NewState | 7;
        } else {
            r = NewState;
            switch (Cycle) {
                case 0: // TGas0 was updated.  Make TGas0 visible for next
                    r |= BF(TGas1, 2) | BF(NewSelf, 1) | NewSelf;
                    break;

                case 1: // TGas0 was updated.  Make TGas1 visible for next
                    r |= BF(TGas1, 2) | BF(NewSelf, 1) | TGas1;
                    break;

                case 2: // X Gas was updated.  Make X visible for next
                    r |= BF(NewSelf, 2) | BF(TGas0, 1) | NewSelf;
                    break;

                case 3: // X Gas was updated.  Make T visible for next
                    r |= BF(NewSelf, 2) | BF(TGas0, 1) | TGas0;
                    break;
            }
        }
        return r;
                    
        //  Return bit set for plane
        function BIT(p) {
            return 1 << p;
        }
        
        //  Test if bit p is set in oldstate
        function BITSET(p) {
            return (oldstate & BIT(p)) != 0;
        }
        
        //  Extract bit from oldstate
        function BITFIELD(p) {
            return B(BITSET(p));
        }
        
        /*  Mask for N contiguous bits with low order bit in plane P.  Note
            how this definition craftily generates masks of zero when a
            zero bit field is specified.  */
        function BITMASK(p, n) {
            return BIT(p + n) - BIT(p);
        }
        
        //  Test value nonzero
        function B(i) {
            return i != 0;
        }
        
        //  Place a value in a specified bit field
        function BF(v, p) {
            return v << p;
        }
                
        //  Return horizontal phase of oldstate
        function HPHASE() {
            return (oldstate >> rule.texthb) & BITMASK(0, rule.texthn);
        }

        //  Return vertical phase of oldstate
        function VPHASE() {
            return (oldstate >> rule.textvb) & BITMASK(0, rule.textvn);
        }

        //  Return horizontal and vertical phase together, vertical most sig.
        function HVPHASE() {
            return (VPHASE() << rule.texthn) | HPHASE();
        }

        //  Return temporal phase of oldstate
        function TPHASE() {
            return (oldstate >> rule.tempb) & BITMASK(0, rule.tempn);
        }
    }
