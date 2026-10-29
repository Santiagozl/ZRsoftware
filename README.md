# ZR Software

Portafolio corporativo administrable desarrollado con Angular 22 y Supabase.

## Arquitectura

La página pública está separada por responsabilidad en `src/app/components/`:

- `site-header`, `hero`, `services` y `projects`
- `delivery-process`, `experience` y `founders`
- `tech-stack`, `faq`, `contact` y `site-footer`

Los componentes de proyectos y contacto consumen `ContentService`; los modelos y el contenido de
respaldo permanecen separados de la presentación. `App` solo orquesta el sitio público y el panel
administrativo.

## Desarrollo local

```bash
npm install
npm start
```

Sitio público: `http://localhost:4200`  
Panel de contenido: `http://localhost:4200/?admin=1`

## Activar el administrador

1. Crea un proyecto en Supabase.
2. Ejecuta `supabase/schema.sql` desde SQL Editor.
3. Crea el usuario administrador en Authentication > Users.
4. Copia su UUID y ejecuta:

```sql
insert into public.admin_users (user_id) values ('UUID-DEL-USUARIO');
```

5. Configura `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  supabaseUrl: 'https://TU-PROYECTO.supabase.co',
  supabaseAnonKey: 'TU-CLAVE-PUBLICA',
  contactEmail: 'TU-CORREO',
};
```

La clave `anon` puede estar en el frontend: el acceso de escritura está protegido mediante
autenticación y políticas RLS. Nunca agregues la `service_role` al proyecto Angular.

Sin Supabase, el sitio muestra los proyectos iniciales de `src/app/projects.data.ts` y el
formulario prepara un correo mediante la aplicación predeterminada del visitante.

## Verificación

```bash
npm run build
npm test -- --watch=false
```
