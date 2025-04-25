/*

    3 bit parity rule for von Neumann neighbourhood implemented
    with the VONN3 own-code evaluator.

*/

class Vonpar extends ruletable {

    void jcruleModes() {
        setWorld(13);
        setPatternRequest("square");
        setOwnCodeRequest("vonn3");
    }

    int jcrule(int oldstate) {
        return BITFIELD(0, 3) ^ BITFIELD(3, 3) ^ BITFIELD(6, 3) ^ BITFIELD(9, 3);
    }
}

public class vonpar {
    public static void main(String args[]) {
        (new Vonpar()).generateRuleFile("vonpar");
    }
}
