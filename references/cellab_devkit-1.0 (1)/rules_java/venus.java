/*

                                Venus
                            by Rudy Rucker

        Start this rule on a random pattern.

*/

class Venus extends ruletable {

    int jcrule(int oldstate) {
        int r = 0;

        switch (oldstate & 3) {
            case 0:
                r = 2 * (nw ^ sw) + w;
                break;

            case 1:
                r = 2 * (nw ^ ne) + n;
                break;

            case 2:
                r = 2 * (ne ^ se) + e;
                break;

            case 3:
                r = 2 * (se ^ sw) + s;
                break;
        }
        return r;
    }
}

public class venus {
    public static void main(String args[]) {
        (new Venus()).generateRuleFile("venus");
    }
}
