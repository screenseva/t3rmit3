/*

        The Fredkin rule with the seven extra bits used as memory

*/

class Fredmem extends ruletable {

    void jcruleModes() {
        setPatternRequest("square");
    }

    int jcrule(int oldstate) {
        return ((oldstate << 1) & 0xFE) | (SUM_9 & 1);
    }
}

public class fredmem {
    public static void main(String args[]) {
        (new Fredmem()).generateRuleFile("fredmem");
    }
}
