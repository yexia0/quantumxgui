int rawhid_open(int max, int vid, int pid, int usage_page, int usage);
int rawhid_recv(const char *device_id, void *buf, int len, int timeout);
int rawhid_send(const char *device_id, void *buf, int len, int timeout);
int get_devices(const char** buf, int limit);
void rawhid_close(int num);

