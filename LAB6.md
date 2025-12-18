# ЛР №6 — Розгортання програмного забезпечення (CI/CD)

## 1) CI (Continuous Integration)

У репозиторії додано GitHub Actions workflow **.github/workflows/ci.yml**.

CI запускається при:
- `pull_request` (будь-який PR)
- `push` у гілки `main`/`master`

Пайплайн перевіряє:
- **Prettier**: `prettier --check` (код відформатований)
- **ESLint**: без `--fix` (немає помилок/попереджень)
- **Build**: `npm run build`
- **Tests**: `npm test` + `npm run test:e2e`
- **Conventional Commits**: commitlint (стиль комітів)

### Conventional Commits приклади
- `feat(users): add create endpoint`
- `fix: handle empty payload`
- `docs: update readme`
- `test: add e2e scenario`

## 2) Налаштування GitHub щоб мерджити PR лише після CI

GitHub → **Settings → Branches → Branch protection rules**:
1. Add rule для `main` (або `master`)
2. Увімкнути:
   - **Require a pull request before merging**
   - **Require status checks to pass before merging**
   - Обрати чек **"CI / Lint • Format • Build • Tests • Commits"**
   - (опційно) **Require branches to be up to date before merging**

Після цього GitHub дозволить merge лише коли CI зелений.

## 3) CD (Continuous Deployment) на staging

Додано workflow **.github/workflows/cd.yml**, який запускається при `push` у `main`/`master`.

Перед деплоєм CD також виконує `build` та тести.

### Варіант A: Deploy через webhook (Render / Railway / інше)
1. Створи deploy webhook у хостингу
2. Додай GitHub Secret:
   - `STAGING_DEPLOY_HOOK_URL` = URL хука
3. Після кожного пуша в main/master буде POST на webhook.

### Варіант B: Deploy на VPS через SSH + Docker Compose
У репозиторії додано:
- **Dockerfile** (multi-stage build)
- **docker-compose.stage.yml** (публікує сервіс на порт 80)

#### Налаштування сервера (1 раз)
1. Встанови Docker та Docker Compose Plugin
2. Відкрий порт **80** у firewall/хостингу
3. На сервері:
   ```bash
   git clone <repo> /opt/event-booking-api
   cd /opt/event-booking-api
   docker compose -f docker-compose.stage.yml up -d --build
   ```

#### Secrets у GitHub
Repository → Settings → Secrets and variables → Actions → New repository secret:
- `SSH_HOST` — IP/домен сервера
- `SSH_USER` — користувач (наприклад, `ubuntu`)
- `SSH_KEY` — приватний SSH ключ (без пароля)
- `SSH_PORT` — (опційно) порт, зазвичай `22`
- `APP_DIR` — шлях до репозиторію на сервері, наприклад `/opt/event-booking-api`

Після кожного `push` у main/master, GitHub Actions зайде по SSH і виконає:
- `git reset --hard origin/<branch>`
- `docker compose up -d --build`

## 4) Сервіс доступний з інтернету

При VPS-варіанті сервіс доступний за:
- `http://<SSH_HOST>/` (бо порт 80 проброшений на 3000 у контейнер)

Для перевірки можна додати ендпоінт healthcheck або просто зробити запит до існуючих роутів.
