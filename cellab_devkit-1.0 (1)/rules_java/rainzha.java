/*

    RainZha: 

    N = 8  L = 2  U = 3  K = 2  Y = 2

    To evaluate any NLUKY rule, just change the parameters
    in the definition below to the desired values.

*/

class Rainzha extends ruletable {
    static final int N = 8, L = 2, U = 3, K = 2, Y = 2;

    void jcruleModes() {
        setPaletteRequest("default");
    }

    int jcrule(int oldstate) {
        int n = 0;

        if ((oldstate == 0) && (L <= SUM_8) && (SUM_8 <= U)) {
            n = 1;
        }
        if (oldstate == 1) {
            if ((K <= SUM_8) && (SUM_8 <= Y)) {
                n = 1;
            } else {
                n = 2;
            }
        }
        if (((oldstate & 1) == 0) && (0 < oldstate) && (oldstate < (2 * N))) {
            n = oldstate + 2;
        }
        return n;
    }
}

public class rainzha {
    public static void main(String args[]) {
        (new Rainzha()).generateRuleFile("rainzha");
    }
}
