#include <stdio.h>
#include "../hid.h"
#include <unistd.h>

int main(int argc, char** argv) {
  rawhid_open(10, 0x16c0, 0x27db, -1, -1);
  while (1) {
    //char* devices[10];
    //get_devices(devices, 10);
    char buf[64];

    int r = rawhid_recv("341913600", CONSOLE, buf, 64, 200);
    if (r > 0) {
        printf("%s", buf);
    }
    //printf("%d received.\n", r);
    //    if (r == -1) {
    //        sleep(1);
    //    }

  }
  return 0;
}

