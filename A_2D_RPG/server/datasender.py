import server
from geometry import *
import time

class Datasender:
    def __init__(self, system):
        self.system = system
        self.old_state = []
        self.char_to_add = []
        self.char_to_send = []
        self.char_to_remove = []

    def pack(self):
        add_d = {}
        for char in self.char_to_add:
            char_d = self.pack_char(char)
            char_d["image"] = char.image
            add_d[char_d["id"].__str__()] = char_d
            
        send_d = {}
        for char in self.char_to_send:
            char_d = self.pack_char(char)
            send_d[char_d["id"].__str__()] = char_d
            
        remove_d = {}
        for char in self.char_to_remove:
            char_d = {"id": char.id}
            remove_d[char_d["id"].__str__()] = char_d

        self.old_state = self.char_to_add + self.char_to_send
        self.char_to_add = []
        self.char_to_send = []
        self.char_to_remove = []
        
        total_d = {"add":add_d, "send":send_d, "remove":remove_d}
        
        return total_d

    def pack_char(self, char):
        d = {}
        d["id"] = char.id
        d["px"] = char.position.x
        d["py"] = char.position.y
        d["vx"] = char.velocity.x
        d["vy"] = char.velocity.y
        return d
    
    def pack_all_as_add(self):
        add_d = {}
        for char in self.old_state:
            char_d = self.pack_char(char)
            char_d["image"] = char.image
            add_d[char_d["id"].__str__()] = char_d
        send_d = {}
        remove_d = {}
            
        
        total_d = {"add":add_d, "send":send_d, "remove":remove_d}
        
        return total_d
