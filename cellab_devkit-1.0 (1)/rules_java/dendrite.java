/*
        Naive Diffusion with dendrite accretion.

        This rule accretes random gas particles on a frozen
        pattern initially loaded in Plane 0.

        We use plane #0 to show bits for updating.
        We use planes #1,2,3 for randomizer info.  We don't use plane #4.
        We use plane #5 for the phase:
        If bit #5 is 0 we update the gas motion,
        If bit #5 is 1 we update the accretion,
        We use #6 to indicate frozen cells:
        If bit #6 is 0 we assume the cell is not frozen,
        If bit #6 is 1 we assume the cell is frozen.
        We use #7 to indicate presence of gas.

        We use the Dendrite palette which shows states as white, red,
        or black depending as the high two bits are 10,01,or anything
        else, respectively.
*/

class Dendrite extends ruletable {

    void jcruleModes() {
        setPatternRequest("teapot");
        setPaletteRequest("dendrite");
        setInitialRandomSeed(6, 1, 80);
        setRandomInput(1, 1);
    }

    int jcrule(int oldstate) {
        int FPhase, NewState = 0, Direction, NewSelf = 0, EightSum, Swap;

        if ((oldstate & 0x10) == 0) {

            /*  First generation.  Interchange planes 0 and 6 and set
                Plane 4 to indicate that the first generation is
                complete.  */

            NewState = (oldstate & 0xBE) | (0x10 | ((oldstate & 1) << 6) |
                ((oldstate & 0x40) >> 6));

        } else {

            NewState = (oldstate << 1) & 0xC; // Save two random bits
            NewState = NewState | (oldstate & 0xC0); // Show two color bits
            FPhase = (oldstate & 0x60) >> 5;
            switch (FPhase) {
               case 0:
                   //  Not frozen, update gas
                   Direction = ((oldstate & 0xE) >> 1);
                   switch (Direction) {
                     case 0:  NewSelf =nw; break;
                     case 1:  NewSelf=n; break;
                     case 2:  NewSelf=ne; break;
                     case 3:  NewSelf=e; break;
                     case 4:  NewSelf=se; break;
                     case 5:  NewSelf=s; break;
                     case 6:  NewSelf=sw; break;
                     case 7:  NewSelf=w; break;
                   }
                   NewState = NewState & 0x7F; // Turn off gas bit
                   NewState = NewState | (NewSelf << 7); // Set gas
                   // Show a zero frozen bit
                   NewState = NewState | 0x20; // Set phase to 1
                   break;

               case 1:  //  Not frozen, update accrete
                   EightSum = nw + n + ne + e + se + s + sw + w;
                   if ((EightSum != 0) && ((oldstate & 0x80) != 0)) {
                       NewState= 0x40;//  {Frozen, phase zero, shown no gas
                    } else {
                       NewState = NewState | ((oldstate & 0x80) >> 7); // Show gas bit
                    }
                    // Phase bit is already 0
                    break;

                case 2:  // Frozen, update gas
                    NewState = 0x61; // Stay frozen, set phase to 1,show frozen
                    break;

                case 3:  // Frozen, update accrete
                   NewState = 0x40;  // Stay frozen, set phase to zero,show no gas
                   break;
            }
        }
        return NewState | 0x10;      // Or in Plane 4 to say not first gen
    }
}

public class dendrite {
    public static void main(String args[]) {
        (new Dendrite()).generateRuleFile("dendrite");
    }
}
