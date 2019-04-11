package quantumx;

import org.junit.Test;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;

public class TestMain {
    @Test
    public void test1() {
        int numLayers = 3;
        int numKeys = 3;
        LayerMap layerMap = new LayerMap(numLayers, numKeys);
        System.err.println(layerMap.size());
        //System.err.println(new ComboKey().size());
        //System.err.println(new MacroAddr().size());
        //System.err.println(new NopParam().size());
        //System.err.println(new LayerKey().size());
        //System.err.println(new FunctionValue().size());
        layerMap.setByteBuffer(ByteBuffer.allocate(layerMap.size()), 0);
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

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        int offset = 0;

        for (int i = 0; i < numLayers; i++) {
            for (int j = 0; j < numKeys; j++) {
                KeyFunction keyFunction = layerMap.map[i][j];
                if (keyFunction.type.get().equals(FunctionType.MACRO)) {
                    String s = keyFunction.value.macroAddr.setOffsetAndReturnString(offset);
                    offset += s.length() + 1;
                    try {
                        byteArrayOutputStream.write(s.getBytes());
                        byteArrayOutputStream.write(0);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }

        print(layerMap.getByteBuffer().array());
        print(byteArrayOutputStream.toByteArray());
    }

    private void print(byte[] byteArray) {
        for (byte b : byteArray) {
            System.err.printf("0x%02x ", b);
        }
        System.err.println();
    }
}
