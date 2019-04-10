package quantumx;

import javolution.io.Struct;

public class LayerKey extends Struct {
    public final Unsigned8 layer = new Unsigned8();
    public final Unsigned8 stickyThreshold = new Unsigned8();
}
