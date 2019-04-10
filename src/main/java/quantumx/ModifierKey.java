package quantumx;

import javolution.io.Struct;

public class ModifierKey extends Struct {
    public final Unsigned8 map = new Unsigned8();
    public final Unsigned8 stickyThreshold = new Unsigned8();
}
