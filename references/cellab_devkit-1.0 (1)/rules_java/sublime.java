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

class Sublime extends ruletable {
    static final int HPPlane = 4,     // Horizontal phase plane
                     HPNbits = 1,     // Horizontal phase plane count
                     VPPlane = 5,     // Vertical phase plane
                     VPNbits = 1,     // Vertical phase plane count
                     RIPlane = 2,     // Random input plane
                     RINbits = 1,     // Random input bit count
                     RSPlane = 0,     // Random seed plane
                     RSNbits = 1,     // Random seed bit count
                     TPPlane = 6,     // Temporal phase plane
                     TPNbits = 2;     // Temporal phase plane count

    void jcruleModes() {
        setPatternRequest("sublime");
        setPaletteRequest("sublime");

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
        setRandomInput(RIPlane, RINbits);
        setTemporalPhase(TPPlane, TPNbits);
    }

    int jcrule(int oldstate) {
        int Cycle, Position, Direction, NewDirection = 0,
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
    }
}

public class sublime {
    public static void main(String args[]) {
        (new Sublime()).generateRuleFile("sublime");
    }
}
