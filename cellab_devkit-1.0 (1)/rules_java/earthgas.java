/*

    Dummy rule definition to invoke user-supplied own code.
    No lookup table is used.

*/

class Earthgas extends ruletable {
    void jcruleModes() {
        setWorld(13);           // Own code, torus world
        setPatternRequest("fullearth");
        setPaletteRequest("fullearth");
        setOwnCodeRequest("randgas");  // User own code function
    }

    int jcrule(int oldstate) {
        return 0;               // No lookup table
    }
}

public class earthgas {
    public static void main(String args[]) {
        (new Earthgas()).generateRuleFile("earthgas");
    }
}
