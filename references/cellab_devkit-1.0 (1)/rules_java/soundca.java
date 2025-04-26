/*

       This is a CA implementation of one of the rules from the
       standalone SoundCa program from the RC directory.  SoundCa is a
       semitotalistic rule which looks at two bits each of a cell and
       its two neighbors.  Depending on what the center cell's state
       is, the cell reacts differently to the neighborhood sum.  This
       rule is meant to be used as a template, so that you can key in
       any SoundCa rule that interests you.

*/

class Soundca extends ruletable {
    static final int[] RuleTable = {
        // For a Sum of:           6   5   4   3   2   1   0
        /* States 0 and 3 use: */  3,  2,  1,  3,  1,  2,  0,
        /* States 1 and 2 use: */  0,  1,  0,  3,  3,  1,  0
    };

    void jcruleModes() {
        setWorld(5);
    }

    int jcrule(int oldstate) {
        int Sum, Index = 0;

        Sum = N4L1 + N4R1;
        switch (oldstate & 3) {
            case 0:
            case 3:
                Index = 6 - Sum;
                break;

            case 1:
            case 2:
                Index = 13 - Sum;
                break;
        }
        return RuleTable[Index];
    }
}

public class soundca {
    public static void main(String args[]) {
        (new Soundca()).generateRuleFile("soundca");
    }
}
