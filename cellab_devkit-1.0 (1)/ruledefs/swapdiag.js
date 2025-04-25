    /*
            
        This is SWAP-ON-DIAG rule from Toffoli & Margolus,
        figure 12.2, p. 121.
        
        We use the horizontal and vertical textures to set up a
        lattice of position values that looks like this:

                        0 1 0 1 ..
                        2 3 2 3 ..
                        0 1 0 1 ..
                        2 3 2 3 ..
                        : : : :

        This lattice is alternately chunked into

               A blocks 0 1   and  B blocks 3 2
                        2 3                 1 0

            We use the eight bits of state as follows:

            Bit   #0 is the gas
            Bits  #4 and #5 hold a position number between 0 & 3, composed of
                    Bit #4:  Horizontal texture
                    Bit #5:  Vertical texture
            Bit   #6 is the temporal phase:
                    0: Lattice A
                    1: Lattice B
    */

    rule.worldtype = 1;          // 2D torus world
    rule.patreq = "bigant";
    rule.palreq = "mask1";
                
    rule.texthb = 4;            // Horizontal texture
    rule.texthn = 1;
    
    rule.textvb = 5;            // Vertical texture
    rule.textvn = 1;

    rule.tempb = 6;             // Temporal phase
    rule.tempn = 1;

    function swapdiag(oldstate,     nw, n  , ne,
                                    w, self, e,
                                    sw, s  , se) {

        var NewSelf = OPP();
        
        // Merge texture and phase with new state
        return TPUPD(BF(HPHASE(), rule.texthb) |
                     BF(VPHASE(), rule.textvb) | NewSelf);
        
        /*  Define Margolus neighbourhood relative neighbours
        
            Recall that the lattice is grouped into
            blocks depending upon TPHASE() as follows:
            
               A blocks 0 1   and  B blocks 3 2
                        2 3                 1 0
                        
            These functions take the TPHASE() (temporal phase)
            and HVPHASE() (horizontal and vertical phase) into
            account and return the cell in the relationship to
            the current call according to their settings.
        */
        
        //  State of clockwise cell
        function CW() {
            switch (HVPHASE()) {
                case 0:
                    return TPHASE() ? w : e;
                case 1:
                    return TPHASE() ? n : s;
                case 2:
                    return TPHASE() ? s : n;
                case 3:
                    return TPHASE() ? e : w;
            }
        }
        
        //  State of counter-clockwise cell
        function CCW() {
            switch (HVPHASE()) {
                case 0:
                    return TPHASE() ? n : s;
                case 1:
                    return TPHASE() ? e : w;
                case 2:
                    return TPHASE() ? w : e;
                case 3:
                    return TPHASE() ? s : n;
            }
        }
               
        //  State of opposite cell
        function OPP() {
            switch (HVPHASE()) {
                case 0:
                    return TPHASE() ? nw : se;
                case 1:
                    return TPHASE() ? ne : sw;
                case 2:
                    return TPHASE() ? sw : ne;
                case 3:
                    return TPHASE() ? se : nw;
            }
        }
        
        //  State of centre cell
        function CENTER() {
            return self;
        }
        
        //  Utility functions for manipulating bit and bit fields
                    
        //  Return bit set for plane
        function BIT(p) {
            return 1 << p;
        }
        
        //  Test if bit p is set in oldstate
        function BITSET(p) {
            return (oldstate & BIT(p)) != 0;
        }
        
        /*  Extract field of n bits starting at b from oldstate.
            If n is omitted, a single bit field will be returned.  */
        function BITFIELD(p, n) {
            if (n !== null) {
                return (oldstate & BITMASK(p, n)) >> p;
            }
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
            return BITFIELD(rule.texthb, rule.texthn);
        }

        //  Return vertical phase of oldstate
        function VPHASE() {
            return BITFIELD(rule.textvb, rule.textvn);
        }

        //  Return horizontal and vertical phase together, vertical most sig.
        function HVPHASE() {
            return (VPHASE() << rule.texthn) | HPHASE();
        }

        //  Return temporal phase of oldstate
        function TPHASE() {
            return BITFIELD(rule.tempb, rule.tempn);
        }
        
        //  Update temporal phase in state x
        function TPUPD(x) {
            return (x & (~(BITMASK(rule.tempb, rule.tempn)))) |
                BF(((TPHASE() + 1) & BITMASK(0, rule.tempn)), rule.tempb);
        }
    }
