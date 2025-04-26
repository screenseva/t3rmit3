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

  There is a collision, if there is a block has form   1 0   or 0 1
                                                       0 1      1 0.

  The blocks are rotated one notch CCW in phase A & one notch
  CW  in phase B, EXCEPT when a block has form   1 0   or 0 1
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

class Soot extends ruletable {
    static final int HPPlane = 4,     // Horizontal phase plane
                     HPNbits = 1,     // Horizontal phase plane count
                     VPPlane = 5,     // Vertical phase plane
                     VPNbits = 1,     // Vertical phase plane count
                     RSPlane = 1,     // Random seed plane
                     RSNbits = 1,     // Random seed bit count
                     TPPlane = 6,     // Temporal phase plane
                     TPNbits = 2;     // Temporal phase plane count

    void jcruleModes() {
        // We use the "Perfume" palette which shows bits 1 and 2 only
        setPaletteRequest("perfume");
        // The starting SloGro pattern is a single wall cell in plane 2
        setPatternRequest("soot");

        /*  We set a horizontal pattern of alternate 0s and 1s in bit 4
            and a vertical pattern of alternate 0s and 1s in bit 5.
            This produces a pattern that goes 0 1 0 1 ..
                                              2 3 2 3 ..
                                              0 1 0 1 ..
                                              2 3 2 3 ..
                                              : : : :     */

        setTextureHorizontal(HPPlane, HPNbits);
        setTextureVertical(VPPlane, VPNbits);
        setInitialRandomSeed(RSPlane, RSNbits, 80);
        setTemporalPhase(TPPlane, TPNbits);
    }

    static final boolean B(int i) {
        return i != 0;
    }

    int jcrule(int oldstate) {
        boolean Collision;
        int Cycle, NewCycle, Position, Wall, Gas, NewGas = 0,
            NewSelf = 0, r;

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
    }
}

public class soot {
    public static void main(String args[]) {
        (new Soot()).generateRuleFile("soot");
    }
}
