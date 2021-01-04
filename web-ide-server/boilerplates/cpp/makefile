CC=g++
FLAGES=-Wall -c
CFILES:=$(shell find . -type f -printf "%T@ %p\n" | sort -nr | cut -d\  -f2- | grep .c)
OBJS:=$(CFILES:%.c=%.o)


all:$(OBJS)
	$(CC) $(OBJS) -o main

$(OBJS):$(CFILES)
	$(CC) -c $< -o $@
