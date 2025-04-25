/*

        The Vichniac voting rule with the seven
        extra bits used as memory

*/

class Border extends ruletable {

    void jcruleModes() {
        setPaletteRequest("mask1");
        setPatternRequest("square");
    }

    int jcrule(int oldstate) {
        int NineSum = nw + n + ne + e + se + s + sw + w + self,
            Cycle = (oldstate >> 7) & 1,
            NewCycle = Cycle ^ 1, NewSelf = 0;

        switch (Cycle) {
            case 0:
                NewSelf = (NineSum > 0) ? 1 : 0;
                break;

            case 1:
                NewSelf = (NineSum == 9) ? 0 : self;
                break;
        }

        return (NewCycle << 7) | NewSelf;
    }
}

public class border {
    public static void main(String args[]) {
        (new Border()).generateRuleFile("border");
    }
}
