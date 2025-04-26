    /*

        3 bit parity rule for von Neumann neighbourhood implemented
        with the VONN3 own-code evaluator.

    */

    rule.worldtype = 13;         // 2D torus world
    rule.patreq = "square";
    rule.ocodereq = "vonn3";

    function vonpar(oldstate) {
        return (oldstate & 7) ^
               ((oldstate >> 3) & 7) ^
               ((oldstate >> 6) & 7) ^
               ((oldstate >> 9) & 7);
    }
