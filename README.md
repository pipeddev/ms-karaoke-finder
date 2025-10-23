## 🎤 Karaoke Finder – Microservicio Backend

[![CI - Feature Validation](https://github.com/pipeddev/ms-karaoke-finder/actions/workflows/ci-feature-validation.yml/badge.svg)](https://github.com/pipeddev/ms-karaoke-finder/actions/workflows/ci-feature-validation.yml)

**Karaoke Finder** es un microservicio backend desarrollado con **NestJS** bajo una arquitectura **Clean + Hexagonal**, que permite buscar canciones y playlists utilizando la **API pública de Spotify**, aplicando buenas prácticas de diseño, caching distribuido y validación robusta.

Este servicio está optimizado para ejecución en **Google Cloud Run**, con pipeline CI/CD en **GitHub Actions** que valida calidad, pruebas y cobertura antes de cada merge.

---

## 🧩 Arquitectura del Proyecto

El proyecto implementa principios de **Domain-Driven Design (DDD)**, **Clean Architecture** y **Hexagonal Architecture**, separando las responsabilidades en capas claras:

```
src/
├─ auth/                     # Módulo de autenticación (token JWT por dispositivo)
│   ├─ application/          # Casos de uso
│   ├─ domain/               # Entidades del dominio
│   ├─ infrastructure/       # Adaptadores externos (JWT)
│   └─ interface/            # Controladores y DTOs de entrada/salida
│
├─ karaoke/                  # Módulo principal del dominio Karaoke
│   ├─ application/          # Casos de uso (use-cases)
│   ├─ domain/               # Entidades y repositorios abstractos
│   ├─ infrastructure/       # Adaptadores externos (Spotify API, Redis)
│   └─ interface/            # Controladores HTTP + DTOs
│
├─ shared/                   # Utilidades, logger, pipes, filtros, helpers comunes
│
├─ app.module.ts             # Módulo raíz de NestJS
├─ main.ts                   # Bootstrap principal (FastifyAdapter)
└─ constant.ts               # Constantes globales
```

📘 **Principios aplicados:**

- **Clean Architecture:** cada capa tiene una responsabilidad única.
- **Hexagonal (Ports & Adapters):** separación entre el dominio y las integraciones externas.
- **DDD:** el dominio define las reglas, independiente del framework.
- **Inyección de dependencias:** los adaptadores se proveen a través de interfaces.

---

## 🧠 Diagrama de Arquitectura

![Architecture](https://github.com/pipeddev/ms-karaoke-finder/blob/develop/docs/architecture.png)

---

## 🔀 GitFlow Simplificado

El proyecto sigue un flujo de ramas que prioriza la estabilidad en producción y la validación continua de features antes del merge.

![Gitflow](https://github.com/pipeddev/ms-karaoke-finder/blob/develop/docs/gitflow-model.png)

### 🌿 Ramas activas

- `feature/*` → nuevas funcionalidades
- `bugfix/*` → correcciones menores
- `hotfix/*` → correcciones críticas en producción
- `develop` → entorno de integración
- `main` → entorno estable / producción

---

## ⚙️ Ejecución Local

### 1️⃣ Requisitos previos

- Node.js ≥ **v22**
- pnpm ≥ **v9**
- Spotify API credentials
- Redis Upstash URL

### 2️⃣ Variables de entorno `.env`

```bash
APP_NAME=ms-karaoke-finder
APP_PORT=3000
APP_ENV=development

SPOTIFY_CLIENT_ID=tu_client_id
SPOTIFY_CLIENT_SECRET=tu_secret
SPOTIFY_TOKEN_URL=https://accounts.spotify.com/api/token
SPOTIFY_SEARCH_URL=https://api.spotify.com/v1/search

REDIS_URL=tu_upstash_url
```

### 3️⃣ Instalación

```bash
pnpm install
pnpm start:dev
```

La aplicación se ejecutará en:

> [http://localhost:3000](http://localhost:3000)

---

## 🧪 Calidad y Testing

El proyecto usa **Jest** con cobertura mínima exigida de **80%**
(validada automáticamente por **GitHub Actions** antes de cada merge).

```bash
pnpm test:cov
```

📄 **Pipeline:** `.github/workflows/ci-feature-validation.yml`

- Lint (ESLint)
- Tests unitarios
- Verificación de cobertura mínima (80%)
- Bloqueo automático de merges si no cumple el umbral ✅

---

## ☁️ Despliegue en Cloud Run (en preparación)

- Imágenes Docker optimizadas con Node.js 22 + pnpm
- Despliegue sin estado en Cloud Run
- Conexión a Redis Upstash y Spotify API
- Preparado para integración futura con **Cloud Build** y **Terraform**

---

## 🧭 Próximos pasos

- [ ] Integración CI/CD para `hotfix/*` y `bugfix/*`
- [ ] Despliegue automático a **Cloud Run (staging)**
- [ ] Integración con **Firebase Auth** para usuarios móviles
- [ ] Monitorización con **Cloud Logging** y **Error Reporting**
- [ ] Documentación API con **Apidog / Swagger**
- [ ] Métricas Prometheus / OpenTelemetry
- [ ] Sincronización con **App Android (Karaoke Finder Mobile)**

---

## 🧱 Stack Técnico

| Componente          | Descripción             |
| ------------------- | ----------------------- |
| **Framework**       | NestJS + Fastify        |
| **Lenguaje**        | TypeScript              |
| **Gestor**          | pnpm                    |
| **Testing**         | Jest + Coverage         |
| **CI/CD**           | GitHub Actions          |
| **Cache**           | Upstash Redis           |
| **API externa**     | Spotify API             |
| **Infraestructura** | Google Cloud Run        |
| **Arquitectura**    | DDD + Clean + Hexagonal |

---

## 👨‍💻 Autor

Desarrollado por **Luis Felipe Carrasco (Pipe D Dev)**
💼 Arquitecto de Software | Cloud Engineer
🌐 [GitHub @pipeddev](https://github.com/pipeddev)
