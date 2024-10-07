PROG1	= consolidated_jansson_http
OBJS1	= $(PROG1).c
PROGS	= $(PROG1)
DEBUG_DIR = debug

# Add jansson to the PKGS list
PKGS = mdb jansson

CFLAGS += $(shell PKG_CONFIG_PATH=$(PKG_CONFIG_PATH) pkg-config --cflags $(PKGS))
LDLIBS += $(shell PKG_CONFIG_PATH=$(PKG_CONFIG_PATH) pkg-config --libs $(PKGS))

# If pkg-config doesn't work for jansson, you can add it manually like this:
# LDLIBS += -ljansson
LDLIBS += -lcurl

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
