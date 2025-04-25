    /*

        Dummy rule definition to invoke user-supplied evaluator.
        No lookup table is used.

    */

    rule.worldtype = 13;         // 2D torus world, user evaluator
    rule.ocodereq = "";         // User will override own code request

    function owncode(oldstate) {
        return 0;               // No lookup table
    }
