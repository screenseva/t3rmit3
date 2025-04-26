/*

        CelLab rule table class

*/

import java.io.*;

public class ruletable extends Object {
    private int worldtype;     /* World type:  0 = 2D open plane
                                               1 = 2D closed torus
                                               2 = 1D line    8 neighbours
                                               3 = 1D circle  8 neighbours
                                               4 = 1D line    4 neighbours
                                               5 = 1D circle  4 neighbours
                                               8 = 1D line    2 neighbours
                                               9 = 1D circle  2 neighbours
                                              10 = 2D semitotalistic 8 sum
                                              11 = 2D semitotalistic 4 sum
                                              12 = Own code plane
                                              13 = Own code torus
                                              -1 = unspecified */

    private int randdens;             /* Random number plane enable
                                         and density specification:
                                           0     = disable random plane
                                         1 : 255 = likelihood of random firing */

    private int auxplane;             /* Auxiliary plane configuration:
                                              -1 = Unspecified
                                               0 = Defined by rule or unused
                                               1 = Temporal phase
                                               2 = Horizontal texture
                                               4 = Vertical texture
                                         hence 6 = Checkerboard texture */

    private int texthb,               // Horizontal texture low bit
                texthn;               // Horizontal texture bit count

    private int textvb,               // Vertical texture low bit
                textvn;               // Vertical texture bit count

    private int tempb,                // Temporal texture low bit
                tempn;                // Temporal texture bit count

    private int randb,                // Random low bit
                randn;                // Number of random bits

    private int rseedb,               // Initial random seed low bit
                rseedn,               // Number of initial random seed bits
                rseedp;               // Initial random seed density (0-255)

    private String patreq,            // Requested pattern file
                   palreq,            // Requested palette file
                   ocodereq;          // Requested user own code file

    private boolean didError;         // Set if runtime error in generation


    //  Rule loading instruction operation codes

    private static final byte
                  RLUNCOMP = 1,       // 64K of uncompressed rule follows
                  RLRUN = 2,          // 3-256 byte run of value follows
                  RLONEB = 3,         // Single byte of specified value follows
                  RLUNCS = 4,         // Uncompressed string follows
                  RLCOPYB = 5,        // Copy previously specified bank
                  RLEND =  6,         // End of rule definition

                  RSHTEXT = 64,       // Horizontal texture specification
                  RSVTEXT = 65,       // Vertical texture specification
                  RSRAND = 66,        // Random bit specification
                  RSPAT = 67,         // Request load of pattern
                  RSPAL = 68,         // Request load of palette
                  RSRSEED = 71,       // Initial random seed
                  RSOCODE = 72;       // Request load of user own code

    private static final boolean COMPRESS = true;   //  Compress rule file ?

    //  Neighbours for two-dimensional rules

    int nw,   n,    ne,
        w,    self, e,
        sw,   s,    se;


    /*          Definitions of one-dimensional neighbours

        The following proxy variables for neighbours in one-dimensional
        rules are set before calling jcrule() to make the coding of
        1D rules more straightforward.

        Three sets of neighbour declarations are provided, choose the
        correct set based upon your choice of the tradeoff between the
        number of visible neighbours and the number of visible bits of
        neighbour state per cell, as expressed in the setting of
        worldtype.  The following table presents the options.

  Worldtype   Neighbours  Bits                 Neighbour Names

    2 or 3         8        1     N8L4 N8L3 N8L2 N8L1 self N8R1 N8R2 N8R3 N8R4
    4 or 5         4        2               N4L2 N4L1 self N4R1 N4R2
    8 or 9         2        4                    N2L1 self N2R1

        As with a two dimensional rule, you should use "self" for the current
        cell if you're interested only in the low-order bit of the cell and
        "oldstate" if you want to examine all 8 bits.  All one dimensional
        modes provide the standard 8 bits of local state per cell.

    */

    //  Neighbours for 8 neighbours, 1 bit visible from each

    int N8L4, N8L3, N8L2, N8L1, N8R1, N8R2, N8R3, N8R4;

    //  Neighbours for 4 neighbours, 2 bits visible from each

    int N4L2, N4L1, N4R1, N4R2;

    //  Neighbours for 2 neighbours, 4 bits visible from each

    int N2L1, N2R1;

    //  Precalculated sums of neighbours for rule program convenience

    int SUM_4, SUM_5, SUM_8, SUM_9;
    
    /*  Precalculated Margolus neighbours for margolus, margolusp
        evaluators.  */
    int CENTER, CW, CCW, OPP, CENTERp, CWp, CCWp, OPPp;

    //  Hidden copy of oldstate for high-level access functions

    private int holdstate = 0;

    //  Constructors

    ruletable() {
        worldtype = 1;
        randdens = 0;
        texthb = texthn = textvb = textvn = tempb = tempn =
                 randb = randn = rseedb = rseedn = -1;
        rseedp = 255;
        patreq = "";
        palreq = "";
        ocodereq = "";
        didError = false;
    }

    //  External to internal bit-order conversion

    private static final int UtoI(int x) {
        return (((x >> 1) & 0x7F) | (x << 7)) & 0xFF;
    }

    //  Internal to external bit-order conversion

    private static final int ItoU(int x) {
        return ((x << 1) | ((x >> 7) & 1)) & 0xFF;
    }

    //  Emit runtime error message

    final void bomb(String message) {
        System.out.println(message);
        didError = true;
    }

    //  Accessors to set various properties of the rule

    void setWorld(int world) {
        if (world >= 0 && world <= 13) {
            worldtype = world;
        } else {
            bomb("setWorld: invalid world type " + world);
        }
    }

    void setRandomDensity(int rd) {
        if (randdens >= 0 && randdens <= 255) {
            randdens = rd;
        } else {
            bomb("setRandomDensity: invalid random density " + rd);
        }
    }

    void setAuxPlane(int ap) {
        if (auxplane >= 0 && auxplane <= 6) {
            auxplane = ap;
        } else {
            bomb("setAuxPlane: invalid auxiliary plane mode " + ap);
        }
    }

    void setTextureHorizontal(int tb, int tn) {
        texthb = texthn = -1;
        if (cktext("horizontal texture", "texth", tb, tn)) {
            texthb = tb;
            texthn = tn;
        }
    }

    void setTextureVertical(int tb, int tn) {
        textvb = textvn = -1;
        if (cktext("vertical texture", "textv", tb, tn)) {
            textvb = tb;
            textvn = tn;
        }
    }

    void setTemporalPhase(int tb, int tn) {
        tempb = tempn = -1;
        if (cktext("temporal phase", "textv", tb, tn)) {
            tempb = tb;
            tempn = tn;
        }
    }

    void setRandomInput(int tb, int tn) {
        randb = randn = -1;
        if (cktext("random input", "rand", tb, tn)) {
            randb = tb;
            randn = tn;
        }
    }

    void setInitialRandomSeed(int tb, int tn, int density) {
        rseedb = rseedn = -1;
        rseedp = 255;
        if (cktext("initial random seed", "rseed", tb, tn)) {
            rseedb = tb;
            rseedn = tn;
            if (density >= 0 && density <= 255) {
                rseedp = density;
            } else {
                bomb("setInitialRandomSeed: invalid random density " + density);
            }
        }
    }

    void setInitialRandomSeed(int tb, int tn) {
        setInitialRandomSeed(tb, tn, 255);
    }

    void setPatternRequest(String s) {
        patreq = s;
    }

    void setPaletteRequest(String s) {
        palreq = s;
    }

    void setOwnCodeRequest(String s) {
        ocodereq = s;
    }

    //  Utility functions for accessing fields in oldstate

    //  Return 2^p

    final static int BIT(int p) {
        return 1 << p;
    }

    /*  Mask for N contiguous bits with low order bit in plane P.  Note
        how this definition craftily generates masks of zero when a
        zero bit field is specified.  */

    final static int BITMASK(int p, int n) {
        return BIT(p + n) - BIT(p);
    }

    //  Test if bit P is set in oldstate

    final boolean BITSET(int p) {
        return (holdstate & BIT(p)) != 0;
    }

    //  Extract a field of N bits from oldstate starting at bit P

    final int BITFIELD(int p, int n) {
        return (holdstate >> p) & BITMASK(0, n);
    }

    final int BITFIELD(int p) {
        return BITFIELD(p, 1);
    }

    /*  Place a value in a specified bit field.  The value
        can be either an integer or a boolean.  */

    final static int BF(int v, int p) {
        return v << p;
    }

    final static int BF(boolean b, int p) {
        return BF(b ? 1 : 0, p);
    }

    /*  Horizontal and vertical phase extraction functions.

               HPHASE      Horizontal phase index
               VPHASE      Vertical phase index
               HVPHASE     Composite phase: the result of concatenating
                           VPHASE with HPHASE.
               TPHASE      Temporal phase

               TPUPD(x)    Apply to the result returned by the rule
                           definition function to increment the temporal
                           phase field for the next generation.

        These definitions assume that the texture bits are supplied
        in "holdstate", per standard rule definitions.

        The rule definition and simulator know nothing about
        "temporal phase"--it is defined purely to simplify
        housekeeping for rules which use one or more bits to
        keep a generation counter modulo the capacity of the
        field.
    */

    final int HPHASE() {
        return (holdstate >> texthb) & BITMASK(0, texthn);
    }

    final int VPHASE() {
        return (holdstate >> textvb) & BITMASK(0, textvn);
    }

    final int HVPHASE() {
        return (VPHASE() << texthn) | HPHASE();
    }

    final int TPHASE() {
        return (holdstate >> tempb) & BITMASK(0, tempn);
    }

    final int TPUPD(int x) {
        return (x & (~BITMASK(tempb, tempn))) |
                (((TPHASE() + 1) & BITMASK(0, tempn)) << tempb);
    }

    /*  NLUKY rule calculator.  A jcrule method can evaluate
        an NLUKY rule with the one line program:

            return NLUKY(n, l, u, k, y);

    */

    int NLUKY(int N, int L, int U, int K, int Y) {
        int newCell= 0;

        if ((holdstate == 0) && (L <= SUM_8) && (SUM_8 <= U)) {
            newCell= 1;
        }
        if (holdstate == 1) {
            if ((K <= SUM_8) && (SUM_8 <= Y)) {
                newCell= 1;
            } else {
                newCell= 2;
            }
        }
        if (((holdstate & 1) == 0) && (0 < holdstate) &&
             (holdstate < (2 * N))) {
            newCell= holdstate + 2;
        }
        return newCell;
    }

    /*  TOTALISTIC rule calculator.  A jcrule method can
        define a totalistic rule from its 10 bit code
        with the one line program.

            return TOTALISTIC(code, history);

        where code is the rule number, 0 to 1023, and history
        if true if you want a one bit history to be kept in
        plane 1, false for no history.  You can omit the history
        argument if you don't want history.  */

    int TOTALISTIC(int code, boolean history) {
        return ((code & BIT(SUM_9)) == 0 ? 0 : 1) |
                (history ? ((holdstate & 1) << 1) : 0);
    }

    int TOTALISTIC(int code) {
        return TOTALISTIC(code, false);
    }

    //  Rule definition functions

    //  Rule mode specification function, called before first call on jcrule

    void jcruleModes() {
        //  Default is to accept values set by constructor
    }

    /*  John Horton Conway's original game of Life.  Rule
        definition programs override this with their own
        rule function.  */

    int jcrule(int oldstate) {
        int count;

        count = nw + n + ne + w + e + sw + s + se;

        if (count == 2) {             // If two neighbours...
            return self;              //   ...unchanged.
        }
        if (count == 3) {             // If exactly three...
            return 1;                 //   ...cell is born.
        }
        return 0;                     /* Otherwise die of loneliness or
                                         overpopulation. */
    }

    //  Return a given bit of an integer

    private static final int bit(int j, int x) {
        return (j >> x) & 1;
    }

    /*  PAGERUN  --  Output page as run-length compressed instruction
                     stream.  */

    final static int MINRUN = 3;      // Shortest run worth compressing

    static private final void pagerun(byte [] buf, OutputStream f)
                             throws IOException {
        if (COMPRESS) {
           byte c, cn;
           int cp, cpr;
           int ll, rl, llr, cpi, cpri;

           ll = 256;                  // Initialise length left
           cp = 0;
           cpi = 0;

           // Loop until whole buffer is disposed of.

           while (ll > 0) {

              // Search for run starting with current byte.

              c = buf[cp];
              cpr = cp + 1;
              rl = 1;
              llr = ll - 1;
              while (llr > 0 && c == buf[cpr]) {
                 llr--;
                 cpr++;
                 rl++;
              }

              /* If we found a run long enough to bother with, output
                 it. */

              if (rl >= MINRUN) {
                 f.write(RLRUN);      // Output run instruction
                 f.write(rl - 1);     // Output run length
                 f.write(c);          // Output contents of run
                 cp += rl;            // Advance past run
                 cpi += rl;           // Increment page table index
                 ll -= rl;            // Update length left to output
              } else {

                 /* The current byte does not begin a worthwhile run.
                    Scan forward and determine the length of the
                    stream of bytes that precedes the next run. */

                 llr = 0;
                 for (cpr = cp + 1, cpri = cpi + 1;
                      cpri <= (cpi + (ll - MINRUN)); cpr++, cpri++) {
                    cn = buf[cpr];
                    for (rl = 1; rl < (MINRUN + 1); rl++) {
                       if (((cpr + rl) > 255) || (cn != buf[cpr + rl])) {
                          rl = -1;
                          break;
                       }
                    }
                    if (rl >= 0) {
                       llr = 1;
                       break;
                    }
                 }

                 // Output the next incompressible stream.

                 if (llr > 0) {
                    rl = cpr - cp;
                 } else {
                    rl = ll;
                 }

                 if (rl == 1) {
                    f.write(RLONEB);
                    f.write(c);
                 } else {
                    f.write(RLUNCS);
                    f.write(rl - 1);
                    for (llr = 0; llr < rl; llr++) {
                       c = buf[cp + llr];
                       f.write(c);
                    }
                 }
                 cp += rl;
                 cpi += rl;
                 ll -= rl;
              }
           }
        }
    }

    //  Rule generation using rule function

    private final void genRule(OutputStream f) throws IOException {
        int i, j, k, l, m;
        byte [] thispage = null;
        byte [][] pagebuf = null;

        if (COMPRESS) {
            thispage = new byte[256];
            pagebuf = new byte[256][];
        } else {
            f.write(RLUNCOMP);
        }

        jcruleModes();                //  Allow rule to specify modes
        for (i = 0; i < 256 && !didError; i++) {
           for (j = 0; j < 256 && !didError; j++) {

              if (worldtype == 12 || worldtype == 13) {

                 // It's a user own-code rule

                 m = (i << 8) | j;
                 
                 /* Precompute Margolus neighbours in case one of
                    the margolus evaluators is in use. */
                    
                 CENTER = bit(m, 0);        //  Plane 0
                 CW = bit(m, 14);
                 CCW = bit(m, 12);
                 OPP = bit(m, 10);
                 CENTERp = bit(m, 1);       //  Plane 1
                 CWp = bit(m, 15);
                 CCWp = bit(m, 13);
                 OPPp = bit(m, 11);
                    
                 l = jcrule(holdstate = m);
                 if (l < 0 || l > 255) {
                    bomb("Value returned by jcrule function, " +
                        l);
                    bomb(" when called as jcrule(" + m + ")");
                    bomb(" is undefined.  Must be 0 <= value <= 255.");
                    l = 0;
                 }
              } else if (worldtype == 10 || worldtype == 11) {

                 // It's an 8 bit averaging rule

                 m = (i << 8) | j;
                 nw = SUM_4 = SUM_8 = m & 0x7FF;
                 self = i & 1;
                 l = jcrule(holdstate = ((m >> 11) & 0x1F));
                 if (l < 0 || l > 255) {
                    bomb("Value returned by jcrule function, " +
                        l);
                    bomb(" when called as jcrule(" +
                        ((m >> 11) & 0x1F) + ", " + (m & 0x7FF) + ")");
                    bomb(" with SUM_" + (worldtype == 10 ? "8" : "4") +
                            " = " + nw);
                    bomb(" is undefined.  Must be 0 <= value <= 255.");
                    l = 0;
                 }
              } else if ((worldtype >= 0) && ((worldtype & 0xE) != 0)) {

                 // It's a 1D rule

                 self = (i & 0x80) != 0 ? 1 : 0;
                 nw = bit(j, 7); n  = bit(j, 6); ne = bit(j, 5);
                 w  = bit(j, 4); e  = bit(j, 3); sw = bit(j, 2);
                 s  = bit(j, 1); se = bit(j, 0);

                 // Set proxy variables for neighbours

                 //  8 neighbours, 1 bit visible from each

                 N8L4 = nw;
                 N8L3 = n;
                 N8L2 = ne;
                 N8L1 = w;
                 N8R1 = e;
                 N8R2 = sw;
                 N8R3 = s;
                 N8R4 = se;

                 //  4 neighbours, 2 bits visible from each

                 N4L2 = ((nw << 1) | n);
                 N4L1 = ((ne << 1) | w);
                 N4R1 = ((e << 1) | sw);
                 N4R2 = ((s << 1) | se);

                 //  2 neighbours, 4 bits visible from each

                 N2L1 = ((((((nw << 1) | n) << 1) | ne) << 1) | w);
                 N2R1 = ((((((e << 1) | sw) << 1) | s) << 1) | se);

                 l = jcrule(holdstate = ItoU(i));
                 if (l < 0 || l > 255) {
                    bomb("Value returned by jcrule function, " +
                        l);
                    bomb(" when called as jcrule(" + ItoU(i) + ")");
                    bomb(" with self = " + self + " and ");
                    switch (worldtype) {
                        case 2:
                        case 3:
                            bomb("    N8L4 = " + N8L4 + " N8L3 = " + N8L3 + " N8L2 = " + N8L2 + " N8L1 = " + N8L1);
                            bomb("    N8R1 = " + N8R1 + " N8R2 = " + N8R2 + " N8R3 = " + N8R3 + " N8R4 = " + N8R4);
                            break;

                        case 4:
                        case 5:
                            bomb("    N4L2 = " + N4L2 + " N4L1 = " + N4L1);
                            bomb("    N4R1 = " + N4R1 + " N4R2 = " + N4R2);
                            break;

                        case 6:
                        case 7:
                            bomb("    N2L1 = " + N2L1 + " N2R1 = " + N2L1);
                            break;
                    }
                    bomb(" is undefined.  Must be 0 <= value <= 255.");
                    l = 0;
                 }
              } else {

                 // It's a two-dimensional rule

                 nw   = bit(j, 7);
                 n    = bit(j, 6);
                 ne   = bit(j, 5);
                 w    = bit(j, 1);
                 self = (i & 0x80) != 0 ? 1 : 0;
                 e    = bit(j, 0);
                 sw   = bit(j, 4);
                 s    = bit(j, 3);
                 se   = bit(j, 2);

                 SUM_4 = n + w + e + s;
                 SUM_5 = n + w + self + e + s;
                 SUM_8 = nw + n + ne + w + e + sw + s + se;
                 SUM_9 = nw + n + ne + w + self + e + sw + s + se;

                 l = jcrule(holdstate = ItoU(i));
                 if (l < 0 || l > 255) {
                    bomb("Value returned by jcrule function, " +
                        l);
                    bomb(" when called as jcrule(" + ItoU(i) + ")");
                    bomb(" with  nw = " + nw + " n = " + n + "   ne = " + ne);
                    bomb(" with  w  = " + w + " self = " + self + " e = " + e);
                    bomb(" with  sw = " + sw + " s = " + s + "   se = " + se);
                    bomb(" is undefined.  Must be 0 <= value <= 255.");
                    l = 0;
                 }
              }

              // Output with internal bit ordering

              if (COMPRESS) {
                  thispage[j] = (byte) UtoI(l);
              } else {
                  f.write(UtoI(l));
              }
           }

           if (COMPRESS) {

              /* If we're compressing, try to find an economical way to
                 output the current page.

                 Step 1:  See if it's the same as a previously output
                          page.  If so, just copy it.  */

              for (k = 0; k < i; k++) {
                 if (pagebuf[k] != null) {
                    for (l = 0; l < 256; l++) {
                       if (thispage[l] != pagebuf[k][l]) {
                          l = -1;
                          break;
                       }
                    }

                    if (l > 0) {
                       /* Aha!  This page is a duplicate.  Emit a copy page
                          instruction and set the page table pointer cell
                          for this page to NULL so subsequent pages don't
                          look at it for a prototype. */
                       pagebuf[i] = null;
                       f.write(RLCOPYB); // Copy page instruction
                       f.write(k);    // Page index to copy
                       k = -1;        // Indicate duplicate found
                       break;
                    }
                 }
              }

              if (k >= 0) {

                 /* Step 2.  Well, we didn't find a duplicate of this
                             page.  Output the page as a run-length
                             encoded stream, and save a copy of it in
                             case it's a duplicate of another page we
                             encounter later.  */

                 pagebuf[i] = new byte[256];
                 System.arraycopy(thispage, 0, pagebuf[i], 0, 256);
                 pagerun(thispage, f);
              }
           }

// System.out.print("Write page " + i + "\r");
        }
// System.out.println();
        appendModes(f);
    }

    //  Utility function to edit texture specification

    private static final String editTexture(String which, int n, int b) {
        if (n < 0 || b < 0) {
            return which + ": (none)";
        }
        return which + ": " + n + " bit" + (n == 1 ? "" : "s") + " starting at bit " + b;
    }

    //  Print rule parameters

    void Print() {
        String s;

        System.out.println("World type: " + worldtype);
        System.out.println("Random density: " + randdens);
        System.out.println("Auxiliary plane: " + auxplane);
        System.out.println("Texture:");
        System.out.println(editTexture("    Horizontal", texthn, texthb));
        System.out.println(editTexture("      Vertical", textvn, textvb));
        System.out.println(editTexture("      Temporal", tempn, tempb));
        System.out.println(editTexture("        Random", randn, randb));
        s = editTexture("   Random seed", rseedn, rseedb);
        if (!(rseedn < 0 || rseedb < 0)) {
            s += " with density " + rseedp;
        }
        System.out.println(s);
        System.out.println("Requests:");
        System.out.println("     Pattern: " +
                           (patreq.length() > 0 ? patreq : "(none)"));
        System.out.println("     Palette: " +
                           (palreq.length() > 0 ? palreq : "(none)"));
        System.out.println("    Own code: " +
                           (ocodereq.length() > 0 ? ocodereq : "(none)"));
    }

    //  CKTEXT  --  Check texture specification

    private final boolean cktext(String which, String prefix, int hb, int hn) {
        if (hn == -1 && hb == -1) {
           return false;
        }

        if (hn != -1 && hb == -1) {
           bomb("Bad " + which + ": " +
               prefix + "n set and " + prefix + "b unspecified.");
           return false;
        }
        if (hb != -1 && hn == -1) {
           bomb("Bad " + which + ": " +
              prefix + "b set and " + prefix + "n unspecified.");
           return false;
        }
        if (hn != -1) {
           if (hn < 1 || hn > 7) {
              bomb("Bad " + which + ": " +
                 prefix + "n out of range.");
              return false;
           } else {
              if (hb < 0 || hb > 7) {
                 bomb("Bad " + which + ": " +
                     prefix + "b  out of range.");
                 return false;
              } else {
                 if ((hb + hn) > 8) {
                    bomb("Bad " + which + ": " +
                       prefix + " + " + prefix + " > 8.");
                    return false;
                 }
              }
           }
        }
        return true;
    }

    //  Output a request string in the proper format

    private static final void outRString(OutputStream f, byte req, String s) throws IOException {
        byte[] b = new byte[s.length()];

        f.write(req);
        f.write(s.length() + 1);
        //s.getBytes(0, s.length(), b, 0);
        b = s.getBytes("UTF-8");
        f.write(b);
        f.write(0);
    }

    //  Append mode requests to end of rule file

    private final void appendModes(OutputStream f) throws IOException {

        // Output requested horizontal texture

        if (cktext("horizontal texture", "texth", texthb, texthn)) {
           f.write(RSHTEXT);
           f.write(texthb);
           f.write(texthn);
        }

        // Output requested vertical texture

        if (cktext("vertical texture", "textv", textvb, textvn)) {
           f.write(RSVTEXT);
           f.write(textvb);
           f.write(textvn);
        }

        // Output requested random input

        if (cktext("random input", "rand", randb, randn)) {
           f.write(RSRAND);
           f.write(randb);
           f.write(randn);
        }

        // Output requested initial random seed

        if (cktext("initial random seed", "rseed", rseedb, rseedn)) {
           f.write(RSRSEED);
           f.write(rseedb);
           f.write(rseedn);
           f.write(rseedp);
        }

        // Output requested pattern

        if (patreq.length() > 0) {
           outRString(f, RSPAT, patreq);
        }

        // Output requested palette file

        if (palreq.length() > 0) {
           outRString(f, RSPAL, palreq);
        }

        // Output requested user own code file

        if (ocodereq.length() > 0) {
           outRString(f, RSOCODE, ocodereq);
        }

        f.write(RLEND);
        f.write(worldtype);
        f.write(randdens);
        f.write(auxplane);
    }

    //  Generate rule file

    void generateRuleFile(String fileName) {
        if (fileName.length() < 3 ||
            !(fileName.substring(fileName.length() - 3).equalsIgnoreCase(".jc"))) {
            fileName += ".jc";
        }
        try {
            OutputStream f = new FileOutputStream(fileName);

            genRule(f);
            f.close();
        } catch (IOException e) {
            bomb("Error writing rule file " + fileName);
        }
    }
}
