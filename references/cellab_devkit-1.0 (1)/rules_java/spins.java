/*
	Spin-only Ising system

	(Toffoli & Margolus, section 17.3, page 190)
    
    This rule is reversible: if you run it for a while,
    pause and invert plane 3 with the Bit Plane Editor,
    then restart, it will return to the starting
    configuration.
*/

class Spins extends ruletable {
    static final int HPPlane = 1,     // Horizontal phase plane
                     HPNbits = 1,     // Horizontal phase plane count
                     VPPlane = 2,     // Vertical phase plane
                     VPNbits = 1,     // Vertical phase plane count
                     TPPlane = 3,     // Temporal phase plane
                     TPNbits = 1;     // Temporal phase plane count

    void jcruleModes() {
        setWorld(1);
        
        setPatternRequest("spins");
        // We use the "Mask1" palette which shows bit 1 only
        setPaletteRequest("mask1");

        setTextureHorizontal(HPPlane, HPNbits);
        setTextureVertical(VPPlane, VPNbits);
        setTemporalPhase(TPPlane, TPNbits);
    }

    static final boolean B(int i) {
        return i != 0;
    }

    int jcrule(int oldstate) {
    
	    int texture = HPHASE() ^ VPHASE();
	    int time = TPHASE();
	    int ntex = oldstate & BITMASK(HPPlane, 2);
	    if (B(texture ^ time)) {
	       return ntex | TPUPD((((n + s + w + e) == 2) ? (self ^ 1) : self));
	    }
	    return ntex | TPUPD(self);
    }
}

public class spins {
    public static void main(String args[]) {
        (new Spins()).generateRuleFile("spins");
    }
}
