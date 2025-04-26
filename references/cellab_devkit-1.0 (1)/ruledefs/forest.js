    /*

        Skeleton rule for Forest.  This is used only to set the
        world type and load the palette and evaluator.

        No lookup table is used.

    */

    rule.worldtype = 13;        // 2D closed world, user evaluator
    rule.ocodereq = "forest";
    rule.patreq = "zero";
    rule.palreq = "forest";

    function forest(oldstate) {
        return 0;               // No lookup table
    }
