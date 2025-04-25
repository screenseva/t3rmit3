/*

        The Vichniac voting rule with the seven extra bits used as
        memory, as in VoteMem.  The additional twist here is that we
        increment the color bits by the NineSum each time.  The inland
        cells quickly converge to the state X which is a fixed point
        for the transformation NewX = ((OldX + 9)*2)-256)+1.
        Replacing NewX and OldX by X and solving, we get X=237.
        Change the color for state 237 to 0 (CGA) or 1,1,1 (VGA), and
        see that the line of thought is correct, as the internal
        pinkish inland cells disappear.  What remains are thick,
        seething boundary bands.  Loading the palette map "VoteBow"
        blanks 237 automatically.

*/

class Votedna extends ruletable {

    void jcruleModes() {
        setPaletteRequest("votedna");
    }

    int jcrule(int oldstate) {
        int NineSum = nw + n + ne + e + se + s + sw + w + self,
            r = 0;

        switch (NineSum) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 5:
                r = 0;
                break;

            case 4:
            case 6:
            case 7:
            case 8:
            case 9:
                r = 1;
                break;
        }
        return (((oldstate + NineSum) << 1) & 0xFE) | r;
    }
}

public class votedna {
    public static void main(String args[]) {
        (new Votedna()).generateRuleFile("votedna");
    }
}
