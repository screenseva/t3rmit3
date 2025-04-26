/*

    A one dimensional rule with two neighbors, and 4 bits of each
    neighbor visible.  This is run as a sixteen state rule, where
            NewC = (L + OldC + R)/3  +1.

*/

class Aurora extends ruletable {
    void jcruleModes() {
        setWorld(9);
        setPaletteRequest("aurora");
        setInitialRandomSeed(0, 4);
    }

    int jcrule(int oldstate) {
        return ((N2L1 + (oldstate & 15) + N2R1) / 3) + 1;
    }
}

public class aurora {
    public static void main(String args[]) {
        (new Aurora()).generateRuleFile("aurora");
    }
}
