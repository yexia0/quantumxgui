package quantumx;


import com.sun.xml.internal.messaging.saaj.util.ByteOutputStream;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

public class LayerMap {
    private static final short MAX_LAYERS = 10;
    private static final short MAX_KEYS = 150;
    private static final int MAX_BUFFER_SIZE = 2048;

    private short modelId;
    private short numLayers;
    private short numKeys;

    public KeyFunction[][] map;

    public LayerMap() {
        map = new KeyFunction[MAX_LAYERS][MAX_KEYS+ 1];
        for (int i = 0; i < MAX_LAYERS; i++) {
            for (int j = 0; j <= MAX_KEYS; j++) {
                KeyFunction keyFunction = new KeyFunction();
                map[i][j] = keyFunction;
                ByteBuffer byteBuffer = ByteBuffer.allocate(map[i][j].size());
                byteBuffer.order(ByteOrder.LITTLE_ENDIAN);
                map[i][j].setByteBuffer(byteBuffer, 0);
            }
        }
    }
    public int getNumLayers() {
        return numLayers;
    }

    public void setNumLayers(int numLayers) {
        this.numLayers = (short)numLayers;
    }

    public int getNumKeys() {
        return numKeys;
    }

    public void setNumKeys(int numKeys) {
        this.numKeys = (short)numKeys;
    }

    public KeyFunction getMap(int layer, int key) {
        return map[layer][key];
    }

    public void setKey(int layer, int key, KeyFunction keyFunction) {
        this.map[layer][key] = keyFunction;
    }

    public short getModelId() {
        return modelId;
    }

    public void setModelId(short modelId) {
        this.modelId = modelId;
    }

    public byte[] toBytes() {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        short strOffset = 0;

        for (int i = 0; i < numLayers; i++) {
            for (int j = 0; j < numKeys; j++) {
                KeyFunction keyFunction = map[i][j];
                if (keyFunction.type.get().equals(FunctionType.MACRO)) {
                    String s = keyFunction.value.macroAddr.setOffsetAndReturnString(strOffset);
                    strOffset += s.length() + 1;
                    try {
                        byteArrayOutputStream.write(s.getBytes());
                        byteArrayOutputStream.write(0);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }


        int offset = 0;
        ByteBuffer buffer = ByteBuffer.allocate(MAX_BUFFER_SIZE);
        buffer.order(ByteOrder.LITTLE_ENDIAN);

        buffer.putShort(modelId);
        offset += 2;
        buffer.putShort(numLayers);
        buffer.putShort(numKeys);
        offset += 4;
        for (int i = 0; i < numLayers; i++) {
            for (int j = 0; j <= numKeys; j++) {
                buffer.put(map[i][j].getByteBuffer());
                offset += map[i][j].size();
            }
        }



        buffer.putShort(strOffset);
        offset += 2;

        buffer.put(byteArrayOutputStream.toByteArray());

        offset += strOffset;

        byte[] result = new byte[offset];
        System.arraycopy(buffer.array(), 0, result, 0, offset);
        return result;
    }

    public static LayerMap fromBytes(byte[] bytes) {
        LayerMap result = new LayerMap();
        ByteBuffer buffer = ByteBuffer.wrap(bytes);
        buffer.order(ByteOrder.LITTLE_ENDIAN);

        result.modelId = buffer.getShort();
        result.numLayers = buffer.getShort();
        System.err.println(result.numLayers);
        result.numKeys = buffer.getShort();
        System.err.println(result.numKeys);
        if (result.numLayers > MAX_LAYERS) {
            throw new IllegalArgumentException("Invalid layer count");
        }
        if (result.numKeys > MAX_KEYS) {
            throw new IllegalArgumentException("Invalid key count");
        }

        result.map = new KeyFunction[result.numLayers][result.numKeys+1];
        for (int i = 0; i < result.numLayers; i++) {
            for (int j = 0; j <= result.numKeys; j++) {
                result.map[i][j] = new KeyFunction();
                int size = result.map[i][j].size();
                ByteBuffer byteBuffer = ByteBuffer.allocate(size);
                byteBuffer.order(ByteOrder.LITTLE_ENDIAN);
                for (int k = 0; k < size; k++) {
                    byteBuffer.put(buffer.get());
                }
                result.map[i][j].setByteBuffer(byteBuffer, 0);
            }
        }
        int strLength = buffer.getShort();
        byte[] strBytes = new byte[strLength];
        buffer.get(strBytes);
        for (int i = 0; i < result.numLayers; i++) {
            for (int j = 0; j <= result.numKeys; j++) {
                KeyFunction keyFunction = result.map[i][j];
                if (keyFunction.type.get().equals(FunctionType.MACRO)) {
                    int pos = keyFunction.value.macroAddr.offset.get();
                    ByteOutputStream byteOutputStream = new ByteOutputStream();
                    while (true) {
                        byte next = strBytes[pos];
                        if (next != 0) {
                            byteOutputStream.write(next);
                        } else {
                            break;
                        }
                        pos++;
                    }
                    keyFunction.value.macroAddr.setS(byteOutputStream.toString());
                }
            }
        }
        return result;
    }
}
