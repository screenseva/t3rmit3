/*

        This rule runs Life and Brain in parallel and lets them
        interact only within a certain masked region.  In this region,
        firing Brain cells turn on Life cells, and firing Life cells
        keep Brain cells from turning on.

*/

class Brailife extends ruletable {

    void jcruleModes() {
        /*  The BraiLife.CAC palette looks at bits 4,3,2, & 1.
            Practically every combo has a meaning, so suppose I get my
            palette simply by disabling planes 0,5,6,7.  */
        setPaletteRequest("BraiLife");
        /*  The starting BraiLife pattern has all bit 7s set to 0 (for
            synchronized cycles), has two adjacent cells on in plane
            #2 turned on to start Brain, and has a big disk mask in
            plane 4.  */
        setPatternRequest("BraiLife");
    }

    int jcrule(int oldstate) {
        int r = 0, L, NewL, B, NewB, BR, NewBR,
            Mask, Cycle, NewCycle, EightSum;

        EightSum = nw + n + ne + e + se + s + sw + w;
        Cycle = (oldstate >> 7) & 1;
        Mask = (oldstate >> 4) & 1;
        BR = (oldstate >> 3) & 1;
        B = (oldstate >> 2) & 1;
        L = (oldstate >> 1) & 1;

        if (Cycle == 0) {

            //  Life update cycle

            if ((EightSum == 3) || ((EightSum == 2) && (L == 1))) {
                NewL = 1;
            } else {
                NewL = 0;
            }
            //  Turned on by firing Brain cells within region of mask
            if (Mask == 1 && B == 1) {
                NewL = 1;
            }
            NewCycle = 1;
            r = (NewCycle << 7) | (Mask << 4) | (BR << 3) |
                (B << 2) | (NewL << 1) | B;
        } else {

            //  Brain update cycle

            if (((BR == 0) && (B == 0)) && (EightSum == 2)) {
                NewB = 1;
            } else {
                NewB = 0;
            }
            //  Turned off by firing Life cells within region of mask
            if (L == 1 && Mask == 1) {
                NewB = 0;
            }
            NewBR = B;
            NewCycle = 0;
            r = (NewCycle << 7) | (Mask << 4) | (NewBR << 3) |
                (NewB << 2) | (L << 1) | L;
        }
        return r;
    }
}

public class brailife {
    public static void main(String args[]) {
        (new Brailife()).generateRuleFile("brailife");
    }
}
