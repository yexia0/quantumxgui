package quantumx;

public class HidConnection {
    public native String[] open();

    public native byte[] receiveMessage(short modelId, int timeout);
    public native boolean sendMessage(short modelId, byte[] msg, int timeout);
}
