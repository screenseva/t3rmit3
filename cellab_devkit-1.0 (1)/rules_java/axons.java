/*

        A one dimensional rule that only looks at one bit of two
        neighbors.  We run it as WorldType 3, which gets one bit from
        each of 8 neighbors.  The rule is totalistic, meaning that it
        only looks at the SUM of its neighborhood.  The rule is also
        reversible, meaning that it saves its past state and XORs its
        calculated new state with the past state.  A final fillip to
        make this rule look good is that I use my extra six bits of
        state as a five bit clock and as a mask indicator.  Whenever
        the clock counts up to 31, I turn on the bits where mask is
        on.  The start pattern for this consists of two dots with bit
        #0 turned on, all the times set to 0, and a pair of dots with
        mask set to 1.  You can vary the constant WolfCode to get
        other pictures.

*/

class Axons extends ruletable {
    static final int WolfCode = 178;

    void jcruleModes() {
        setWorld(3);
        setPaletteRequest("mask3");   // Only show low two bits
        setPatternRequest("axons");
    }

    int jcrule(int oldstate) {
        int Sum, PastSelf, NewSelf, NewState, Time, Mask;

        Sum = N8L1 + self + N8R1;
        PastSelf = (oldstate >> 1) & 1;
        NewSelf = (WolfCode >> Sum) & 1;
        NewState = (self << 1) | (NewSelf ^ PastSelf);
        Time = (oldstate >> 2) & 31;
        Mask = (oldstate >> 7) & 1;

        return (Time == 31) ? ((Mask << 7) | NewState | Mask) :
                              ((Mask << 7) | ((Time + 1) << 2) | NewState);
    }
}

public class axons {
    public static void main(String args[]) {
        (new Axons()).generateRuleFile("axons");
    }
}
