package quantumx;

import org.junit.Test;

public class TestConnection {
    @Test
    public void testConnection() throws InterruptedException {
        System.loadLibrary("connection");
        HidConnection connection = HidConnection.getInstance();
        //connection.open();
        while (true) {
            System.err.println("scan");
            Thread.sleep(1000);
            for (String c : connection.getAllDevices()) {
                (new ConsoleLogThread(c)).start();
                System.err.println(c);
            }
            //while (true) {
            //    connection.getAllDevices();
            //}
Thread.sleep(10000000);
        }
    }

    @Test
    public void testKeyboardName() {
        System.loadLibrary("connection");
        ConfigModel configModel = new ConfigModel(null);
        //configModel.setKeyboardName("hello");
        //System.err.println(configModel.getKeyboardName());
    }

}
