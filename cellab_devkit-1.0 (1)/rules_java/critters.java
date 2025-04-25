    /*

        This is the Critters rule from Toffoli & Margolus,
        discussed in section 12.8.2, p. 132.

        We use the trick from the "Critter-Cycle" rule
        on page 134, in conjunction with a specially
        contrived palette, to avoid the strobe effect
        which would otherwise occur due to the complementing
        of all states every generation.

        This version uses the "margolusp" evaluator, which
        does all of the spatial and temporal phase for us,
        allowing us to use the logical relative neighbours.

    */

class Critters extends ruletable {

    void jcruleModes() {
        setWorld(13);
        setPatternRequest("circle");
        setPaletteRequest("critters");
        setOwnCodeRequest("margolusp");
    }

    int jcrule(int oldstate) {
        int nc = 0;

        int nCENTER = CENTER ^ 1,
            nOPP = OPP ^ 1,
            TPHASE = BITFIELD(8);

        switch (CENTER + OPP + CW + CCW) {
            case 0:
            case 1:
                nc = nCENTER;
                break;

            case 2:
                nc = CENTER;
                break;

            case 3:
                nc = nOPP;
                break;

            case 4:
                nc = nCENTER;
                break;
        }

        return nc | (TPHASE << 1) | 4;
    }

}

public class critters {
    public static void main(String args[]) {
        (new Critters()).generateRuleFile("critters");
    }
}
