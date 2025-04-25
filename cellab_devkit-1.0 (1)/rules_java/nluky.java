/*

    To evaluate any NLUKY rule, just change the parameters
    in the call to NLUKY below to the desired values.

*/

class Nluky extends ruletable {
    int jcrule(int oldstate) {
        return NLUKY(7, 2, 3, 2, 2);  // RainZha rule
    }
}

public class nluky {
    public static void main(String args[]) {
        (new Nluky()).generateRuleFile("nluky");
    }
}
