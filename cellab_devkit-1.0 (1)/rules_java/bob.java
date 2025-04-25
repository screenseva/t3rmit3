/*

        This is modelled on the Hodgepodge rule of Gerhardt and
        Schuster, but is not a close enough model to produce a
        Zhabotinsky reaction except after extremely long run times.

        The start pattern used is the Shroud of Turing visage of
        "Bob".  Bob is the High Epopt of the Church of the SubGenius.
        For more information about Bob and the Church, send $1 and a
        long stamped self-addressed envelope to:

                The SubGenius Foundation
                Box 140306
                Dallas, TX 75214

        The image of Bob is a registered trademark of the Church of
        the Subgenius and is used by special arrangement with Douglas
        St. Claire Smith, a.k.a. Ivan Stang.  Inquiries about
        further usage of Bob's image should be directed to Mr. Smith
        c/o The SubGenius Foundation.

*/

class Bob extends ruletable {

    void jcruleModes() {
        setPatternRequest("bob");
        setPaletteRequest("bob");
    }

    int jcrule(int oldstate) {
        int EightSum = nw + n + ne + e + se + s + sw + w,
            Sickness, NewState;

        if (oldstate == 0) {
            if (EightSum == 0) {
                NewState = 0;
            } else {
                NewState = EightSum | 1;
            }
        } else {
            Sickness = oldstate >> 1;
            if (Sickness == 64) {
                NewState = 0;
            } else {
                Sickness = Sickness + EightSum + 3;
                if (Sickness > 64) {
                    Sickness = 64;
                }
                NewState = (Sickness << 1) | 1;
            }
        }
        return NewState;
    }
}

public class bob {
    public static void main(String args[]) {
        (new Bob()).generateRuleFile("bob");
    }
}
