/*

        Second-order dynamics: The time tunnel

        (Toffoli & Margolus, section 6.3, page 52)

*/

    rule.worldtype = 1;          // 2D torus world
    rule.patreq = "timetun";
    rule.palreq = "default";


    function timetun(oldstate,     nw, n  , ne,
                                   w, self, e,
                                   sw, s  , se) {
        var ttmap = [ 0, 1, 1, 1, 1, 0 ];
        
        return (ttmap[self + n + s + w + e] ^ ((oldstate >> 1) & 1)) |
                (self << 1);
    }
