/*

    Gas flow with biased random motion and impermeable
    barriers.  Particle number is conserved.

    This is used only to set the world type and initial random
    seed, then load the pattern, palette, and evaluator.

    No lookup table is used.

*/

class Gasflow extends ruletable {
    void jcruleModes() {
        setWorld(13);                   // User evaluator, torus world
        setOwnCodeRequest("gasflow");   // User evaluator function
        setPatternRequest("gasflow");
        setPaletteRequest("gasflow");
        setInitialRandomSeed(0, 1, 40); // Random seed in plane 0
    }

    int jcrule(int oldstate) {
        return 0;               // No lookup table
    }
}

public class gasflow {
    public static void main(String args[]) {
        (new Gasflow()).generateRuleFile("gasflow");
    }
}
