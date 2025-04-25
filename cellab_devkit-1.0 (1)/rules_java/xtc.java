/*

    This rule implements two independent copies of TGas (TMGas) at the
    same time, producing two interpenetrating gases.  XGas moves along
    diagonals, hence the new name, and TGas moves horizontally and
    vertically.  We set up a lattice of position values that looks
    like this:

                           0 1 0 1 ..
                           2 3 2 3 ..
                           0 1 0 1 ..
                           2 3 2 3 ..
                           : : : :

    This lattice is alternately chunked into
         A blocks 0 1   and  B blocks 3 2
                  2 3                 1 0

    For TM TGas,the blocks are rotated one notch CCW in phase A & one notch
    CW in phase B, EXCEPT when a block has form   1 0   or 0 1
                                                  0 1      1 0
    which is the Collision case. In the collision case, block stays same.
    For HPP XGas: if (Collision) { NewSelf = CW; } else { NewSelf = OPP; }

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

class Xtc extends ruletable {
    static final int HPPlane = 4,     // Horizontal phase plane
                     HPNbits = 1,     // Horizontal phase plane count
                     VPPlane = 5,     // Vertical phase plane
                     VPNbits = 1,     // Vertical phase plane count
                     TPPlane = 6,     // Temporal phase plane
                     TPNbits = 2;     // Temporal phase plane count

    void jcruleModes() {
        // The XTC.JCC palette only depends on bits 1 and 2
        setPaletteRequest("xtc");
        /* The starting XTC pattern is an X of X gas, a T of T gas, and
           a C of both gasses.  */
        setPatternRequest("xtc");

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

    int jcrule(int oldstate) {
        boolean Collision;
        int Cycle, NewCycle, Position, XGas, TGas,
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
    }
}

public class xtc {
    public static void main(String args[]) {
        (new Xtc()).generateRuleFile("xtc");
    }
}
