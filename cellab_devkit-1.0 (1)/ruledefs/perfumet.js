    /*

            Diffusion of a lattice gas

            This rule implements the Margolus rule for
            simulating an HPP-gas of particles bouncing off each
            other.  No external noise is used.  Particles are
            regarded as travelling horizontally or vertically. 
            We set up a lattice of position values that looks
            like this:

                     0 1 0 1 ..
                     2 3 2 3 ..
                     0 1 0 1 ..
                     2 3 2 3 ..
                     : : : :

            This lattice is alternately chunked into:

                A blocks: 0 1   and   B blocks: 3 2
                          2 3                   1 0

            and each cell is swapped with is diagonally opposite cell,
            except when there is a collision, if that is a block has form:

               1 0   or 0 1
               0 1      1 0.

            The blocks are rotated one notch CCW in phase A & one notch
            CW in phase B, EXCEPT when a block has form:
                1 0   or 0 1
                0 1      1 0
            which is the Collision case. In the collision case, the block
            stays the same.

            We use the eight bits of state as follows:

            Bit   #0 is the machine visible bit for update
            Bit   #1 is used for the gas
            Bit   #2 is the wall
            Bit   #3 is the touch wall in my neighborhood bit
            Bits  #4 and #5 hold a position number between 0 & 3
            Bit   #6 controls the check wall/do gas cycle
            Bit   #7 controls the A/B lattice cycle
    */

    rule.worldtype = 1;          // 2D torus world
    rule.patreq = "perfume";
    rule.palreq = "perfume";
            
    rule.texthb = 4;            // Horizontal texture
    rule.texthn = 1;
    
    rule.textvb = 5;            // Vertical texture
    rule.textvn = 1;

    rule.tempb = 6;             // Temporal phase
    rule.tempn = 2;

    function perfumet(oldstate,     nw, n  , ne,
                                    w, self, e,
                                    sw, s  , se) {

        var touchwall, newtouchwall = false,
            wall, gas, newgas = false, newself = false;


        touchwall = BITSET(3);             /* Touching a wall */
        wall = BITSET(2);                  /* This is a wall */
        gas = BITSET(1);                   /* Gas particle here */

        switch (TPHASE()) {

           /* In both cycle0 / LatticeA and cycle1 / LatticeB do
              if collision then newself = CW else newself = OPP */

           case 0:

              /* Set touch wall if any neighbor is on

                 Block has form 0 1
                                2 3 */

              switch (HVPHASE()) {
                 case 0:
                    newtouchwall = B(self + e + se + s);
                    break;

                 case 1:
                    newtouchwall = B(self + s + sw + w);
                    break;

                 case 2:
                    newtouchwall = B(self + n + ne + e);
                    break;

                 case 3:
                    newtouchwall = B(self + w + nw + n);
                    break;
               }
               newgas = newself = gas;
               break;

           case 1:

           /* TGas A.  Move gas unless collision or touching a wall

              Block has form 0 1
                             2 3 */

              switch (HVPHASE()) {
                 case 0:
                    newgas = !(((self == se) && (e == s)) || touchwall) ?
                       B(e) : B(self);
                    break;

                 case 1:
                    newgas = !(((self == sw) && (w == s)) || touchwall) ?
                       B(s) : B(self);
                    break;

                 case 2:
                    newgas = !(((self == ne) && (e == n)) || touchwall) ?
                       B(n) : B(self);
                    break;

                 case 3:
                    newgas = !(((self == nw) && (w == n)) || touchwall) ?
                       B(w) : B(self);
                    break;
               }
               newtouchwall = touchwall;
               newself = wall;
               break;

           case 2:

             /* Set touch wall if any neighbor is on

                Block has form 3 2
                               1 0 */

              switch (HVPHASE()) {
                 case 0:
                    newtouchwall = B(self + w + nw + n);
                    break;

                 case 1:
                    newtouchwall = B(self + n + ne + e);
                    break;

                 case 2:
                    newtouchwall = B(self + s + sw + w);
                    break;

                 case 3:
                    newtouchwall = B(self + e + se + s);
                    break;
              }
              newgas = newself = gas;
              break;

           case 3:

           /* If collision newself = CW else newself = OPP

              Block has form 3 2
                             1 0 */

              switch (HVPHASE()) {
                 case 0:
                    newgas = !(((self == nw) && (w == n)) || touchwall) ?
                       B(n) : B(self);
                    break;

                 case 1:
                    newgas = !(((self == ne) && (e == n)) || touchwall) ?
                       B(e) : B(self);
                    break;

                 case 2:
                    newgas = !(((self == sw) && (w == s)) || touchwall) ?
                       B(w) : B(self);
                    break;

                 case 3:
                    newgas = !(((self == se) && (e == s)) || touchwall) ?
                       B(s) : B(self);
                    break;
              }
              newtouchwall = touchwall;
              newself = wall;
              break;
        }

        return TPUPD(BF(HVPHASE(), rule.texthb) |
                     BFB(newtouchwall, 3) |
                     BFB(wall, 2) |
                     BFB(newgas,1) |
                     (newself ? 1 : 0));
                     
        //  Return bit set for plane
        function BIT(p) {
            return 1 << p;
        }
        
        //  Test if bit p is set in oldstate
        function BITSET(p) {
            return (oldstate & BIT(p)) != 0;
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
        
        //  Place a Boolean in a specified bit field
        function BFB(v, p) {
            return (v ? 1 : 0) << p;
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
