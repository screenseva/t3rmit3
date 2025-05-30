    /*
                  Chou-Reggia Loop

        We use the vonn3 evaluator, which provides us the
        states of our von Neumann neighbours in oldstate as:

            C C C C N N N W   W W E E E S S S


    */

    rule.worldtype = 13;         // 2D torus world
    rule.patreq = "choureg";
    rule.palreq = "choureg";
    rule.ocodereq = "vonn3";

    /*  We compute the lookup table and hide it in rule.byl
        so we don't need to compute it on every invocation
        of the rule function.  */
    rule.byl = new Object();

    /*  The lut_in array encodes the transition rules
        as 24 bit hexadecimal numbers in which the nybbles
        have the following meaning:

            C N E S W C'

        Each entry represents four actual entries in the lookup
        table, generated by rotational symmetry within the von
        Neumann neighbourhood.  Thus, an entry of:

            C N E S W C'

        is shorthand for the four entries:

            C N E S W C'
            C E S W N C'
            C S W N E C'
            C W N E S C'

        where C is the old state of the centre cell and C' is its
        new value.  The unpacking and mirror transform expansion
        into the lut_v3 array is handled by the code below
        the table.  */

    rule.byl.lut_in = [
        0x000000, 0x000200, 0x001000, 0x030000, 0x000220,
        0x200323, 0x202102, 0x123002, 0x322011, 0x200035,
        0x135022, 0x300121, 0x050004, 0x000534, 0x500011,
        0x040000, 0x024000, 0x211022, 0x104232, 0x144422,
        0x410004, 0x040044, 0x400114, 0x424000, 0x440040,
        0x404220, 0x440422, 0x204212, 0x222033, 0x244422,
        0x202033, 0x200022, 0x133022, 0x000330, 0x302011,
        0x000110, 0x105022, 0x004220, 0x201022, 0x404200,
        0x103022, 0x004203, 0x404232, 0x304201, 0x232033,
        0x003335, 0x153020, 0x312011, 0x501110, 0x105232,
        0x001020, 0x042020, 0x400000, 0x002030, 0x002020,
        0x003200, 0x300202, 0x230323, 0x003030, 0x001010,
        0x004030, 0x004010, 0x034200, 0x002430, 0x030040
    ];

    //  Construct lookup table, expanding and applying symmetry

    rule.byl.lut_v3 = new Array(1 << 16);
    rule.byl.lut_v3.fill(0);

    //  Example                  N   E   S   W
    rule.byl.osidx = function(c, n1, n2, n3, n4) {
        return (c  << 12) |
               (n1 <<  9) |
               (n2 <<  3) |
               (n4 <<  6) |
                n3;
    };

    for (var i = 0; i < rule.byl.lut_in.length; i++) {
        /*  Transform cell states from table entry into
            vonn3 packed table index.  */
        var t = rule.byl.lut_in[i];
        var tC  = (t >> 20),
            tN  = (t >> 16) & 7,
            tE  = (t >> 12) & 7,
            tS  = (t >>  8) & 7,
            tW  = (t >>  4) & 7,
            tCp =  t        & 0xF;

        /*  Now create four lookup table entries, all
            yielding the same tCp new state, with the
            four rotations of the specified neighbour
            cell states.  (Note that in some cases the
            rotations will be degenerate and set the same
            lookup table entry; no harm done.)  */

        rule.byl.lut_v3[rule.byl.osidx(tC, tN, tE, tS, tW)] =
        rule.byl.lut_v3[rule.byl.osidx(tC, tE, tS, tW, tN)] =
        rule.byl.lut_v3[rule.byl.osidx(tC, tS, tW, tN, tE)] =
        rule.byl.lut_v3[rule.byl.osidx(tC, tW, tN, tE, tS)] = tCp;
    }

    function choureg(oldstate) {

        //  Extract self and neighbours from oldstate
        var N = (oldstate >> 9)  & 7,
            E = (oldstate >> 3)  & 7,
            S =  oldstate        & 7,
            W = (oldstate >> 6)  & 7,
            C = (oldstate >> 12) & 7;

        return rule.byl.lut_v3[oldstate];
    }
