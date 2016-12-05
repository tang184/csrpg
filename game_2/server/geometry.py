class Point:
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z

    def __str__(self):
        return "[" + str(self.x) + ", " + str(self.y) + ", " + str(self.z) + "]"

    def __add__(self, p):
        return Point(self.x + p.x, self.y + p.y, self.z + p.z)

    def __sub__(self, p):
        return Point(self.x - p.x, self.y - p.y, self.z - p.z)

    def __mul__(self, obj):
        if (type(obj) == Point):
            return self.get_pmul_p(obj)
        return self.get_mul_n(obj)

    def __truediv__(self, n):
        return self.get_mul_n(1 / n)

    def clone(self):
        return Point(self.x, self.y, self.z)

    def tuple(self):
        return self.x, self.y, self.z

    def get_dis_p(self, p):
        x1, y1, z1 = self.x, self.y, self.z
        x2, y2, z2 = p.x, p.y, p.z
        return (((x1 - x2) ** 2) + ((y1 - y2) ** 2) + ((z1 - z2) ** 2)) ** 0.5

    def get_len(self):
        return self.get_dis_p(Point(0, 0, 0))

    def get_pmul_p(self, p):
        return (self.x * p.x) + (self.y * p.y) + (self.z * p.z)

    def get_mul_n(self, n):
        return Point(self.x * n, self.y * n, self.z * n)

    def get_unit(self):
        l = self.get_len()
        if (l == 0):
            return Point(0, 0, 0)
        return self / l
