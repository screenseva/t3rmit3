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

class Pond extends ruletable {
    static final int HPPlane = 4,     // Horizontal phase plane
                     HPNbits = 1,     // Horizontal phase plane count
                     VPPlane = 5,     // Vertical phase plane
                     VPNbits = 1,     // Vertical phase plane count
                     RSPlane = 0,     // Random seed plane
                     RSNbits = 3,     // Random seed bit count
                     TPPlane = 6,     // Temporal phase plane
                     TPNbits = 2;     // Temporal phase plane count

    void jcruleModes() {
        // The Pond.CAC palette shows white iff bit 1 AND 2 are on
        setPaletteRequest("pond");
        /* The starting Pond pattern is a hole marked by 1s in plane 3
           This nukes out a hole in the start gas at first cycle and
           disappears.  I do such contortions to make Pond.CAP small. */
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
        setInitialRandomSeed(RSPlane, RSNbits);
        setTemporalPhase(TPPlane, TPNbits);
    }

    static final boolean B(int i) {
        return i != 0;
    }

    int jcrule(int oldstate) {
        boolean Collision;
        int Cycle, NewCycle, Position, Hole, TGas1, TGas0,
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
    }
}

public class pond {
    public static void main(String args[]) {
        (new Pond()).generateRuleFile("pond");
    }
}
