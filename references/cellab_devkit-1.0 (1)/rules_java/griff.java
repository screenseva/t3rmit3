    /*

        This rule is David Griffeath's cyclic appetite rule,
        described in Notices of the AMS, December, 1988, p.
        1474.  At each update, each cell looks at a single
        randomly selected neighbor.  If the neighbour's state is
        one greater than the cell's state mod 256, then the cell
        takes on the neighbour's state, otherwise it stays the
        same.  This rule uses the randnabe user evaluator which
        computes a 16 bit index NaberAndMe with the cell's own
        state in low byte and of the neighbour's state in the
        high byte.  randnabe has its own little randomizer for
        selecting a random neighbour, so we can use all eight
        bits of the color state.

    */

class Griff extends ruletable {

    void jcruleModes() {
        setWorld(13);
        setPatternRequest("griff");
        setPaletteRequest("autocad");
        setOwnCodeRequest("randnabe");
    }

    static final boolean B(int i) {
        return i != 0;
    }

    int jcrule(int NabeAndMe) {
        int N = 11;         // Set to number of states: 2 to 256
        
        int Me, Nabe;
        
        Me = (NabeAndMe & 0xFF) % N;
        Nabe = (NabeAndMe >> 8) % N;
        if ((Nabe == (Me + 1)) || ((Nabe == 0) && (Me == (N - 1)))) {
            Me = Nabe;
        }
        return Me;
    }

}

public class griff {
    public static void main(String args[]) {
        (new Griff()).generateRuleFile("griff");
    }
}
