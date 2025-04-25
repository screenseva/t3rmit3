/*
     This rule runs Brain in the sea and AntiLife on land.  Six or
     seven firing Brain cells turn a sea cell into land.  Seven
     "antifiring" Antilife cells turn a land cell into sea.
*/

class Ecolibra extends ruletable {
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

        int NewState;

        if ((oldstate & 1) != 0) {
            NewState = 3;
        } else {
            NewState = 0;
        }

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
        return NewState;
    }
}

public class ecolibra {
    public static void main(String args[]) {
        (new Ecolibra()).generateRuleFile("ecolibra");
    }
}
