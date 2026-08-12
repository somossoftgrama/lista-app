# Listas

App de listas personales (compras, tareas, lo que necesites). Se instala en el teléfono como PWA, funciona offline y guarda todo localmente en el dispositivo.

## Funciones

- Crear varias listas (con ícono y color propios).
- Añadir ítems a cada lista.
- Marcar ítems como hechos/pendientes sin borrarlos (el texto se tacha).
- Editar el texto de un ítem (doble clic o botón ✏️).
- Borrar ítems o listas completas.
- Barra de progreso: cuántos ítems van hechos de los totales.

## Arquitectura

- **PWA** sobre Next.js 16 (App Router) + TypeScript + Tailwind CSS v4.
- **Datos locales** en IndexedDB vía Dexie (`lib/db.ts`).
- **Capa de repositorio agnóstica** (`lib/repository.ts`): la UI solo conoce la interfaz `ListaRepository`. Si mañana se quiere backend/sincronización, se crea `ApiRepository` con la misma interfaz y se intercambia sin tocar la UI.
- **Sin servidor ni cuentas**: los datos viven solo en el dispositivo donde se usa la app.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Deploy

Conectar el repo a Vercel (import manual). Build automático.
