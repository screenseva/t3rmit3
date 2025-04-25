/*

    Skeleton rule for Glooper.  This is used only to set the
    world type and load the pattern, palette, and evaluator.

    No lookup table is used.

*/

class Glooper extends ruletable {
    void jcruleModes() {
        setWorld(12);                   // User evaluator, open world
        setOwnCodeRequest("water");     // User evaluator function
        setPatternRequest("glooper");
        setPaletteRequest("glooper");
    }

    int jcrule(int oldstate) {
        return 0;               // No lookup table
    }
}

public class glooper {
    public static void main(String args[]) {
        (new Glooper()).generateRuleFile("glooper");
    }
}
