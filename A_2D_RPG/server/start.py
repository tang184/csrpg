import server
from geometry import *
import time
import datasender

class Character:
    def __init__(self, system, player, position, velocity, image_files):
        self.system = system
        
        self.id = system.next_character
        system.next_character = system.next_character + 1
        system.characters[self.id] = self

        self.added = False
        self.removing = False
        self.removed = False

        self.player = player
        self.position = position
        self.velocity = velocity
        self.image_files = image_files

    def update(self, delta_time):
        self.position = self.position + (self.velocity * delta_time)
        self.pack()

    def pack(self):
        if (not self.added):
            self.added = True
            self.system.datasender.char_to_add.append(self)
            return
        
        if (self.removing):
            self.system.datasender.char_to_remove.append(self)
            self.removed = True
            return
        
        self.system.datasender.char_to_send.append(self)

class Player:
    def __init__(self, system, client):
        self.system = system
        
        self.id = system.next_player
        system.next_player = system.next_player + 1
        system.players[self.id] = self
        
        self.removing = False
        
        self.client = client
        client.player = self

    def create_char(self):
        files = {}
        files["U"] = "images/characters/hardfake/face_up.png"
        files["D"] = "images/characters/hardfake/face_down.png"
        files["L"] = "images/characters/hardfake/face_left.png"
        files["R"] = "images/characters/hardfake/face_right.png"
        self.char = Character(self.system, self, Point(20, 15), Point(0, 0), files)
        self.char.speed = 1.5
        self.char.image = "images/characters/hardfake/face_down.png"

    def move_dir(self, point):
        if (point.x == 0 and point.y == 0):
            self.char.velocity = Point(0, 0)
        else:
            self.char.velocity = point.get_unit() * self.char.speed
            print("changed velocity")

    def send_basic(self):
        statement = self.system.datasender.pack_all_as_add()
        pd = {"statement":statement, "char_id":self.char.id}
        s = pd.__str__().replace("\'", "\"")
        self.client.send(s)

def recv_func(data, client):
    d = eval(data)
    player = client.player
    if (d["command"] == "move"):
        direction = Point(d["x"], d["y"])
        player.move_dir(direction)

def conn_func(client):
    player = Player(client.server.system, client)
    player.create_char()
    player.send_basic()
    
def disc_func(client):
    client.player.removing = True

class System:
    def __init__(self):
        self.server = server.Server('127.0.0.1', 12306, recv_func, conn_func, disc_func)
        self.server.system = self
        self.players = {}
        self.characters = {}
        self.next_player = 0
        self.next_character = 0
        self.datasender = datasender.Datasender(self)

    def start(self):
        self.server.start()
        self.time = time.time()

        while True:
            curr_time = time.time()
            delta_time = curr_time - self.time
            
            if (delta_time < 0.05):
                time.sleep(0.05 - delta_time)
                curr_time = time.time()
                delta_time = curr_time - self.time
            
            self.time = curr_time
            self.update(delta_time)

    def update(self, delta_time):
        for k in self.characters:
            character = self.characters[k]
            character.update(delta_time)
        statement = self.datasender.pack()
        
        for k in self.players:
            player = self.players[k]
            pd = {"statement":statement, "char_id":player.char.id}
            s = pd.__str__().replace("\'", "\"")
            player.client.send(s)

        new_players = {}
        for k in self.players:
            player = self.players[k]
            if player.removing:
                client = player.client
                client.server.clients.remove(client)
                #del self.characters[player.char.id]
            else:
                new_players[player.id] = player
        self.players = new_players

s = System()
s.start()
