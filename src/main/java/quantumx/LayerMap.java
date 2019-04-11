package quantumx;

import javolution.io.Struct;

public class LayerMap extends Struct {
    public LayerMap(int numLayers, int numKeys) {
        map = array(new KeyFunction[numLayers][numKeys]);
    }

    public final KeyFunction[][] map;
}
