import server


class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return "(" + str(self.x) + ", " + str(self.y) + ")"

    def __add__(self, p):
        return Point(self.x + p.x, self.y + p.y)

    def __sub__(self, p):
        return Point(self.x - p.x, self.y - p.y)

    def __mul__(self, obj):
        if (type(obj) == Point):
            return self.get_pmul_p(obj)
        return self.get_mul_n(obj)

    def __truediv__(self, n):
        return self.get_mul_n(1 / n)

    def clone(self):
        return Point(self.x, self.y)

    def tuple(self):
        return self.x, self.y

    def get_dis_p(self, p):
        x1, y1 = self.x, self.y
        x2, y2 = p.x, p.y
        return (((x1 - x2) ** 2) + ((y1 - y2) ** 2)) ** 0.5

    def get_len(self):
        return self.get_dis_p(Point(0, 0))

    def get_pmul_p(self, p):
        return (self.x * p.x) + (self.y * p.y)

    def get_mul_n(self, n):
        return Point(self.x * n, self.y * n)

    def get_unit(self):
        return self / self.get_len()
