package quantumx;

import org.junit.Test;

public class TestConnection {
    @Test
    public void testConnection() throws InterruptedException {
        System.loadLibrary("connection");
        HidConnection connection = HidConnection.getInstance();
        connection.open();
        while (true) {
            System.err.println("scan");
            for (String c : connection.getDevices()) {
                System.err.println(c);
            }
            Thread.sleep(2000);
        }
    }
}
