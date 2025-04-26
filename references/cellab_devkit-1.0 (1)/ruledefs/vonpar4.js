    /*

        Four bit parity rule for von Neumann neighbourhood

        We use the vonn4 evaluator, which provides us the
        states of our von Neumann neighbours in oldstate as:

               CCCC   NNNN WWWW   EEEE SSSS

        Note that the lookup table index is 20 bits.  This rule
        and the vonn4 evaluator use the "auxiliary lookup table"
        mechanism to accommodate the one megabyte lookup table
        it requires.  This rule definition creates the lookup
        table and stores it in rule.program.lookaux, a
        Uint8Array.  The vonn4 evaluator then looks up new
        states in that array rather than the standard 64K lut
        array.

        Since the rule definition function only gets called
        with oldstate from 0x0000 to 0xFFFF, on each call we
        must manually loop from 0 to 0xF over the cell's
        own state, which appears in bits 16-19 of the auxiliary
        lookup table index.

    */

    rule.worldtype = 13;        // 2D torus world
    rule.patreq = "columbia";
    rule.ocodereq = "vonn4";

    rule.program.lutaux = new Uint8Array(new ArrayBuffer(1 << 20));

    function vonpar4(oldstate) {

        //  Peel state of neighbours from oldstate

        var n = (oldstate >> 12) & 0xF,
            w = (oldstate >>  8) & 0xF,
            e = (oldstate >>  4) & 0xF,
            s =  oldstate        & 0xF;

        /*  Now iterate over all of the 16 possible states of
            ourself (which will be passed in the top 4 bits
            of oldstate by the evaluator) and plug the result
            value in the rule.program.lutaux table.  */

        for (var c = 0; c <= 0xF; c++) {
            var lutidx = oldstate | (c << 16);  // Index to auxiliary LUT

            var cprime = n ^ w ^ e ^ s ^ c;     // Parity rule

            rule.program.lutaux[lutidx] = cprime;
        }

        return 0;   // Original 64K lookup table isn't used; zero it out
    }
