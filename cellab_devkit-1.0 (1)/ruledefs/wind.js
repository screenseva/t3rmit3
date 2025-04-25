    /*

        Wind tunnel skeleton rule
        
        No lookup table is used.

    */

    rule.worldtype = 12;        // 2D open world, user evaluator
    rule.patreq = "wind";
    rule.palreq = "wind";
    rule.ocodereq = "cfd";

    function owncode(oldstate) {
        return 0;               // No lookup table
    }
