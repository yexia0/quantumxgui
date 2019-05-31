package quantumx;

import java.util.Arrays;

public class ConsoleLogThread extends Thread {
    private String deviceId;
    public ConsoleLogThread(String deviceId) {
        this.deviceId = deviceId;
    }
    @Override
    public void run() {
        HidConnection hidConnection = HidConnection.getInstance();
        while (true) {
            try {
                byte[] r = hidConnection.getConsoleLog(deviceId, 200);
                if (r != null) {
                    System.err.print(toString(r));
                }
            } catch (Exception e) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e2) {
                    // pass
                }
            }
        }
    }

    private String toString(byte[] bArray) {
        int i = 0;
        while (i < bArray.length && bArray[i] != 0) {
            i++;
        }
        return new String(Arrays.copyOfRange(bArray, 0, i));
    }
}
