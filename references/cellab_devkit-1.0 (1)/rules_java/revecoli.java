/*

        This rule runs Brain in the sea and AntiLife on land.  Six or
        seven firing Brain cells turn a sea cell into land.  Seven
        "antifiring" Antilife cells turn a land cell into sea.  In
        addition I have tacked on fourbit reversibility.

*/

class Revecoli extends ruletable {
    void jcruleModes() {
        setPatternRequest("ecolibra");
        setPaletteRequest("default");
    }

    int jcrule(int oldstate) {

        /*  Here rather than thinking of bits, we think of state numbers.

            State 0 is dead sea
            State 1 is firing brain in sea
            State 2 is refractory brain in sea
            State 3 is dead land
            State 4 is firing life on land  */

        int PastState, PresentState, NewState = 0;

        PastState = oldstate >> 4;
        PresentState = oldstate & 15;
        oldstate &= 7;

        if (oldstate == 0) {
            switch (SUM_8) {
                case 2:
                    NewState = 1;
                    break;

                case 6:
                case 7:
                    NewState = 3;
                    break;

                default:
                    NewState = 0;
                    break;
            }
        } else if (oldstate == 1) {
            NewState = 2;
        } else if (oldstate == 2) {
            NewState = 0;
        } else if (oldstate == 3) {
            switch (SUM_8) {
                case 5:
                    NewState = 4;
                    break;

                case 1:
                    NewState = 0;
                    break;

                default:
                    NewState = 3;
                    break;
            }
        } else if (oldstate == 4) {
            if (SUM_8 == 5 || SUM_8 == 6) {
                NewState = 4;
            } else {
                NewState = 3;
            }
        }
        if (oldstate > 4) {
            NewState = 0;
        }
        NewState = (16 + (NewState - PastState)) & 0xF;
        PastState = PresentState;
        return (PastState << 4) | NewState;
    }
}

public class revecoli {
    public static void main(String args[]) {
        (new Revecoli()).generateRuleFile("revecoli");
    }
}
