/*

    The Life rule with one bit of memory.

*/

class Life extends ruletable {

    void jcruleModes() {
        setPaletteRequest("default");
    }

    int jcrule(int oldstate) {
        int EightSum, NewSelf = 0, NewState;

        EightSum = nw + n + ne + e + se + s + sw + w;
        switch (self) {
            case 0:
                if (EightSum == 3) {
                    NewSelf = 1;
                } else {
                    NewSelf = 0;
                }
                break;

            case 1:
                if (EightSum == 2 || EightSum == 3) {
                    NewSelf = 1;
                } else {
                    NewSelf = 0;
                }
                break;
        }
        /*  "& 0x2" to only save the most recent bit of state.
            Replace this with "& 0xFE" to see more "trails".  */
        NewState = (oldstate << 1) & 0x2;
        return NewState | NewSelf;
    }
}

public class life {
    public static void main(String args[]) {
        (new Life()).generateRuleFile("life");
    }
}
