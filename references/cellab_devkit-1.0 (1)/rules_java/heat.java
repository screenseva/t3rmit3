/*

    This is an eightcell averaging rule with zero increment.

    Odd states are frozen states and even states generate even states.
    One can reanimate the vacuum by re-randomising bitplanes 5 or 6.

*/

class Heat extends ruletable {
    void jcruleModes() {
        setWorld(10);
    }

    int jcrule(int oldstate) {
        int r = 0;

        if ((oldstate & 1) > 0) {
            if (oldstate < 16) {
                r = oldstate;
            } else {
                r = oldstate + 128;
            }
        } else {
            r = (SUM_8 >> 3) & 0xFE;
        }
        return r;
    }
}

public class heat {
    public static void main(String args[]) {
        (new Heat()).generateRuleFile("heat");
    }
}
