/*

    Dummy rule definition to invoke user-supplied own code.
    No lookup table is used.

*/

class Owncode extends ruletable {
    void jcruleModes() {
        setWorld(13);           // Own code, torus world
        setOwnCodeRequest("");  // User own code function
    }

    int jcrule(int oldstate) {
        return 0;               // No lookup table
    }
}

public class owncode {
    public static void main(String args[]) {
        (new Owncode()).generateRuleFile("owncode");
    }
}
