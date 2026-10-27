# nginx — configuración de los sitios del VPS Contabo

Copia versionada de los `server` blocks que viven en `/etc/nginx/sites-available/`
del VPS (Contabo, `84.247.179.120`). **Esta carpeta es la fuente de verdad**: si se
cambia aquí, se aplica con `apply.sh`.

El pipeline de GitHub Actions (`.github/workflows/deploy.yml`) **no toca nginx**:
solo hace `git pull`, `uv sync`, `npm run build` y reinicia `portfolio-backend`.
Por eso los cambios de nginx se aplican a mano con el script de abajo.

## Sitios

| Fichero | Dominio | Sirve |
|---|---|---|
| `sites-available/soluciones.uk` | `soluciones.uk` **y** `www.soluciones.uk` | SPA del portfolio (`/var/www/portfolio/frontend/dist`) + `/api` y `/chat` por `unix:/run/portfolio.sock` |
| `sites-available/chat-bot.soluciones.uk` | `chat-bot.soluciones.uk` | SPA del chatbot (`/var/www/chatbot/frontend/dist`) + `/api/` por `unix:/run/chatbot.sock` |
| `sites-available/webhook-agent.duckdns.org` | `webhook-agent.duckdns.org` | Proxy a Flask en `127.0.0.1:3333` |

`soluciones.uk` es el dominio canónico. `www.soluciones.uk` **no redirige**: sirve
exactamente el mismo contenido (mismo `root`, mismo cert, mismo proxy). El cert de
`soluciones.uk` cubre los dos nombres (`DNS:soluciones.uk, DNS:www.soluciones.uk`),
así que no hace falta cert propio para el `www`.

## Aplicar

```bash
ssh contabo
sudo bash /var/www/portfolio/nginx/apply.sh
```

El script copia los ficheros a `/etc/nginx/sites-available/`, enlaza en
`sites-enabled/`, valida con `nginx -t` y solo entonces recarga nginx. Si `nginx -t`
falla, no recarga nada.

## Certificados

Gestionados por certbot (webroot `/var/www/html`, challenge en el `location
/.well-known/acme-challenge/` de cada bloque de puerto 80):

- `soluciones.uk` → cubre `soluciones.uk` + `www.soluciones.uk`
- `chat-bot.soluciones.uk`
- `webhook-agent.duckdns.org`

Renovación automática por el timer de certbot. Comprobar con:

```bash
sudo certbot renew --dry-run
```

## Histórico

- `www.soluciones.uk` tenía su propio `server` block que hacía `301` al root en
  HTTP y en HTTPS. Se eliminó: ahora ambos hosts los sirve el bloque de
  `soluciones.uk`, y el puerto 80 redirige a `https://$host$request_uri` (mantiene
  el host, no salta al root). El certificado suelto `www.soluciones.uk` puede
  borrarse con `sudo certbot delete --cert-name www.soluciones.uk`.
