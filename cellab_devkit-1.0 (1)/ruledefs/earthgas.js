    /*

            Diffuse the Earth with Gravity Turned Off
            
    */
    rule.worldtype = 13;
    rule.patreq = "fullearth";
    rule.palreq = "fullearth";
    rule.ocodereq = "randgas";
    
    function earthgas(oldstate,     nw, n  , ne,
                                    w, self, e,
                                    sw, s  , se) {
        return 0;               // Lookup table is not used
    }
