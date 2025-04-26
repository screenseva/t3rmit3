/*

                   Diffuse with dendrite accretion.

    Note that Diffuse needs randomizer set to 50% ones, and that
    Dendrite needs a frozen pattern in plane 7 to accrete to, and an
    initial gas pattern gas in plane 0.

        We use plane #0 to show bits for updating.
        We use planes #1,2,3 for randomizer info.  We don't use plane #4.
        We use plane #5 for the phase:
        If bit #5 is 0 we update the gas motion,
        If bit #5 is 1 we update the accretion,
        We use #6 to indicate frozen cells:
        If bit #6 is 0 we assume the cell is not frozen,
        If bit #6 is 1 we assume the cell is frozen.
        We use #7 to indicate presence of gas.

    We load the Dendrite palette which shows states as white, red, or
    black depending as the high two bits are 10, 01, or anything else,
    respectively.


*/

class Dentim extends ruletable {

    void jcruleModes() {
        setPatternRequest("dentim");
        setPaletteRequest("dendrite");
        setRandomInput(1, 1);
    }

    int jcrule(int oldstate) {
        int FPhase, NewState = 0, Direction, NewSelf = 0, EightSum, Swap;

        NewState = (oldstate << 1) & 0xC;  // Save two random bits
        NewState |= oldstate & 0xC0;       // Show two color bits
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

           case 1:  // Not frozen, update accrete
               EightSum = nw + n + ne + e + se + s + sw + w;
               if ((EightSum != 0) && ((oldstate & 0x80) != 0)) {
                  NewState= 0x40; // Frozen, phase zero, shown no gas
               } else {
                  NewState = NewState | ((oldstate & 0x80) >> 7); // Show gas bit
               }
               // Phase bit is already 0
               break;

            case 2:  // Frozen, update gas
               NewState = 0x61; // Stay frozen, set phase to 1, show frozen
               break;

            case 3:  // Frozen, update accrete
               NewState = 0x40;  // Stay frozen, set phase to zero, show no gas
               break;
        }
        return NewState;
    }
}

public class dentim {
    public static void main(String args[]) {
        (new Dentim()).generateRuleFile("dentim");
    }
}
