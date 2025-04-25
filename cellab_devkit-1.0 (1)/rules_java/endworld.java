    /*

        End of the World

        (Toffoli & Margolus, section 18.3.2, page 219)
        
        This rule demonstrates how a Margolus neighbourhood rule
        can be implemented in a Moore neighbourhood without any
        special external inputs and can, in addition, be made
        reversible.  The price is having an extremely contrived
        low-entropy initial state, created by running the BBM
        rule with memory to encode cells' current and previous
        states in planes #4 and #5.  We request horizontal and
        vertical texture in planes 4 and 5, and record our own
        history in plane #1.
        
        We load such a state and evolve the rule, which uses the
        trick of performing two updates per generation, which in
        turn works because two generations cancels out the
        alternation of the grid.
        
        All of this works swimmingly until some troublemaker
        changes the state of a cell in the current or historical
        map without making the corresponding change to the other,
        This is "the end of the world".  The rogue cell will spawn
        cells spewing out and quickly corrupting the ordered map
        into a seething mess.
        
        You can reverse this rule at any time by swapping planes
        #0 and #1, which can be accomplished with the Swap button
        on the control panel or with the Bit Plane Editor.

    */

class Endworld extends ruletable {
    static final int HPPlane = 4,     // Horizontal phase plane
                     HPNbits = 1,     // Horizontal phase plane count
                     VPPlane = 5,     // Vertical phase plane
                     VPNbits = 1;     // Vertical phase plane count

    void jcruleModes() {
        setWorld(1);
        setPatternRequest("bbmrev");
        setPaletteRequest("bbm");

        /*  We set a horizontal pattern of alternate 0s and 1s in bit 4
            and a vertical pattern of alternate 0s and 1s in bit 5.
            This produces a pattern that goes 0 1 0 1 ..
                                              2 3 2 3 ..
                                              0 1 0 1 ..
                                              2 3 2 3 ..
                                              : : : :     */

        setTextureHorizontal(HPPlane, HPNbits);
        setTextureVertical(VPPlane, VPNbits);
    }

    static final boolean B(int i) {
        return i != 0;
    }

    //  Compute update in synthetic Margolus neighbourhood
    
    int compMarg(int time, int HV, int U) {
        int HVxT = HV ^ time;       // Texture adjusted by time
        int CW = (B(HVxT & 1) ? (B(HVxT & 2) ? w : s) :
                                (B(HVxT & 2) ? n : e));
        int CCW = (B(HVxT & 1) ? (B(HVxT & 2) ? n : w) :
                                 (B(HVxT & 2) ? e : s));
        int OPP = (B(HVxT & 1) ? (B(HVxT & 2) ? nw : sw) :
                                 (B(HVxT & 2) ? ne : se));
        int RUL2 = ((U == OPP) ? CW : U);

        int ns = 0;
        switch (U + CW + CCW + OPP) {
            case 0:
            case 3:
            case 4:
                ns = U;
                break;

            case 1:
                ns = OPP;
                break;

            case 2:
                ns = RUL2;
                break;
        }
        return ns;
    }

    int jcrule(int oldstate) {
        int HV = ((oldstate & 0x30) >> 4);  // Horizontal, vertical texture
        int U = self;                       // Shortcut for our own state

        int b1, b2;                         // Results from the two steps

        //  Perform step with time = 0
        b1 = compMarg(0, HV, U);

        //  Now step with time = 3
        b2 = compMarg(3, HV, U);

        return (b1 ^ b2 ^ ((oldstate & 2) >> 1)) |  // New state
               (U << 1) |                           // Previous state
               (oldstate & 0xFC);                   // Preserve texture and tag bits
   }
}

public class endworld {
    public static void main(String args[]) {
        (new Endworld()).generateRuleFile("endworld");
    }
}
