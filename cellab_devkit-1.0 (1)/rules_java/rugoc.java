/*

    This is an implementation of the Rug rule which uses the
    purpose-built rug() own code evaluator.

*/

class Rugoc extends ruletable {
    void jcruleModes() {
        setWorld(12);
        setOwnCodeRequest("rug");
    }

    int jcrule(int oldstate) {
        return 0;               // No lookup table
    }
}

public class rugoc {
    public static void main(String args[]) {
        (new Rugoc()).generateRuleFile("rugoc");
    }
}
