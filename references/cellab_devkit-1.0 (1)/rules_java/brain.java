/*      Brian's Brain, discovered by Brian Silverman.

        (Toffoli & Margolus, section 6.1, page 47)

        Each cell has three states, though only one bit of the state
        is used to determine whether neighbours are on or off.  The
        rule is as follows:

        Old cell state       New state

          0 (Ready)             1 if exactly 2 neighbours in state 1,
                                0 otherwise.
          1 (Firing)            2
          2 (Refractory)        0

    This can be though of as simulating the action of neurons which
    are insensitive to stimuli for some time after they fire.
*/

class Brain extends ruletable {

    void jcruleModes() {
    }

    int jcrule(int oldstate) {
        int count = nw + n + ne + w + self + e + sw + s + se;

        if (oldstate == 2)         // If in refractory state...
           return 0;               // ...become ready.
        if (oldstate == 1)         // If firing...
           return 2;               // ...go to refractory state.
        return count == 2 ? 1 : 0; /* If ready, fire if precisely
                                      two neighbours are firing. */
    }
}

public class brain {
    public static void main(String args[]) {
        (new Brain()).generateRuleFile("brain");
    }
}
