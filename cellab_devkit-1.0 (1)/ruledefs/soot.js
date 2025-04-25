    /*

        This rule uses the TGas Toffoli&Margolus rule for simulating
        particles bouncing off each other.  No external noise is used.
        Particles are regarded as travelling horizontally or vertically.
        We set up a lattice of position values that looks like this:

                      0 1 0 1 ..
                      2 3 2 3 ..
                      0 1 0 1 ..
                      2 3 2 3 ..
                      : : : :

      This lattice is alternately chunked into
             A blocks 0 1   and  B blocks 3 2
                      2 3                 1 0

      There is a collision, if there is a block has form:
        1 0   or 0 1
        0 1      1 0.

      The blocks are rotated one notch CCW in phase A & one notch
      CW in phase B, EXCEPT when a block has form:
        1 0   or 0 1
        0 1      1 0

      which is the Collision case. In the collision case, block stays same.

      The gas particles are allowed to accrete on "wall" cells.

      We use the eight bits of state as follows:

            Bit   #0 is the machine visible bit for update
            Bit   #1 is used for the gas
            Bit   #2 is the wall
            Bit   #3 is unused
            Bits  #4 & #5 hold a position number between 0 and 3
            Bits  #6 & #7 control the check wall/do gas cycle
                  If 0 do wall, if 1 do lattice A, if 2 do lattice B
    */

    rule.worldtype = 1;          // 2D torus world
    // The starting SloGro pattern is a single wall cell in plane 2
    rule.patreq = "soot";
    // We use the "perfume" palette which shows bits 1 and 2 only
    rule.palreq = "perfume";
    
    rule.rseedb = 1;            // Initial random seed (2 bit, 80 density)
    rule.rseedn = 1;
    rule.rseedp = 80;
            
    rule.texthb = 4;            // Horizontal texture
    rule.texthn = 1;
    
    rule.textvb = 5;            // Vertical texture
    rule.textvn = 1;

    rule.tempb = 6;             // Temporal phase
    rule.tempn = 2;

    function soot(oldstate,     nw, n  , ne,
                                w, self, e,
                                sw, s  , se) {
        var Collision;
        var Cycle, NewCycle, Position, Wall, Gas, NewGas = 0,
            NewSelf = 0, r;

        var SUM_8 = nw + n + ne + w + e + sw + s + se;
        Cycle = TPHASE();
        Position = HVPHASE();
        Wall = BITFIELD(2);
        Gas = BITFIELD(1);

        switch (Cycle) {
            case 0:     // Check if you are touching wall
                if (Gas == 1 && SUM_8 > 0) {
                    Gas = 0;
                    Wall = 1;
                }
                NewGas = Gas;
                NewSelf = Gas;
                NewCycle = 1;
                break;

            case 1:     /* TGas A.  Rotate CCW if no collision
                            Block has form 0 1
                                           2 3  */
                switch (Position) {
                    case 0:
                        Collision = (self == se) && (e == s);
                        if (!Collision) {
                            NewGas = e;
                        } else {
                            NewGas = self;
                        }
                        break;

                    case 1:
                        Collision = (self == sw) && (w == s);
                        if (!Collision) {
                            NewGas = s;
                        } else {
                            NewGas = self;
                        }
                        break;

                    case 2:
                        Collision = (self == ne) && (e == n);
                        if (!Collision) {
                            NewGas = n;
                        } else {
                            NewGas = self;
                        }
                        break;

                    case 3:
                        Collision = (self == nw) && (w == n);
                        if (!Collision) {
                            NewGas = w;
                        } else {
                            NewGas = self;
                        }
                        break;
                }
                NewSelf = Wall;
                NewCycle = 2;
                break;

            case 2:     // Check if you are touching wall
                if (Gas == 1 && SUM_8 > 0) {
                    Gas = 0;
                    Wall = 1;
                }
                NewGas = Gas;
                NewSelf = Gas;
                NewCycle = 3;
                break;

            case 3:     /* TGas A.  Rotate CW if no collision
                            Block has form 3 2
                                           1 0  */
                switch (Position) {
                    case 0:
                        Collision = (self == nw) && (w == n);
                        if (!Collision) {
                            NewGas = n;
                        } else {
                            NewGas = self;
                        }
                        break;

                    case 1:
                        Collision = (self == ne) && (e == n);
                        if (!Collision) {
                            NewGas = e;
                        } else {
                            NewGas = self;
                        }
                        break;

                    case 2:
                        Collision = (self == sw) && (w == s);
                        if (!Collision) {
                            NewGas = w;
                        } else {
                            NewGas = self;
                        }
                        break;

                    case 3:
                        Collision = (self == se) && (e == s);
                        if (!Collision) {
                            NewGas = s;
                        } else {
                            NewGas = self;
                        }
                        break;
                }
                NewSelf = Wall;
                NewCycle = 0;
                break;
        }

        return TPUPD(BF(Position, 4) | BF(Wall, 2) | BF(NewGas, 1) | NewSelf);
                    
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
        
        //  Update temporal phase in state x
        function TPUPD(x) {
            return (x & (~(BITMASK(rule.tempb, rule.tempn)))) |
                    (((TPHASE() + 1) & BITMASK(0, rule.tempn)) << rule.tempb);
        }
    }
