/*

    Skeleton rule for Forest.  This is used only to set the
    world type and load the palette and evaluator.

    No lookup table is used.

*/

class Forest extends ruletable {
    void jcruleModes() {
        setWorld(13);                   // User evaluator, closed world
        setOwnCodeRequest("forest");    // User evaluator function
        setPatternRequest("zero");
        setPaletteRequest("forest");
    }

    int jcrule(int oldstate) {
        return 0;               // No lookup table
    }
}

public class forest {
    public static void main(String args[]) {
        (new Forest()).generateRuleFile("forest");
    }
}
