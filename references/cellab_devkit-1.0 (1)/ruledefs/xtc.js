    /*

        This rule implements two independent copies of TGas
        (TMGas) at the same time, producing two interpenetrating
        gases.  XGas moves along diagonals, hence the new name,
        and TGas moves horizontally and vertically.  We set up a
        lattice of position values that looks like this:

                               0 1 0 1 ..
                               2 3 2 3 ..
                               0 1 0 1 ..
                               2 3 2 3 ..
                               : : : :

        This lattice is alternately chunked into
             A blocks 0 1   and  B blocks 3 2
                      2 3                 1 0

        For TM TGas,the blocks are rotated one notch CCW in
        phase A & one notch CW in phase B, EXCEPT when a block
        has form:
            1 0   or 0 1
            0 1      1 0
        which is the Collision case. In the collision case,
        block stays same. For HPP XGas:
            if (Collision) { NewSelf = CW; } else { NewSelf = OPP; }

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
    /* The starting XTC pattern is an X of X gas, a T of T gas, and
       a C of both gasses.  */
    rule.patreq = "xtc";
    // The xtc.jcc palette only depends on bits 1 and 2
    rule.palreq = "xtc";
                
    rule.texthb = 4;            // Horizontal texture
    rule.texthn = 1;
    
    rule.textvb = 5;            // Vertical texture
    rule.textvn = 1;

    rule.tempb = 6;             // Temporal phase
    rule.tempn = 2;

    function xtc(oldstate,     nw, n  , ne,
                               w, self, e,
                               sw, s  , se) {
        var Collision;
        var Cycle, NewCycle, Position, XGas, TGas,
            NewSelf = 0, NewState, r;

        Cycle = TPHASE();
        Position = HVPHASE();

        /* For all the gas updates we simply calculate NewSelf
           and worry about where to store them below. */

        switch (Cycle) {
            case 0:                   // TGas A.  Rotate CCW if no collision
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

            /* For XGas, In both A and B do
                if (Collision) { NewSelf = CE; } else { NewSelf = OPP; } */

            case 2:                   /* Xgas lattice A
                                         Block has form 0 1
                                                        2 3 */
                switch (Position) {
                    case 0:
                        Collision = (self == se) && (e == s);
                        if (Collision) {
                            NewSelf = e;
                        } else {
                            NewSelf = se;
                        }
                        break;

                    case 1:
                        Collision = (self == sw) && (w == s);
                        if (Collision) {
                            NewSelf = s;
                        } else {
                            NewSelf = sw;
                        }
                        break;

                    case 2:
                        Collision = (self == ne) && (e == n);
                        if (Collision) {
                            NewSelf = n;
                        } else {
                            NewSelf = ne;
                        }
                        break;

                    case 3:
                        Collision = (self == nw) && (w == n);
                        if (Collision) {
                            NewSelf = w;
                        } else {
                            NewSelf = nw;
                        }
                        break;
                }
                break;

            /* For XGas, In both A and B do
                if (Collision) { NewSelf = CE; } else { NewSelf = OPP; } */

            case 3:                   /* Xgas lattice B
                                         Block has form 3 2
                                                        1 0 */
                switch (Position) {
                    case 0:
                        Collision = (self == nw) && (w == n);
                        if (Collision) {
                            NewSelf = w;
                        } else {
                            NewSelf = nw;
                        }
                        break;

                    case 1:
                        Collision = (self == ne) && (e == n);
                        if (Collision) {
                            NewSelf = n;
                        } else {
                            NewSelf = ne;
                        }
                        break;

                    case 2:
                        Collision = (self == sw) && (w == s);
                        if (Collision) {
                            NewSelf = s;
                        } else {
                            NewSelf = sw;
                        }
                        break;

                    case 3:
                        Collision = (self == se) && (e == s);
                        if (Collision) {
                            NewSelf = e;
                        } else {
                            NewSelf = se;
                        }
                        break;
                }
                break;

        }

        TGas = BITFIELD(1);
        XGas = BITFIELD(2);
        NewCycle = (Cycle + 1) & 3;
        // This is just the easy stuff
        NewState = BF(NewCycle, 6) | BF(Position, 4); 
        r = NewState;
        switch (Cycle) {
            case 0: // TGas was updated.  Make TGas visible for next
                r |= BF(XGas, 2) | BF(NewSelf, 1) | NewSelf;
                break;

            case 1: // TGas was updated.  Make XGas visible for next
                r |= BF(XGas, 2) | BF(NewSelf, 1) | XGas;
                break;

            case 2: // X Gas was updated.  Make X visible for next
                r |= BF(NewSelf, 2) | BF(TGas, 1) | NewSelf;
                break;

            case 3: // X Gas was updated.  Make T visible for next
                r |= BF(NewSelf, 2) | BF(TGas, 1) | TGas;
                break;
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
            return i ? 1 : 0;
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
