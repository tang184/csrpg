import server
from geometry import *
import time

from player import *
from maploader import *

import threading

def recv_func(data, client):
    d = eval(data)
    player = client.player
    
    if (d["command"] == "move"):
        direction = Point(d["x"], d["y"], d["z"])
        player.move_dir(direction)
    
    if (d["command"] == "rotate"):
        player.rotate_x = d["x"]
        player.rotate_y = d["y"]
    

def conn_func(client):
    player = Player(client.server.system, client)
    player.send_map()
    
def disc_func(client):
    player = client.player
    player.on_remove()

class System:
    def __init__(self):
        self.server = server.Server('0.0.0.0', 12315, recv_func, conn_func, disc_func)
        self.server.system = self
        self.players = {}
        self.players_locker = threading.Lock()
        self.next_player = 0
        self.next_character = 0
        self.min_delta_time = 0.03
        self.max_level = 4
        self.end_level = False

    def start(self):
        self.server.start()
        self.time = time.time()
        while True:
            self.current_level = 0
            while self.current_level < self.max_level:
                print("loading level %d" % self.current_level)
                self.map = Map(self, self.current_level)
                
                self.players_locker.acquire()
                for i in self.players:
                    player = self.players[i]
                    player.send_map()
                self.players_locker.release()
                    
                while not self.end_level:
                    curr_time = time.time()
                    delta_time = curr_time - self.time
            
                    if (delta_time < self.min_delta_time):
                        time.sleep(self.min_delta_time - delta_time)
                        curr_time = time.time()
                        delta_time = curr_time - self.time
            
                    self.time = curr_time
                    self.update(delta_time)
                self.current_level = self.current_level + 1
                self.end_level = False

    def update(self, delta_time):
        self.players_locker.acquire()
        for k in self.players:
            players = self.players[k]
            players.update(delta_time)
            
        for k in self.players:
            player = self.players[k]
            statement = player.pack_data()
            pd = {"st":statement, "id":player.id, "cmd":"st"}
            s = pd.__str__().replace("\'", "\"").replace(" ", "")
            player.client.send(s)
        self.players_locker.release()
        
s = System()
s.start()
