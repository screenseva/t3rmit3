/*

 Rule suggested by William Gosper.  We lay down a mask marking
 the cartesian plane's four quadrants (Qs for short) by the numbers 0-3 in
 the arrangement    2  0
                    3  1.
 And we tell Q0 cells to copy SE, Q1 copy SW, Q2 copy NE, Q3 copy NW.
 A block of cell stuff will refract.

*/

class Gyre extends ruletable {
    void jcruleModes() {
        setWorld(0);                  // 2D, no wrap
        setPaletteRequest("gyre");    // Colorful
        /*  The pattern has Q's marked in bits 1,2 and a rectangle
            of food cells in Q0.  Pattern also has a frame of Barrier
            cells around the screen edge.  */
        setPatternRequest("gyre");
    }

    int jcrule(int oldstate) {
        int r, Barrier, Quadrant, NewSelf = 0;

        Barrier = (oldstate >> 3) & 1;
        Quadrant = (oldstate >> 1) & 3;

        //  Barrier cells stay barrier cells
        if (Barrier == 1) {
            r = 8;
        } else {
            switch (Quadrant) {
                case 0:
                    NewSelf = se;
                    break;

                case 1:
                    NewSelf = sw;
                    break;

                case 2:
                    NewSelf = ne;
                    break;

                case 3:
                    NewSelf = nw;
                    break;
            }
            r = (Quadrant << 1) | NewSelf;
        }
        return r;
    }
}

public class gyre {
    public static void main(String args[]) {
        (new Gyre()).generateRuleFile("gyre");
    }
}
