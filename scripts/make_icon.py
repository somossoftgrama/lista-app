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

    # Checkbox redondeado
    m = size * 0.24
    box = [m, m, size - m, size - m]
    bw = max(6, int(size * 0.05))
    d.rounded_rectangle(box, radius=size * 0.13, outline=GREEN, width=bw)

    # Checkmark nitido: dos segmentos rectos con vertice agudo
    lw = max(9, int(size * 0.085))
    x0 = m + size * 0.20   # inicio abajo-izq
    y0 = m + size * 0.50
    x1 = m + size * 0.43   # vertice (punto mas bajo del check)
    y1 = m + size * 0.70
    x2 = size - m - size * 0.16  # punta arriba-der
    y2 = m + size * 0.27
    # dibujar como poligono relleno para esquina aguda y grosor uniforme
    # primer segmento
    d.line([(x0, y0), (x1, y1)], fill=GREEN_HI, width=lw)
    d.line([(x1, y1), (x2, y2)], fill=GREEN_HI, width=lw)
    # refuerzo del vertice (circulo pequeño) para que la union sea solida
    r = lw / 2
    d.ellipse([x1 - r, y1 - r, x1 + r, y1 + r], fill=GREEN_HI)

    return img

for s in (512, 192):
    make_icon(s).save(f"C:/Users/Rafael/lista-app/public/icon-{s}.png")
    print("wrote", s)
