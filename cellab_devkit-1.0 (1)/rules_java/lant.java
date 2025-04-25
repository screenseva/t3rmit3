    /*
                Langton's Ant

            Bit plane assignments:

                0:      Ant is present in cell
                1-2:    Ant direction
                            0   North
                            1   East
                            2   West
                            3   South
                3:      Cell state
                            0   White
                            1   Black

        We use the vonn3 evaluator, which provides us the
        states of our von Neumann neighbours in oldstate as:

            C C C C N N N W   W W E E E S S S

        References:
            http://mathworld.wolfram.com/LangtonsAnt.html
            https://en.wikipedia.org/wiki/Langton's_ant

    */

class Lant extends ruletable {

    // Cardinal points and self
    private final static int N = 0, E = 1, W = 2, S = 3, SELF = 4;

    // Shift count for neighbours, self
    private final static int[] nbr = { 9, 3, 6, 0, 12 };

    //  New direction based upon old direction + (state << 2)
    private final static int[] newdir = { E, S, N, W,
                                          W, N, S, E };

    private static int os;

    void jcruleModes() {
        setWorld(13);
        setPatternRequest("dot");
        setPaletteRequest("lant");
        setOwnCodeRequest("vonn3");
    }

    int jcrule(int oldstate) {
        os = oldstate;

        //  If ant is in this cell, flip its state and remove ant
        if (ant(SELF)) {
            return (state(SELF) ^ 1) << 3;
        }

        //  Does a neighbour contain an ant bound our way ?

        boolean newant = false;
        int olddir = 0;

        if (ant(N) && (direction(N) == S)) {
            newant = true;
            olddir = S;
        } else if (ant(E) && (direction(E) == W)) {
            newant = true;
            olddir = W;
        } else if (ant(S) && (direction(S) == N)) {
            newant = true;
            olddir = N;
        } else if (ant(W) && (direction(W) == E)) {
            newant = true;
            olddir = E;
        }

        if (newant) {
            /*  Neighbour contains inbound ant.  Set ant present
                here on next step and adjust the ant's direction
                based upon its old direction and our current
                state. */
            return 1 |
                   (newdir[olddir + (state(SELF) << 2)] << 1) |
                   (state(SELF) << 3);
        }

        //  No ant or inbound ant: state is unchanged
        return state(SELF) << 3;
    }

    //  Functions to inquire state of neighbours

    //  Ant in this neighbour ?
    private static final boolean ant(int neigh) {
        return ((os >> nbr[neigh]) & 1) != 0;
    }

    //  Direction of ant in this neighbour
    private static final int direction(int neigh) {
        return (os >> (nbr[neigh] + 1)) & 3;
    }

    //  State of this neighbour
    private static final int state(int neigh) {
        return (os >> (nbr[neigh] + 3)) & 1;
    }
}

public class lant {
    public static void main(String args[]) {
        (new Lant()).generateRuleFile("lant");
    }
}
