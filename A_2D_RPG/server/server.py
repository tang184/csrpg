#!/usr/bin/env python
import threading
import asyncio
import datetime
import random
import websockets

class Client_holder:
    def __init__(self, server, websocket, recv_func, disc_func):
        self.server = server
        self.socket = websocket
        self.recv_func = recv_func
        self.disc_func = disc_func
        self.exist = True

    def send(self, data):
        if self.exist:
            asyncio.set_event_loop(asyncio.new_event_loop())
            asyncio.get_event_loop().run_until_complete(self.send_mid(data))
        else:
            self.disc_func(self)
    async def send_mid(self, data):
        await self.socket.send(data)

    def recv(self):
        data = self.socket.recv()
        return data
    
    
class Server(threading.Thread):
    def __init__(self, ip, port, recv_func, conn_func, disc_func):
        threading.Thread.__init__(self)
        self.ip = ip
        self.port = port
        self.recv_func = recv_func
        self.conn_func = conn_func
        self.disc_func = disc_func
        self.clients = []

    def run(self):
        self.server = websockets.serve(self.connect, self.ip, self.port)
        asyncio.set_event_loop(asyncio.new_event_loop())
        asyncio.get_event_loop().run_until_complete(self.server)
        asyncio.get_event_loop().run_forever()

    async def connect(self, websocket, path):
        client = Client_holder(self, websocket, self.recv_func, self.disc_func)
        self.clients.append(client)
        self.conn_func(client)
        try:
            while client.exist:
                data = await client.recv()
                client.recv_func(data, client)
        except:
            client.exist = False
