    /*

        Banks' Computer

        (Toffoli & Margolus, section 5.5, page 42)
        
        We preserve the upper 7 bits of the oldstate to allow
        it to be used to colour tag components.  It has no
        function in the operation of this one bit rule.

    */

    rule.worldtype = 1;
    rule.patreq = "banks";
    rule.palreq = "banks";

    function banks(oldstate,     nw, n  , ne,
                                 w, self, e,
                                 sw, s  , se) {

        var ns = 0;

        switch (n + s + w + e) {

           case 0:
           case 1:
              ns = self;
              break;

           case 2:
              ns = (n == s) ? self : 0;
              break;

           case 3:
           case 4:
              ns = 1;
              break;
        }
        return ns | (oldstate & 0xFE);  // Preserve upper bits for colour tags
}
