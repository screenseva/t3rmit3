/*

        Laplace Rug rule

        This rule invokes the lapinc.jco own code file to solve the
        Laplace equation in plane.  Since lapinc.jco doesn't use the
        lookup table at all, this rule simply invokes the own code
        and generates an all zero lookup table.  Lapinc computes a
        weighted average of EveryCell's 8 neighbors and adds 1.  The
        average has the form (4(n+e+s+w)+(nw+ne+se+sw))/20.

*/

class Ruglap extends ruletable {
    void jcruleModes() {
        setWorld(12);
        setOwnCodeRequest("lapinc");
    }

    int jcrule(int oldstate) {
        return 0;
    }
}

public class ruglap {
    public static void main(String args[]) {
        (new Ruglap()).generateRuleFile("ruglap");
    }
}
