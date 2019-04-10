package quantumx;

import javolution.io.Struct;

public class LayerMap extends Struct {
    public final KeyFunction[][] map = array(new KeyFunction[2][3]);
}
