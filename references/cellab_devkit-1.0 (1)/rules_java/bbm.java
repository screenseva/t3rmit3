    /*

        This is the BBM rule from Toffoli & Margolus, discussed
        in section 18.2, p. 214.

        The rule is trivially modified to preserve bits
        1-7 of the current cell's state.  This allows drawing
        cells in any odd state, which can be used to distinguish
        individual cells by colour for explanatory purposes.

        This version uses the "margolus" evaluator, which
        does all of the spatial and temporal phase for us,
        allowing us to use the logical relative neighbours.

    */

class Bbm extends ruletable {

    void jcruleModes() {
        setWorld(13);
        setPatternRequest("bbm");
        setPaletteRequest("bbm");
        setOwnCodeRequest("margolus");
    }

    int jcrule(int oldstate) {
        int nc = 0;

        switch (CENTER + CW + CCW + OPP) {
            case 0:
            case 3:
            case 4:
                nc = CENTER;
                break;

            case 1:
                nc = OPP;
                break;

            case 2:
                nc = (CENTER == OPP) ? CW : CENTER;
                break;
        }

        return nc | (oldstate & 0xFE);
    }

}

public class bbm {
    public static void main(String args[]) {
        (new Bbm()).generateRuleFile("bbm");
    }
}
