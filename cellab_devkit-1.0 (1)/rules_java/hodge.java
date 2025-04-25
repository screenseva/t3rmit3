/*
*/

class Hodge extends ruletable {
    void jcruleModes() {
        setWorld(10);
    }

    int jcrule(int oldstate) {
        int temp = 0;

        if (oldstate == 0) {
            if (SUM_8 < 5) {
                temp = 0;
            } else {
                if (SUM_8 < 100) {
                    temp = 2;
                } else {
                    temp = 3;
                }
            }
        } else if (oldstate > 0 && oldstate < 31) {
            temp = ((SUM_8 >> 3) + 5) & 255;
        }
        if (temp > 31) {
            temp = 31;
        }
        if (oldstate == 31) {
            temp = 0;
        }
        return temp;
    }
}

public class hodge {
    public static void main(String args[]) {
        (new Hodge()).generateRuleFile("hodge");
    }
}
