/*

        Diffusion of a lattice gas

        This rule implements the Margolus rule for simulating an
        HPP-gas of particles bouncing off each other.  No external
        noise is used.  Particles are regarded as travelling
        horizontally or vertically.  We set up a lattice of position
        values that looks like this:

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
        CW in phase B, EXCEPT when a block has form   1 0   or 0 1
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

class Perfumet extends ruletable {
    static final int HPPlane = 4,     // Horizontal phase plane
                     HPNbits = 1,     // Horizontal phase plane count
                     VPPlane = 5,     // Vertical phase plane
                     VPNbits = 1,     // Vertical phase plane count
                     TPPlane = 6,     // Temporal phase plane
                     TPNbits = 2;     // Temporal phase plane count

    void jcruleModes() {
        setPaletteRequest("perfume");
        setPatternRequest("perfume");

        /*  We set a horizontal pattern of alternate 0s and 1s in bit 4
            and a vertical pattern of alternate 0s and 1s in bit 5.
            This produces a pattern that goes 0 1 0 1 ..
                                              2 3 2 3 ..
                                              0 1 0 1 ..
                                              2 3 2 3 ..
                                              : : : :     */

        setTextureHorizontal(HPPlane, HPNbits);
        setTextureVertical(VPPlane, VPNbits);
        setTemporalPhase(TPPlane, TPNbits);
    }

    static final boolean B(int i) {
        return i != 0;
    }

    int jcrule(int oldstate) {
        boolean touchwall, newtouchwall = false,
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

        return TPUPD(BF(HVPHASE(), HPPlane) |
                     BF(newtouchwall, 3) |
                     BF(wall, 2) |
                     BF(newgas,1) |
                     (newself ? 1 : 0));
    }
}

public class perfumet {
    public static void main(String args[]) {
        (new Perfumet()).generateRuleFile("perfumet");
    }
}
