/*

        This rule implements the Margolus rule for simulating a gas of
        cells diffusing.  Particle number is conserved.  We set up a
        lattice of position values that looks like this:

                        0 1 0 1 ..
                        2 3 2 3 ..
                        0 1 0 1 ..
                        2 3 2 3 ..
                        : : : :

        This lattice is alternately chunked into

               A blocks 0 1   and  B blocks 3 2
                        2 3                 1 0

        and the blocks are randomly rotated one notch CW or one notch CCW.

        We use the eight bits of state as follows:

        Bit  #0 is used to show info to neighbors
        Bit  #1 is the gas bit
        Bit  #2 is fed by the system Noiseizer
        Bit  #3 stores the 4-cell consensus on direction 0 is CCW, 1 is CW
        Bits #4 & #5 hold a position numbers between 0 and 3
        Bits #6 & #7 control the cycle

*/

    rule.worldtype = 1;          // 2D torus world
    rule.patreq = "sublime";
    rule.palreq = "sublime";
    
    rule.randb = 2;             // Random input
    rule.randn = 1;
    
    rule.rseedb = 0;            // Initial random seed
    rule.rseedn = 1;

    /*  We set a horizontal pattern of alternate 0s and 1s in bit 4
        and a vertical pattern of alternate 0s and 1s in bit 5.
        This produces a pattern that goes 0 1 0 1 ..
                                          2 3 2 3 ..
                                          0 1 0 1 ..
                                          2 3 2 3 ..
                                          : : : :     */
            
    rule.texthb = 4;            // Horizontal texture
    rule.texthn = 1;
    
    rule.textvb = 5;            // Vertical texture
    rule.textvn = 1;

    rule.tempb = 6;             // Temporal phase
    rule.tempn = 2;

    function sublime(oldstate,     nw, n  , ne,
                                   w, self, e,
                                   sw, s  , se) {
        var Cycle, Position, Direction, NewDirection = 0,
            Noise, Gas, NewGas = 0, r = 0;

        Cycle = TPHASE();
        Position = HVPHASE();
        Direction = BITFIELD(3);
        Noise = BITFIELD(2);
        Gas = BITFIELD(1);

        switch (Cycle) {
            case 0:                   // In A block mode set direction to NW's
                switch (Position) {
                    case 0:
                        NewDirection = self;
                        break;

                    case 1:
                        NewDirection = w;
                        break;

                    case 2:
                        NewDirection = n;
                        break;

                    case 3:
                        NewDirection = nw;
                        break;
                }
                r = TPUPD(BF(Position, 4) | BF(NewDirection, 3) |
                          BF(Gas, 1) | Gas);
                break;

            case 2:                   // In B block mode set direction to NW's
                switch (Position) {
                    case 0:
                        NewDirection = nw;
                        break;

                    case 1:
                        NewDirection = n;
                        break;

                    case 2:
                        NewDirection = w;
                        break;

                    case 3:
                        NewDirection = self;
                        break;
                }
                r = TPUPD(BF(Position, 4) | BF(NewDirection, 3) |
                          BF(Gas, 1) | Gas);
                break;

            case 1:
                switch (Direction) {
                    case 0:           // CCW rotation of an A block
                        switch (Position) {
                            case 0:
                                NewGas = e;
                                break;
                            case 1:
                                NewGas = s;
                                break;
                            case 2:
                                NewGas = n;
                                break;
                            case 3:
                                NewGas = w;
                                break;
                        }
                        break;

                    case 1:           // CW rotation of an A block
                        switch (Position) {
                            case 0:
                                NewGas = s;
                                break;
                            case 1:
                                NewGas = w;
                                break;
                            case 2:
                                NewGas = e;
                                break;
                            case 3:
                                NewGas = n;
                                break;
                        }
                        break;
                }
                r = TPUPD(BF(Position, 4) | BF(Direction, 3) |
                          BF(NewGas, 1) | Noise);
                break;

            case 3:
                switch (Direction) {
                    case 0:           // CCW rotation of a B block
                        switch (Position) {
                            case 0:
                                NewGas = w;
                                break;
                            case 1:
                                NewGas = n;
                                break;
                            case 2:
                                NewGas = s;
                                break;
                            case 3:
                                NewGas = e;
                                break;
                        }
                        break;

                    case 1:           // CW rotation of a B block
                        switch (Position) {
                            case 0:
                                NewGas = n;
                                break;
                            case 1:
                                NewGas = e;
                                break;
                            case 2:
                                NewGas = w;
                                break;
                            case 3:
                                NewGas = s;
                                break;
                        }
                        break;
                }
                r = TPUPD(BF(Position, 4) | BF(Direction, 3) |
                          BF(NewGas, 1) | Noise);
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
        
        //  Update temporal phase in state x
        function TPUPD(x) {
            return (x & (~(BITMASK(rule.tempb, rule.tempn)))) |
                    (((TPHASE() + 1) & BITMASK(0, rule.tempn)) << rule.tempb);
        }
    }
