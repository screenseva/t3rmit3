/*

        The Vichniac voting rule with the seven
        extra bits used as memory

*/

class Vote extends ruletable {

    void jcruleModes() {
    }

    int jcrule(int oldstate) {
        int r = 0, NineSum = nw + n + ne + e + se + s + sw + w + self;

        switch (NineSum) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 5:
                r = 0;
                break;

            case 4:
            case 6:
            case 7:
            case 8:
            case 9:
                r = 1;
                break;
        }
        return (self << 1) | r;
    }
}

public class vote {
    public static void main(String args[]) {
        (new Vote()).generateRuleFile("vote");
    }
}
