package quantumx;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Random;

public class HidConnection {
    private static int MAX_BODY_SIZE = 2048;
    private static HidConnection _instance;
    public synchronized static HidConnection getInstance() {
        if (_instance == null) {
            _instance = new HidConnection();
        }
        return _instance;
    }
    private HidConnection() {
        open();
    }
    public native synchronized boolean open();
    public native String[] getDevices();
    private native byte[] receiveMessage(String deviceId, int timeout);
    private native boolean sendMessage(String deviceId, byte[] msg, int timeout);

    public synchronized byte[] sendRequest(String deviceId, byte[] request, int timeout) throws NoResponseException {
        System.err.println("request size " + request.length);
        int reportSize = 64;
        int messageId = new Random(System.currentTimeMillis()).nextInt(65536);
        int messageSize = request.length + 2;
        if (request.length > MAX_BODY_SIZE) {
            throw new IllegalArgumentException("Max request size exceeded");
        }
        ByteBuffer messageBuf = ByteBuffer.allocate(messageSize);
        messageBuf.order(ByteOrder.LITTLE_ENDIAN);
        messageBuf.putShort((short)request.length);
        messageBuf.put(request);
        byte[] messageBytes = messageBuf.array();
        int chunkSize = reportSize - 3;
        int numChunks = (messageSize - 1) / chunkSize + 1;
        for (byte seq = 0; seq < numChunks; seq++) {
            ByteBuffer buffer = ByteBuffer.allocate(reportSize);
            buffer.order(ByteOrder.LITTLE_ENDIAN);
            buffer.putShort((short)messageId);
            buffer.put(seq);
            buffer.put(messageBytes, seq * chunkSize, Math.min(messageSize - seq * chunkSize, chunkSize));
            boolean rc = sendMessage(deviceId, buffer.array(), 100);
            if (!rc) {
                throw new NoResponseException();
            }
        }

        while (true) {
            byte[] buf = receiveMessage(deviceId, timeout);
            if (buf == null) {
                return null;
            }
            int responseId = Byte.toUnsignedInt(buf[0]) + 256*Byte.toUnsignedInt(buf[1]);
            if (responseId != messageId) {
                continue;
            }

            int expectedSeq = 0;
            int seq = Byte.toUnsignedInt(buf[2]);
            if (expectedSeq != seq) {
                return null;
            }

            int bodySize = Byte.toUnsignedInt(buf[3]) + 256*Byte.toUnsignedInt(buf[4]);
            byte[] result = new byte[bodySize];
            int resPos = 0;
            if (bodySize > MAX_BODY_SIZE) {
                return null;
            }

            if (bodySize <= 59) {
                System.arraycopy(buf, 5, result, resPos, bodySize);
                return result;
            } else {
                System.arraycopy(buf, 5, result, resPos, 59);
                int remaining = bodySize - 59;
                resPos += 59;
                expectedSeq += 1;
                while (remaining > 0) {
                    buf = receiveMessage(deviceId, timeout);

                    if (buf == null) {
                        return null;
                    }
                    responseId = Byte.toUnsignedInt(buf[0]) + 256*Byte.toUnsignedInt(buf[1]);
                    if (responseId != messageId) {
                        continue;
                    }

                    seq = Byte.toUnsignedInt(buf[2]);
                    if (expectedSeq != seq) {
                        return null;
                    }
                    expectedSeq += 1;
                    if (remaining <= 61) {
                        System.arraycopy(buf, 3, result, resPos, remaining);
                        return result;
                    } else {
                        System.arraycopy(buf, 3, result, resPos, 61);
                        resPos += 61;
                        remaining -= 61;
                    }
                }
                return null;
            }

        }
    }

}
