class Map:
    def __init__(self, system, number):
        self.system = system
        self.number = number
        self.filename = "Levels/level_%03d.txt" % number
        self.load()
        self.d = self.pack_self()

    def load(self):
        file = open(self.filename, "r")
        line = file.readline().split(" ")
        self.max_x = eval(line[0])
        self.max_y = eval(line[1])
        self.max_z = eval(line[2])
        self.max_w = eval(line[3])
        
        line = file.readline().split(" ")
        self.sp = [eval(line[0]), eval(line[1]), eval(line[2]), eval(line[3])]
        line = file.readline().split(" ")
        self.gp = [eval(line[0]), eval(line[1]), eval(line[2]), eval(line[3])]

        wl = []
        w = 0
        while w < self.max_w:
            zl = []
            z = 0
            while z < self.max_z:
                yl = []
                y = 0
                while y < self.max_y:
                    xl = []
                    x = 0
                    line = file.readline().split(" ")
                    while x < self.max_x:
                        xl.append(eval(line[x]))
                        x = x + 1
                    yl.append(xl)
                    y = y + 1
                zl.append(yl)
                z = z + 1
            wl.append(zl)
            w = w + 1
        self.bits = wl

    def pack_self(self):
        d = {}
        d["mx"] = self.max_x
        d["my"] = self.max_y
        d["mz"] = self.max_z
        d["mw"] = self.max_w
        d["gp"] = self.gp
        d["bt"] = self.bits
        return d

    def touch(self, pp, cp, bound):
        i = 0
        while (i < 4):
            if (abs(cp[i] - pp[i]) - (bound + 0.5) > 0):
                return False
            i = i + 1
        return True
