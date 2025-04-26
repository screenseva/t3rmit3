/*

    To evaluate any NLUKY rule, just change the parameters
    in the call to NLUKY below to the desired values.

*/

class Totalistic extends ruletable {
    int jcrule(int oldstate) {
        return TOTALISTIC(976);       // Vote rule
    }
}

public class totalistic {
    public static void main(String args[]) {
        (new Totalistic()).generateRuleFile("totalist");
    }
}
