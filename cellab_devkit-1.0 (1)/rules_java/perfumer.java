/*

    Diffusion of a random gas

    No lookup table is used.

*/

class Perfumer extends ruletable {
    void jcruleModes() {
        setWorld(13);                   // Own code, torus world
        setOwnCodeRequest("gaswall");   // User own code function
        setPatternRequest("perfume");
        setPaletteRequest("perfume");
    }

    int jcrule(int oldstate) {
        return 0;               // No lookup table
    }
}

public class perfumer {
    public static void main(String args[]) {
        (new Perfumer()).generateRuleFile("perfumer");
    }
}
