class Life extends ruletable {
    int jcrule(int oldstate) {
        int EightSum, NewSelf = 0;

        /*  We sum up the number of firing neighbor cells.  If this
            EightSum is anything other than 2 or 3, the cell gets
            turned off.  If the EightSum is 2, the cell stays in its
            present state.  If the Eightsum is 3, the cell gets turned
            on. */

        EightSum = nw + n + ne + e + se + s + sw + w;
        if (EightSum == 2) {
            NewSelf = self;
        } else if (EightSum == 3) {
            NewSelf = 1;
        }

        return NewSelf;
    }
}

public class ex_life {
    public static void main(String args[]) {
        (new Life()).generateRuleFile("ex-life");
    }
}
