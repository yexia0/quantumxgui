package quantumx;

import javolution.io.Struct;

public class NopParam extends Struct {
    public final Bool activateUsed = new Bool(1);
    public final Bool consumeOneShot = new Bool(1);
}
