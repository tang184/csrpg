from geometry import *

class Player:
    def __init__(self, system, client):
        self.system = system

        system.players_locker.acquire()
        self.id = system.next_player
        system.next_player = system.next_player + 1
        system.players[self.id] = self
        system.players_locker.release()
        
        self.client = client
        client.player = self

        self.perspective = []
        self.position = Point(0, 0, 0)
        self.velocity = Point(0, 0, 0)
        self.speed = 2
        self.score = 0
        self.rotate_x = 0
        self.rotate_y = 0

    def on_remove(self):
        self.system.players_locker.acquire()
        del self.system.players[self.id]
        self.system.players_locker.release()
        
    def move_dir(self, direction):
        self.velocity = direction.get_unit() * self.speed    

    def update(self, delta_time):
        
        current_cube = self.current_cube()
        self.position = self.position + (self.velocity * delta_time)

        bound = 0.2
        m = self.system.map
        if (m.bits[current_cube[3]][current_cube[2]][current_cube[1]][current_cube[0] - 1] == 1) and (m.touch([self.position.x, self.position.y, self.position.z, self.w], [current_cube[0] - 1, current_cube[1], current_cube[2], current_cube[3]], bound)):
            self.position.x = current_cube[0] - (0.5 - bound)
        if (m.bits[current_cube[3]][current_cube[2]][current_cube[1]][current_cube[0] + 1] == 1) and (m.touch([self.position.x, self.position.y, self.position.z, self.w], [current_cube[0] + 1, current_cube[1], current_cube[2], current_cube[3]], bound)):
            self.position.x = current_cube[0] + (0.5 - bound)
        if (m.bits[current_cube[3]][current_cube[2]][current_cube[1] - 1][current_cube[0]] == 1) and (m.touch([self.position.x, self.position.y, self.position.z, self.w], [current_cube[0], current_cube[1] - 1, current_cube[2], current_cube[3]], bound)):
            self.position.y = current_cube[1] - (0.5 - bound)
        if (m.bits[current_cube[3]][current_cube[2]][current_cube[1] + 1][current_cube[0]] == 1) and (m.touch([self.position.x, self.position.y, self.position.z, self.w], [current_cube[0], current_cube[1] + 1, current_cube[2], current_cube[3]], bound)):
            self.position.y = current_cube[1] + (0.5 - bound)
        if (m.bits[current_cube[3]][current_cube[2] - 1][current_cube[1]][current_cube[0]] == 1) and (m.touch([self.position.x, self.position.y, self.position.z, self.w], [current_cube[0], current_cube[1], current_cube[2] - 1, current_cube[3]], bound)):
            self.position.z = current_cube[2] - (0.5 - bound)
        if (m.bits[current_cube[3]][current_cube[2] + 1][current_cube[1]][current_cube[0]] == 1) and (m.touch([self.position.x, self.position.y, self.position.z, self.w], [current_cube[0], current_cube[1], current_cube[2] + 1, current_cube[3]], bound)):
            self.position.z = current_cube[2] + (0.5 - bound)

        
        if (m.touch([self.position.x, self.position.y, self.position.z, self.w], m.gp, bound)):
            self.system.end_level = True
            self.score = self.score + 1

    def pack_self(self):
        d = {}
        d["id"] = self.id
        d["p"] = str(self.position)
        d["v"] = str(self.velocity)
        d["s"] = self.score
        return d

    def pack_data(self):
        add_id = []
        send_id = []
        remove_id = []
        
        for i in self.system.players:
            if i in self.perspective:
                send_id.append(i)
            else:
                add_id.append(i)
                
        for i in add_id:
            self.perspective.append(i)
                
        for i in self.perspective:
            if not (i in self.system.players):
                remove_id.append(i)
                
        for i in remove_id:
            self.perspective.remove(i)
            
        add_c = {}
        for i in add_id:
            player = self.system.players[i]
            player_d = player.pack_self()
            #char_d["image"] = char.image
            add_c[i.__str__()] = player_d
            
        send_c = {}
        for i in send_id:
            player = self.system.players[i]
            player_d = player.pack_self()
            send_c[i.__str__()] = player_d
            
        remove_c = {}
        for i in remove_id:
            player_d = {"id": i}
            remove_c[i.__str__()] = player_d

        total_d = {"a":add_c, "s":send_c, "r":remove_c}
        return total_d


    def send_map(self):
        m = self.system.map
        md = m.d
        
        self.position = Point(m.sp[0], m.sp[1], m.sp[2])
        self.w = m.sp[3]
        
        pd = {"cmd":"mp", "mp":md}
        data = pd.__str__().replace("\'", "\"").replace(" ", "")
        self.client.send(data)

    def current_cube(self):
        x = round(self.position.x)
        y = round(self.position.y)
        z = round(self.position.z)
        w = round(self.w)
        return [x, y, z, w]
