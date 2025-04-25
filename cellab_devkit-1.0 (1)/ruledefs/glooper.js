    /*

        Skeleton rule for Glooper.  This is used only to set the
        world type and load the pattern, palette, and evaluator.

        No lookup table is used.

    */

    rule.worldtype = 12;        // 2D open world, user evaluator
    rule.ocodereq = "water";
    rule.patreq = "glooper";
    rule.palreq = "glooper";

    function glooper(oldstate) {
        return 0;               // No lookup table
    }
