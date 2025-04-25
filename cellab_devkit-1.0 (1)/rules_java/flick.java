/*
        Flickercladding Interior Decoration

        Conceived by Rudy Rucker
        Drawn by Gary Wells
        Modeled with AutoCAD
        Rendered by AutoShade
        Perpetrated by Kelvin R. Throop.

        In this rule, we only change the cells whose high bits are on.
        These cells are updated according to the TimeTun rule.
*/

class Flick extends ruletable {

    void jcruleModes() {
        setPatternRequest("openplan");
        setPaletteRequest("openplan");
    }

    int jcrule(int oldstate) {
        int Interest, OldSelf, NewSelf, r;

        if (!BITSET(7)) {
            r = oldstate;
        } else {
            OldSelf = (oldstate >> 1) & 1;
            Interest = (SUM_5 == 0 || SUM_5 == 5) ? 0 : 1;
            NewSelf = Interest ^ OldSelf;
            r = 0x80 | BF(self, 1) | NewSelf;
        }
        return r;
    }
}

public class flick {
    public static void main(String args[]) {
        (new Flick()).generateRuleFile("flick");
    }
}
