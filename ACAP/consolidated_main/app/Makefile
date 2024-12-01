PROG1   = alarm_identifier
OBJS1   = $(PROG1).c
PROGS   = $(PROG1)
DEBUG_DIR = debug

# Add necessary libraries to PKGS
PKGS = mdb jansson glib-2.0 gio-2.0

CFLAGS += $(shell PKG_CONFIG_PATH=$(PKG_CONFIG_PATH) pkg-config --cflags $(PKGS))
LDLIBS += $(shell PKG_CONFIG_PATH=$(PKG_CONFIG_PATH) pkg-config --libs $(PKGS))

# If pkg-config doesn't work for a library, add it manually
LDLIBS += -lcurl

# Compiler flags
CFLAGS += \
    -Wall \
    -Wextra \
    -Wpedantic \
    -Wmissing-prototypes \
    -Wstrict-prototypes \
    -Wfloat-equal \
    -Winline \
    -Wbad-function-cast \
    -Wstack-protector \
    -Wpointer-arith \
    -Werror

CFLAGS_DEBUG = -g3 -O0

all: $(PROGS)

$(PROG1): $(OBJS1)
	# Create debug directory and build binary with debug symbols
	install -d $(DEBUG_DIR)

	$(CC) $^ $(CFLAGS) $(CFLAGS_DEBUG) $(LIBS) $(LDFLAGS) $(LDLIBS) -o $(DEBUG_DIR)/$@
	cp $(DEBUG_DIR)/$@ .
	$(STRIP) $@

clean:
	rm -rf $(PROGS) $(DEBUG_DIR) *.o *.eap* *_LICENSE.txt package.conf* param.conf tmp*
