/*

        A one dimensional rule that only looks at two bits of two
        neighbors.  We run it as WorldType 5, which gets two bits from
        each of four neighbors.  The rule is totalistic, meaning that
        it only looks at the SUM of its neighborhood.  The first four
        digits of the totalistic lookup table are the first four
        digits of pi, taken MOD 4.  The next six digits were found by
        trial and error to make a rule that looks good.

*/

class Shortpi extends ruletable {

    void jcruleModes() {
        setWorld(5);
    }

    int jcrule(int oldstate) {
        int r = 0;

        switch (N4L1 + N4R1 + (oldstate & 3)) {
            case 0:  r = 3; break;
            case 1:  r = 1; break;
            case 2:  r = 0; break;
            case 3:  r = 1; break;
            case 4:  r = 0; break;
            case 5:  r = 3; break;
            case 6:  r = 2; break;
            case 7:  r = 0; break;
            case 8:  r = 0; break;
            case 9:  r = 0; break;
        }
        return r;
    }
}

public class shortpi {
    public static void main(String args[]) {
        (new Shortpi()).generateRuleFile("shortpi");
    }
}
