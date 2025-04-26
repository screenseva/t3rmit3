/*

        Wind tunnel skeleton rule
        
        No lookup table is used.

*/

class Wind extends ruletable {
    void jcruleModes() {
        setWorld(12);                   // User evaluator, open world
        setOwnCodeRequest("cfd");       // User evaluator function
        setPatternRequest("wind");
        setPaletteRequest("wind");
    }

    int jcrule(int oldstate) {
        return 0;               // No lookup table
    }
}

public class wind {
    public static void main(String args[]) {
        (new Wind()).generateRuleFile("wind");
    }
}
