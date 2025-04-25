/*

                  Four neighbour open world Rug rule

       Running Rug in WorldType 10 does not give a chaotic carpet
       because edge clamping is needed as constant info input (info
       about the screen size).  The WorldType 10 Heat rule clamps the
       screen edge (or any other region) at the cost of only allowing
       even values for freely changing states, for an effective state
       number of 128.  This program runs a nowrap clamped Rug by using
       the semi4.jco oen code in WorldType 12.  Note that the edges
       will always be clamped to zero.

*/

class Rugf extends ruletable {
    void jcruleModes() {
        setWorld(12);
        setOwnCodeRequest("semi4");
        setPaletteRequest("autocad");
    }

    int jcrule(int oldstate) {
        // Extract 4sum from lookup table index
        return (((oldstate & 1023) >> 2) + 1) & 255;
    }
}

public class rugf {
    public static void main(String args[]) {
        (new Rugf()).generateRuleFile("rugf");
    }
}
