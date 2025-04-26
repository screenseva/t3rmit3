/*

        Park's one dimensional glider gun

        This rule definition is used to demonstrate James K. Park's
        one dimensional glider gun.  The rule definition program is
        capable of generating any one dimensional, two-state line
        automaton with neighbourhood radius between 0 and 4, as defined
        in the chapter titled "One-Dimensional Computers" in:

        The Armchair Universe by A. K. Dewdney: New York, Freeman,
        1988.  (ISBN 0-716-71938-X).

        The program is parameterised by the definitions of Radius and
        CodeNumber given below.  Radius specifies how many cells on
        either side of the cell being updated are summed with the cell
        itself.  Radius may range from 0 to 4, the maximum
        neighbourhood allowed by WebCA in two-state mode.  The
        CodeNumber gives, when expressed in binary, the bit coded new
        state for each possible sum of the neighbourhood.  For
        example, Park's glider gun exists in the world with Radius 3
        and CodeNumber 88 (decimal).  Each cell is then updated by
        counting the number of on cells in a neighbourhood that looks
        like the following:

              L3   L2  L1  SELF  R1  R2  R3

        This yields a sum of on cells that between 0 and 7.  The
        CodeNumber therefore encodes 8 possible results.  Writing 88
        as 8 binary digits, we obtain 01011000.  These digits give the
        new state based on the number of neighbours as follows:

        Neighbours on:    7  6  5  4  3  2  1  0
        New state:        0  1  0  1  1  0  0  0

        If you define StartPat, that pattern file will be loaded
        automatically.  In this example we load Park's glider gun,
        which consists simply of the pattern of values:

              1 1 1 1 1 1 1 1 1 1 0 1 1

        stored in cells at the centre of the top line of the screen.

        We run this example with a worldtype of 3. In a toroidal world
        the gliders created by the glider gun annihilate one another
        and thus don't mess up the glider gun; in an infinite world
        they would continue forever.
*/

class Parks extends ruletable {
    final static int Radius = 3;  // Radius of neighbourhood (Dewdney's R)
    final static int CodeNumber = 88; // Totalistic action code number
    final static String StartPat = "parks"; // Start with Park's glider gun

    int [] nbrhood = new int[9];

    void jcruleModes() {
        if ((Radius > 4) || (Radius < 0)) {
            /* If your compiler evalutes the above if at compile time,
               you may get an unreachable code warning on the following
               line.  Such a warning indicates that Radius is within
               range.  Ignore the warning. */
            bomb("Hey!!!  Radius must be 0 <= Radius <= 4.");
            bomb("        You specified Radius = " + Radius);
        }
        if (CodeNumber > (1 << ((Radius * 2) + 2))) {
            /* An unreachable code warning on this line simply
               indicates that your compiler is smart enough to
               figure out that the CodeNumber setting is consistent
               with the Radius at compile time. */

            bomb("CodeNumber setting of " + CodeNumber +
                    " inconsistent with");
            bomb("  Radius setting of " + Radius +
                    ".  The maximum valid");
            bomb("  CodeNumber for this Radius is " +
                    (1 < ((Radius * 2) + 2)));
        }
        setWorld(3);                  // 8 neighbours, 1 bit each
        /*  The Parks pattern is 1111111111011. 
            The pattern spews gliders left & right.  */
        setPatternRequest(StartPat);
        setPaletteRequest("mask1");
    }

    int jcrule(int oldstate) {
        int i, sum;

        /* Place the neighbour values in an array so that the sum
           can be calculated in a loop controlled by the setting
           of Radius. */

        nbrhood[0] = N8L4;
        nbrhood[1] = N8L3;
        nbrhood[2] = N8L2;
        nbrhood[3] = N8L1;
     // nbrhood[4] = self;   Not actually used.
        nbrhood[5] = N8R1;
        nbrhood[6] = N8R2;
        nbrhood[7] = N8R3;
        nbrhood[8] = N8R4;

        // Count dem bitz in de 'hood.

        sum = self;
        for (i = 1; i <= Radius; i++) {
           sum += nbrhood[4 + i] + nbrhood[4 - i];
        }

        // Return result derived from CodeNumber.

        return (CodeNumber & (1 << sum)) != 0 ? 1 : 0;
    }
}

public class parks {
    public static void main(String args[]) {
       (new Parks()).generateRuleFile("parks");
    }
}
