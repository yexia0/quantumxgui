#define COMMAND_USAGE_PAGE 0xFF11
#define COMMAND_USAGE 0x2509
#define CONSOLE_USAGE_PAGE 0xFF31
#define CONSOLE_USAGE 0x0074

typedef enum Channel {
    COMMAND,
    CONSOLE
} Channel;

void rawhid_loop_forever();
int rawhid_open(int max, int vid, int pid, int usage_page, int usage);
int rawhid_recv(const char *device_id, Channel channel, void *buf, int len, int timeout);
int rawhid_send(const char *device_id, Channel channel, void *buf, int len, int timeout);
int get_devices(const char** buf, int limit);
void rawhid_close(int num);

