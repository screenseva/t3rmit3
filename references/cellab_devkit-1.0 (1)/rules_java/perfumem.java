    /*

        This is HPP-GAS/WALLS rule from Toffoli & Margolus,
        discussed (but not given explicitly) in section 15.2, p.
        159.

        This version uses the "margolus" evaluator, which
        does all of the spatial and temporal phase for us,
        allowing us to use the logical relative neighbours.

    */

class Perfumem extends ruletable {

    void jcruleModes() {
        setWorld(13);
        setPatternRequest("perfumem");
        setPaletteRequest("perfumem");
        setOwnCodeRequest("margolus");
    }

    static final boolean B(int i) {
        return i != 0;
    }

    int jcrule(int oldstate) {
        boolean wall, collision;

        wall = B(CENTERp | CWp | OPPp | CCWp);
        collision = (CENTER == OPP) &&
                    (CW == CCW) &&
                    (CENTER != CW);
                    
        return (wall ? CENTER :
                       (collision ? CW : OPP)) | (CENTERp << 1);
    }

}

public class perfumem {
    public static void main(String args[]) {
        (new Perfumem()).generateRuleFile("perfumem");
    }
}
