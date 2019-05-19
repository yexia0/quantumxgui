package quantumx;

public class Utils {
    public static void printByteArray(byte[] arr) {
        for (byte b: arr) {
            System.err.printf("%02x ", b);
        }
        System.err.println();
    }
}
