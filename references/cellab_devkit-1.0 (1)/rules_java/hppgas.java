/*

      This rule implements the Margolus rule for simulating a gas of
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

        and each cell is swapped with is diagonally opposite cell, except
        when there is a collision, if that is a block has form   1 0   or 0 1
                                                                 0 1      1 0.
        When there is a collision the block is rotated one notch CCW.


        We use the eight bits of state as follows:

        Bit   #0 is the machine visible bit for update
        Bit   #1 is used for the gas
        Bit   #2 is reserved for second gas color
        Bit   #3 reserved for signalling container walls
        Bits  #4 and #5 hold a position number between 0 & 3
        Bit   #6 is reserved to control a second gas color
        Bit   #7 controls the A/B lattice cycle

*/

class Hppgas extends ruletable {
    static final int HPPlane = 4,     // Horizontal phase plane
                     HPNbits = 1,     // Horizontal phase plane count
                     VPPlane = 5,     // Vertical phase plane
                     VPNbits = 1;     // Vertical phase plane count

    void jcruleModes() {
        // The mask2.jcc palette only shows bit 1 (hex mask 2)
        setPaletteRequest("mask2");
        /* The starting Gas pattern is some geometric objects
        setPatternRequest("pond");

        /*  We set a horizontal pattern of alternate 0s and 1s in bit 4
            and a vertical pattern of alternate 0s and 1s in bit 5.
            This produces a pattern that goes 0 1 0 1 ..
                                              2 3 2 3 ..
                                              0 1 0 1 ..
                                              2 3 2 3 ..
                                              : : : :     */

        setTextureHorizontal(HPPlane, HPNbits);
        setTextureVertical(VPPlane, VPNbits);
    }

    int jcrule(int oldstate) {
        boolean Collision;
        int Cycle, NewCycle, Position, NewSelf;

        Cycle = BITFIELD(7);
        Position = HVPHASE();
        NewCycle = Cycle ^ 1;
        NewSelf = self;

        /* For all the gas updates we simply calculate NewSelf
           and worry about where to store them below.

           In both Cycle0/LatticeA and Cycle1/LatticeB do
           if (Collision) { NewSelf = CW; } else { NewSelf = OPP; }
        */

        switch (Cycle) {
            case 0:                   /* Block has the form 0 1
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

            case 1:                   /* Block has the form 0 1
                                                            2 3 */
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
        return BF(NewCycle, 7) | BF(Position, 4) | BF(NewSelf, 1) | NewSelf;
    }
}

public class hppgas {
    public static void main(String args[]) {
        (new Hppgas()).generateRuleFile("hppgas");
    }
}
