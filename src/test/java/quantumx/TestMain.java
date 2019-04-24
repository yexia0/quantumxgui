package quantumx;

import org.junit.Test;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class TestMain {
    @Test
    public void test1() {
        int numLayers = 3;
        int numKeys = 3;
        LayerMap layerMap = new LayerMap();
        layerMap.setNumLayers(3);
        layerMap.setNumKeys(3);
        layerMap.setModelId((short)5);
        layerMap.map[1][2].type.set(FunctionType.NORMAL);
        layerMap.map[1][2].value.normalKey.id.set((short)0x88);
        layerMap.map[0][0].type.set(FunctionType.MODIFIER);
        layerMap.map[0][0].value.modifierKey.map.set((short)0x01);
        layerMap.map[0][0].value.modifierKey.stickyThreshold.set((short)200);
        layerMap.map[0][1].type.set(FunctionType.MACRO);
        layerMap.map[0][1].value.macroAddr.setS("hello");
        layerMap.map[0][2].type.set(FunctionType.MACRO);
        layerMap.map[0][2].value.macroAddr.setS("abc");
        layerMap.map[1][0].type.set(FunctionType.MACRO);
        layerMap.map[1][0].value.macroAddr.setS("aaabbbccc");



        byte[] bytes = layerMap.toBytes();
        print(bytes);
        LayerMap newMap = LayerMap.fromBytes(bytes);
        System.err.println(newMap.map[0][2].value.macroAddr.getS());


    }

    private void print(byte[] byteArray) {
        for (byte b : byteArray) {
            System.err.printf("0x%02x ", b);
        }
        System.err.println();
    }
}
