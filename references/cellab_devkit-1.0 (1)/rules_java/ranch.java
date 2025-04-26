/*

        This rule alterantes cycles of Vote and Brain/Vote.
        The boundary is treated differently on the land side.

*/

class Ranch extends ruletable {

    void jcruleModes() {
        /*   The ranch.jcc palette looks only at bits 3, 2, & 1.
             Pattern meanings:
             ----001- is firing at sea
             ----010- is refractory at sea
             ----1-0- is dead on land
             ----1-1- is live on land
             & others are dead at sea  */
        setPaletteRequest("ranch");
        setInitialRandomSeed(0, 2);
    }

    static final int I(boolean b) {
        return b ? 1 : 0;
    }

    int jcrule(int oldstate) {
        boolean Cycle, M, V, R, F;
        int EightSum, NineSum, NewCycle, NewM = 0, NewV = 0, NewR, NewF, r;

        /*  We use the eight bits of state as follows:

            Bit #0 is used to show either the firing or the vote bit
            to neighbors; Bit #1 is the firing bit, Bit #2 is the
            refractory bit, Bit #3 is the Vote bit, Bit #4 is the vote
            memory bit, and Bit #7 is the cycle bit.
        */

        EightSum = nw + n + ne + e + se + s + sw + w;
        NineSum = EightSum + self;

        Cycle = BITSET(7);
        M = BITSET(4);
        V = BITSET(3);
        R = BITSET(2);
        F = BITSET(1);

        if (!Cycle) {

            //  Vote update cycle

            NewV = (NineSum > 5 || NineSum == 4) ? 1 : 0;
            NewM = I(V);
            NewCycle = 1;
            r = BF(NewCycle, 7) | BF(NewM, 4) | BF(NewV, 3) |
                BF(R, 2) | BF(F, 1) | BF(F, 0);
        } else {
            if (!V) {                 // Use Brain rule at sea
                NewF = (!R && !F && (EightSum == 2)) ? 1 : 0;
                NewR = I(F);
            } else {                  // Use Life rule inland
                if (M) {
                    NewF = ((EightSum == 3) || (F && (EightSum == 2))) ? 1 : 0;
                } else {              // Use EdgeLife on new land
                    NewF = ((EightSum == 1) || (EightSum == 4)) ? 1 : 0;
                }
                NewR = 0;             // Only sea cells can be refractory
            }
            NewCycle = 0;
            r = BF(NewCycle, 7) | BF(M, 4) | BF(V, 3) |
                BF(NewR, 2) | BF(NewF, 1) | BF(V, 0);
        }
        return r;
    }
}

public class ranch {
    public static void main(String args[]) {
        (new Ranch()).generateRuleFile("ranch");
    }
}
