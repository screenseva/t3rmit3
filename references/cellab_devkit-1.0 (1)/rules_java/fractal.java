/*

        Based on Me-Neither rule, [Margolus&Toffoli87], p.132

*/

class Fractal extends ruletable {

    void jcruleModes() {
        setPatternRequest("square");
    }

    int jcrule(int oldstate) {
        int Mem, Sum, NewSelf;

        Mem = BITFIELD(1);
        Sum = ne + nw + se + sw + Mem;
        NewSelf = ((Sum & 1) == 1) ? 1 : 0;
        return (self << 1) | NewSelf;
    }
}

public class fractal {
    public static void main(String args[]) {
        (new Fractal()).generateRuleFile("fractal");
    }
}
