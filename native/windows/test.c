#include <stdio.h>
#include <windows.h>
#include "../hid.h"

void main() {
	int r = rawhid_open(5, 0x16C0, 0x0480, 0xFFAB, 0x0200);
	Sleep(5000);
	rawhid_open(5, 0x16C0, 0x0480, 0xFFAB, 0x0200);
	printf("hello world: %d\n", r);
}