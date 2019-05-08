#include <stdint.h>

int rawhid_open(int max, int vid, int pid, int usage_page, int usage);
int rawhid_recv(int model_id, void *buf, int len, int timeout);
int rawhid_send(int model_id, void *buf, int len, int timeout);
int get_models(uint16_t *buf, int limit);
void rawhid_close(int num);

