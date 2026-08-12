import math, random
from PIL import Image, ImageDraw

random.seed(7)

def make_icon(size):
    img = Image.new("RGB", (size, size), (10, 10, 10))
    px = img.load()
    c = size / 2.0
    maxd = math.hypot(c, c)
    for y in range(size):
        for x in range(size):
            d = math.hypot(x - c, y - c) / maxd
            base = 10 + int((1 - d) * 14)
            g = base + random.randint(-3, 3)
            px[x, y] = (g, g, g + 2)
    d = ImageDraw.Draw(img)

    GREEN = (34, 197, 94)      # #22C55E
    GREEN_HI = (74, 222, 128)  # #4ADE80

    # Checkbox redondeado (caja)
    m = size * 0.24
    box = [m, m, size - m, size - m]
    bw = max(6, int(size * 0.05))
    d.rounded_rectangle(box, radius=size * 0.13, outline=GREEN, width=bw)

    # Checkmark DENTRO de la caja (coordenadas como fraccion de size)
    # La caja va de 0.24 a 0.76; el check se mantiene entre 0.35 y 0.67.
    lw = max(9, int(size * 0.075))
    p = lambda fx, fy: (fx * size, fy * size)
    (x0, y0) = p(0.35, 0.55)   # inicio abajo-izq (dentro)
    (x1, y1) = p(0.46, 0.65)   # vertice (punto mas bajo, dentro)
    (x2, y2) = p(0.67, 0.39)   # punta arriba-der (dentro)
    d.line([(x0, y0), (x1, y1)], fill=GREEN_HI, width=lw)
    d.line([(x1, y1), (x2, y2)], fill=GREEN_HI, width=lw)
    r = lw / 2
    d.ellipse([x1 - r, y1 - r, x1 + r, y1 + r], fill=GREEN_HI)

    return img

for s in (512, 192):
    make_icon(s).save(f"C:/Users/Rafael/lista-app/public/icon-{s}.png")
    print("wrote", s)
