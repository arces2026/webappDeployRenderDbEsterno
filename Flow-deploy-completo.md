# Guida al Deploy di Django Backend + Vue.js Frontend su Render con Database Esterno

## 📑 Indice

- [Guida al Deploy di Django Backend + Vue.js Frontend su Render con Database Esterno](#guida-al-deploy-di-django-backend--vuejs-frontend-su-render-con-database-esterno)
  - [📑 Indice](#-indice)
  - [📋 Prerequisiti](#-prerequisiti)
  - [🗄️ Passo 1: Creare il Database](#️-passo-1-creare-il-database)
    - [Opzione A: Neon (PostgreSQL)](#opzione-a-neon-postgresql)
    - [Opzione B: Supabase (PostgreSQL)](#opzione-b-supabase-postgresql)
    - [Opzione C: MariaDB (con Aiven)](#opzione-c-mariadb-con-aiven)
  - [🐍 Passo 2: Preparare il Progetto Django per il Deploy](#-passo-2-preparare-il-progetto-django-per-il-deploy)
    - [2.1 Installare le dipendenze necessarie](#21-installare-le-dipendenze-necessarie)
    - [2.2 Configurare `settings.py` per PostgreSQL](#22-configurare-settingspy-per-postgresql)
    - [2.3 Configurare `settings.py` per MariaDB](#23-configurare-settingspy-per-mariadb)
    - [2.4 Creare il `Dockerfile` per Django](#24-creare-il-dockerfile-per-django)
    - [2.5 Creare il file `.dockerignore`](#25-creare-il-file-dockerignore)
    - [2.6 Caricare il codice su GitHub](#26-caricare-il-codice-su-github)
  - [🚀 Passo 3: Deploy del Backend Django su Render](#-passo-3-deploy-del-backend-django-su-render)
    - [3.1 Creare il Web Service](#31-creare-il-web-service)
    - [3.2 Configurare il Web Service](#32-configurare-il-web-service)
    - [3.3 Configurare il Docker Command](#33-configurare-il-docker-command)
    - [3.4 Configurare le Variabili d'Ambiente](#34-configurare-le-variabili-dambiente)
    - [3.5 Avviare il Deploy](#35-avviare-il-deploy)
  - [✅ Passo 4: Verificare il Deploy del Backend](#-passo-4-verificare-il-deploy-del-backend)
  - [🔄 Passo 5: Aggiornare il Backend](#-passo-5-aggiornare-il-backend)
  - [🖥️ Passo 6: Preparare il Frontend Vue.js per il Deploy Containerizzato](#️-passo-6-preparare-il-frontend-vuejs-per-il-deploy-containerizzato)
    - [6.1 Struttura del Progetto Vue.js](#61-struttura-del-progetto-vuejs)
    - [6.2 Configurare le Variabili d'Ambiente di Vue.js](#62-configurare-le-variabili-dambiente-di-vuejs)
    - [6.3 Configurare `vite.config.js`](#63-configurare-viteconfigjs)
    - [6.4 Utilizzare `fetch` per le Chiamate API](#64-utilizzare-fetch-per-le-chiamate-api)
      - [6.4.1 Creare il modulo API con `fetch`](#641-creare-il-modulo-api-con-fetch)
      - [6.4.2 Esempio di utilizzo in un componente Vue](#642-esempio-di-utilizzo-in-un-componente-vue)
      - [6.4.3 Gestione degli errori centralizzata](#643-gestione-degli-errori-centralizzata)
    - [6.5 Creare il `Dockerfile` per Vue.js](#65-creare-il-dockerfile-per-vuejs)
  - [🚀 Passo 7: Deploy del Frontend Vue.js Containerizzato su Render](#-passo-7-deploy-del-frontend-vuejs-containerizzato-su-render)
    - [7.1 Creare il Web Service per il Frontend](#71-creare-il-web-service-per-il-frontend)
    - [7.2 Configurare il Web Service](#72-configurare-il-web-service)
    - [7.3 Configurare il Docker Command](#73-configurare-il-docker-command)
    - [7.4 Configurare le Variabili d'Ambiente](#74-configurare-le-variabili-dambiente)
    - [7.5 Avviare il Deploy](#75-avviare-il-deploy)
  - [🌐 Configurazione CORS per il Collegamento Frontend-Backend](#-configurazione-cors-per-il-collegamento-frontend-backend)
    - [1. Configurare CORS su Django](#1-configurare-cors-su-django)
    - [2. Verificare che le richieste arrivino al backend corretto](#2-verificare-che-le-richieste-arrivino-al-backend-corretto)
    - [3. Testare la connessione](#3-testare-la-connessione)
  - [📦 Strategie di Organizzazione del Repository](#-strategie-di-organizzazione-del-repository)
    - [Strategia 1: Repository Singolo (Monorepo)](#strategia-1-repository-singolo-monorepo)
    - [Strategia 2: Repository Separati](#strategia-2-repository-separati)
  - [⚠️ Note Importanti](#️-note-importanti)
    - [Cold Start su Render](#cold-start-su-render)
    - [Backup del Database](#backup-del-database)
    - [Consigli per la Produzione](#consigli-per-la-produzione)
    - [Differenze tra PostgreSQL e MariaDB](#differenze-tra-postgresql-e-mariadb)
  - [🐛 Troubleshooting Comuni](#-troubleshooting-comuni)
    - [Backend](#backend)
      - [Errore: "Database not found"](#errore-database-not-found)
      - [Errore: "Superuser already exists"](#errore-superuser-already-exists)
      - [Errore: "ModuleNotFoundError: No module named 'your\_project'"](#errore-modulenotfounderror-no-module-named-your_project)
      - [Errore: "psycopg2.OperationalError: could not connect to server"](#errore-psycopg2operationalerror-could-not-connect-to-server)
      - [Errore: "mysqlclient not found"](#errore-mysqlclient-not-found)
      - [Errore: "Access denied for user"](#errore-access-denied-for-user)
    - [Frontend](#frontend)
      - [Errore: "API calls fail with CORS error"](#errore-api-calls-fail-with-cors-error)
      - [Errore: "404 Not Found on page refresh"](#errore-404-not-found-on-page-refresh)
      - [Errore: "VUE\_APP\_API\_URL not defined"](#errore-vue_app_api_url-not-defined)
      - [Errore: "Container fails to start"](#errore-container-fails-to-start)
  - [📊 Costo: Tutto Gratuito](#-costo-tutto-gratuito)
  - [🎯 Riepilogo](#-riepilogo)
  - [📚 Risorse Utili](#-risorse-utili)

---

## 📋 Prerequisiti

- Account su [GitHub](https://github.com)
- Account su [Render](https://render.com)
- Account su [Neon](https://neon.tech) **oppure** [Supabase](https://supabase.com) **oppure** [Aiven](https://aiven.io)
- Codice sorgente del progetto Django (già in un repository GitHub)
- Codice sorgente del progetto Vue.js (da deployare)

[Torna su](#-indice)

---

## 🗄️ Passo 1: Creare il Database

### Opzione A: Neon (PostgreSQL)

1. Vai su [Neon](https://neon.tech) e crea un account (gratuito)
2. Crea un nuovo progetto:
   - Clicca su **"New Project"**
   - Dai un nome al progetto (es. `my-django-app`)
   - Scegli la regione più vicina a te (o a dove deployerai su Render)
   - Clicca su **"Create Project"**
3. Nella dashboard del progetto, troverai le credenziali di connessione:
   - **Connection String**: `postgresql://user:password@host/dbname`
   - **Pooled Connection String** (consigliata per Django): `postgresql://user:password@host/dbname?pgbouncer=true`

> ⚠️ **Importante**: Copia la **Pooled Connection String** perché verrà usata nel passo successivo.

**Vantaggi Neon**:
- Database serverless con autoscaling
- Branching e point-in-time recovery
- Ottimo per sviluppo e produzione leggera

[Torna su](#-indice)

---

### Opzione B: Supabase (PostgreSQL)

1. Vai su [Supabase](https://supabase.com) e crea un account (gratuito)
2. Crea un nuovo progetto:
   - Clicca su **"New Project"**
   - Inserisci un nome (es. `my-django-app`)
   - Imposta una password per il database (salvala!)
   - Scegli la regione più vicina a te
   - Clicca su **"Create New Project"** (attendere il provisioning, ~2 minuti)
3. Nella dashboard, vai su **Settings > Database**
4. Troverai le credenziali di connessione:
   - **Connection String**: `postgresql://postgres:password@host:5432/postgres`
   - **Connection Pooler** (consigliata per Django): usa la porta `6543` invece di `5432`
   - Esempio: `postgresql://postgres:password@host:6543/postgres`

> ⚠️ **Importante**: Usa la stringa con il **connection pooler** (porta 6543 per Supabase).

**Vantaggi Supabase**:
- Piattaforma completa (autenticazione, storage, API REST)
- Interfaccia utente intuitiva
- Ottimo per progetti che cresceranno

[Torna su](#-indice)

---

### Opzione C: MariaDB (con Aiven)

Aiven offre un piano gratuito permanente per MariaDB, perfetto per chi preferisce MySQL/MariaDB.

1. Vai su [Aiven](https://aiven.io) e crea un account (gratuito)
2. Crea un nuovo servizio MariaDB:
   - Clicca su **"Create Service"**
   - Scegli **"MariaDB"** come tipo di servizio
   - Seleziona il piano **"Free"** (gratuito, 1GB di storage)
   - Scegli il cloud provider e la regione (es. `Google Cloud - europe-west3` per l'Europa)
   - Dai un nome al servizio (es. `my-django-mariadb`)
   - Clicca su **"Create Service"**
3. Attendere il provisioning del servizio (pochi minuti)
4. Nella dashboard del servizio, vai su **"Connection Information"**:
   - Troverai i dettagli di connessione:
     - **Host**: `my-django-mariadb-project.aivencloud.com`
     - **Port**: `12345` (o la porta assegnata)
     - **Database**: `defaultdb`
     - **Username**: `avnadmin`
     - **Password**: (la password generata automaticamente)
   - Stringa di connessione completa:
     ```
     mysql://avnadmin:password@host:port/defaultdb
     ```

**Vantaggi Aiven**:
- Piano gratuito permanente
- Backup automatici
- Alta affidabilità e performance
- Supporto per MariaDB/MySQL

[Torna su](#-indice)

---

## 🐍 Passo 2: Preparare il Progetto Django per il Deploy

### 2.1 Installare le dipendenze necessarie

Nel tuo `requirements.txt`, assicurati di avere le dipendenze per il database scelto e per CORS:

**Per PostgreSQL (Neon/Supabase)**:
```txt
Django>=4.0
gunicorn>=20.0
psycopg2-binary>=2.9.0
dj-database-url>=2.0.0
python-dotenv>=1.0.0
django-cors-headers>=4.0.0
```

**Per MariaDB/MySQL (Aiven)**:
```txt
Django>=4.0
gunicorn>=20.0
mysqlclient>=2.2.0
dj-database-url>=2.0.0
python-dotenv>=1.0.0
django-cors-headers>=4.0.0
```

> ⚠️ **Nota**: `mysqlclient` richiede dipendenze di sistema che installeremo nel Dockerfile.

[Torna su](#-indice)

---

### 2.2 Configurare `settings.py` per PostgreSQL

Modifica il tuo `settings.py` per leggere il database da una variabile d'ambiente e gestire CORS:

```python
import os
# import dj_database_url
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-...')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# CORS Configuration (per il frontend Vue)
CORS_ALLOW_ALL_ORIGINS = False  # Non usare in produzione
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')

# Se vuoi permettere tutte le origini (SOLO PER SVILUPPO)
# CORS_ALLOW_ALL_ORIGINS = True  # Solo per sviluppo!

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',  # Aggiungi corsheaders
    'rest_framework',  # Se usi Django REST Framework
    # ... i tuoi app
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Mettilo all'inizio
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Database configuration for PostgreSQL
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST"),
        "PORT": os.getenv("DB_PORT", "5432"),
        "OPTIONS": {
            "sslmode": "require",  # Neon requires SSL
        },
    }
}

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files (opzionale, per file upload)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

[Torna su](#-indice)

---

### 2.3 Configurare `settings.py` per MariaDB

Se usi MariaDB/MySQL, la configurazione è leggermente diversa:

```python
import os
import dj_database_url
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-...')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# CORS Configuration (per il frontend Vue)
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',  # Aggiungi corsheaders
    'rest_framework',  # Se usi Django REST Framework
    # ... i tuoi app
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Mettilo all'inizio
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Database configuration for MariaDB/MySQL
# Note: dj-database-url supporta anche MySQL
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600,
        conn_health_checks=True,
        engine='django.db.backends.mysql',  # Specifica il backend MySQL
    )
}

# Opzioni aggiuntive per MariaDB/MySQL
DATABASES['default']['OPTIONS'] = {
    'charset': 'utf8mb4',
    'use_unicode': True,
    'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
}

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files (opzionale, per file upload)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

**Alternativa con parsing manuale per MariaDB** (se `dj-database-url` non funziona bene):

```python
import os
from urllib.parse import urlparse

# Database configuration for MariaDB/MySQL (manual parsing)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DB_NAME', 'defaultdb'),
        'USER': os.environ.get('DB_USER', 'avnadmin'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '3306'),
        'OPTIONS': {
            'charset': 'utf8mb4',
            'use_unicode': True,
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}
```

[Torna su](#-indice)

---

### 2.4 Creare il `Dockerfile` per Django

Crea un file `Dockerfile` nella root del progetto Django:

**Per PostgreSQL**:
```dockerfile
# Usa l'immagine ufficiale di Python
FROM python:3.11-slim

# Imposta la directory di lavoro
WORKDIR /app

# Imposta variabili d'ambiente
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Installa le dipendenze di sistema necessarie
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copia il file requirements e installa le dipendenze Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia il codice sorgente
COPY . .

# Crea la directory per i file statici
RUN python manage.py collectstatic --noinput

# Espone la porta su cui gunicorn ascolterà
EXPOSE 8000

# Comando per avviare l'applicazione
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "your_project.wsgi:application"]
```

**Per MariaDB/MySQL**:
```dockerfile
# Usa l'immagine ufficiale di Python
FROM python:3.11-slim

# Imposta la directory di lavoro
WORKDIR /app

# Imposta variabili d'ambiente
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Installa le dipendenze di sistema necessarie per MySQL/MariaDB
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copia il file requirements e installa le dipendenze Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia il codice sorgente
COPY . .

# Crea la directory per i file statici
RUN python manage.py collectstatic --noinput

# Espone la porta su cui gunicorn ascolterà
EXPOSE 8000

# Comando per avviare l'applicazione
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "your_project.wsgi:application"]
```

> ⚠️ Sostituisci `your_project` con il nome del tuo progetto Django.

[Torna su](#-indice)

---

### 2.5 Creare il file `.dockerignore`

Crea un file `.dockerignore` nella root del progetto Django:

```
venv/
env/
.git/
__pycache__/
*.pyc
*.pyo
*.pyd
*.db
*.sqlite3
.DS_Store
.gitignore
README.md
.env
*.log
media/
frontend/
node_modules/
dist/
```

[Torna su](#-indice)

---

### 2.6 Caricare il codice su GitHub

Assicurati che tutto il codice sia stato commitato e pushato su GitHub:

```bash
git add .
git commit -m "Preparazione per deploy su Render"
git push origin main
```

[Torna su](#-indice)

---

## 🚀 Passo 3: Deploy del Backend Django su Render

### 3.1 Creare il Web Service

1. Accedi a [Render Dashboard](https://dashboard.render.com)
2. Clicca su **"New +"** e seleziona **"Web Service"**
3. Connetti il tuo repository GitHub
4. Seleziona il repository del progetto Django

[Torna su](#-indice)

---

### 3.2 Configurare il Web Service

Compila i campi come segue:

- **Name**: `nome-del-tuo-progetto-backend` (es. `my-django-app-backend`)
- **Environment**: `Docker`
- **Region**: Scegli la regione più vicina (preferibilmente la stessa del database)
- **Branch**: `main` (o il branch che vuoi deployare)

**Se il backend è in una sottocartella** (monorepo):
- **Root Directory**: `backend/` (il percorso della sottocartella)

[Torna su](#-indice)

---

### 3.3 Configurare il Docker Command

Nella sezione **"Docker Command"**, inserisci:

```bash
/bin/sh -c "pip install -r requirements.txt ; python manage.py migrate ; echo 'from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username=\"admin\").exists() or User.objects.create_superuser(\"admin\", \"admin@example.com\", \"admin123\")' | python manage.py shell ; python manage.py loaddata dump.json ; gunicorn --bind 0.0.0.0:8000 your_project.wsgi:application"
```

> ⚠️ Sostituisci `your_project` con il nome del tuo progetto.

**Spiegazione del comando**:
- `pip install -r requirements.txt` - Installa le dipendenze
- `python manage.py migrate` - Esegue le migrazioni
- `echo '...' | python manage.py shell` - Crea il superutente solo se non esiste già (evita errori al successivo deploy)
- `python manage.py loaddata dump.json` - Carica i dati iniziali (se hai un file `dump.json`)
- `gunicorn ...` - Avvia il server

**Alternativa con entrypoint.sh (più pulita)**:

Crea uno script `entrypoint.sh` nella root del progetto Django:

```bash
#!/bin/bash
# entrypoint.sh

# echo "=== Installando dipendenze ==="
# pip install -r requirements.txt

echo "=== Eseguendo migrazioni ==="
python manage.py migrate

echo "=== Creando superuser (se non esiste) ==="
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username="admin").exists():
    User.objects.create_superuser("admin", "admin@example.com", "admin123")
    print("Superuser creato!")
EOF

echo "=== Caricando dati iniziali ==="
if [ -f "dump.json" ]; then
    python manage.py loaddata dump.json
else
    echo "File dump.json non trovato, salto il caricamento"
fi

echo "=== Testing wsgi import ==="
python -c "import bookshelf.wsgi" && echo "OK" || echo "FAILED"
echo "=== Avviando Gunicorn ==="
# gunicorn --bind 0.0.0.0:8000 bookshelf.wsgi:application
gunicorn --bind 0.0.0.0:${PORT:-8000} bookshelf.wsgi:application


```

Rendi eseguibile lo script:
```bash
chmod +x entrypoint.sh
```

E modifica il Docker Command su Render:
```bash
./entrypoint.sh
```

[Torna su](#-indice)

---

### 3.4 Configurare le Variabili d'Ambiente

Nella sezione **"Environment Variables"** di Render, aggiungi:

**Per PostgreSQL (Neon/Supabase)**:

| Variabile | Valore |
|-----------|--------|
| `DB_NAME` | Il nome del database (es. `neondb`) |
| `DB_USER` | L'username del database |
| `DB_PASSWORD` | La password del database |
| `DB_HOST` | L'host del database (es. `ep-xyz.us-east-1.aws.neon.tech`) |
| `DB_PORT` | `5432` (per Neon) o `6543` (per Supabase pooled) |
| `SECRET_KEY` | Una chiave segreta lunga e casuale (es. generata con `openssl rand -hex 32`) |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1,nome-tuo-progetto-backend.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | `https://nome-tuo-progetto-frontend.onrender.com` |

**Per MariaDB/MySQL (Aiven)**:

| Variabile | Valore |
|-----------|--------|
| `DB_NAME` | `defaultdb` |
| `DB_USER` | `avnadmin` |
| `DB_PASSWORD` | La password generata da Aiven |
| `DB_HOST` | L'host di Aiven (es. `my-project.aivencloud.com`) |
| `DB_PORT` | La porta di Aiven (es. `12345`) |
| `SECRET_KEY` | Una chiave segreta lunga e casuale |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1,nome-tuo-progetto-backend.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | `https://nome-tuo-progetto-frontend.onrender.com` |

[Torna su](#-indice)

---

### 3.5 Avviare il Deploy

1. Clicca su **"Create Web Service"**
2. Render inizierà a costruire l'immagine Docker
3. Al primo avvio, eseguirà il Docker Command con tutte le operazioni di setup
4. Aspetta che il deploy sia completato (potrebbe richiedere qualche minuto)

[Torna su](#-indice)

---

## ✅ Passo 4: Verificare il Deploy del Backend

1. Nella dashboard di Render, clicca sull'URL del servizio (es. `https://nome-tuo-progetto-backend.onrender.com`)
2. Dovresti vedere la tua applicazione Django in esecuzione
3. Verifica l'accesso all'admin: `https://nome-tuo-progetto-backend.onrender.com/admin`
4. Accedi con le credenziali create (username: `admin`, password: `admin123`)
5. Verifica che le API siano accessibili: `https://nome-tuo-progetto-backend.onrender.com/api/` (se hai API)

[Torna su](#-indice)

---

## 🔄 Passo 5: Aggiornare il Backend

Quando fai modifiche al codice:

1. Fai commit e push su GitHub:
```bash
git add .
git commit -m "Aggiornamento backend"
git push origin main
```

2. Render rileverà automaticamente il cambio e farà il redeploy
3. Il Docker Command verrà eseguito di nuovo (migrazioni, creazione superuser solo se non esiste, caricamento dati)

[Torna su](#-indice)

---

## 🖥️ Passo 6: Preparare il Frontend Vue.js per il Deploy Containerizzato

### 6.1 Struttura del Progetto Vue.js

Assicurati che il tuo progetto Vue.js abbia una struttura simile a questa:

```text
frontend/
├── public/
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── components/
│   ├── views/
│   ├── plugins/
│   │   └── api.js         # Configurazione fetch
│   └── utils/
│       └── fetch.js       # Funzioni fetch personalizzate
├── package.json
├── vite.config.js
├── Dockerfile             # Per il deploy containerizzato
├── .env.production
└── nginx.conf             # Configurazione Nginx (opzionale)
```

[Torna su](#-indice)

---

### 6.2 Configurare le Variabili d'Ambiente di Vue.js

Crea un file `.env.production` nella root del progetto Vue:

Non utili in questo caso

[Torna su](#-indice)

---

### 6.3 Configurare `vite.config.js`

configurare invece vite.config per il HMR con watch in dev mode

```javascript
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // server watch per HMR in dev
  server: {  
    host: '0.0.0.0',
    port: 5173,
    watch: {   // <---
      usePolling: true,
      interval: 300,
    },
  },
})
```

[Torna su](#-indice)

---

### 6.4 Utilizzare `fetch` per le Chiamate API

#### 6.4.1 Creare il modulo API con `fetch`

Crea un file `src/plugins/api.js`:

```javascript
// src/plugins/api.js

// Configurazione base
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:8000';

// Funzione helper per gestire le risposte
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Funzione per fare richieste GET
export const get = async (endpoint, headers = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
  return handleResponse(response);
};

// Funzione per fare richieste POST
export const post = async (endpoint, data = {}, headers = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// Funzione per fare richieste PUT
export const put = async (endpoint, data = {}, headers = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// Funzione per fare richieste DELETE
export const del = async (endpoint, headers = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
  return handleResponse(response);
};

// Funzione per upload file
export const uploadFile = async (endpoint, file, headers = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      ...headers,
    },
    body: formData,
  });
  return handleResponse(response);
};

// Funzione generica per fetch con opzioni personalizzate
export const fetchApi = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return handleResponse(response);
};

export default {
  get,
  post,
  put,
  del,
  uploadFile,
  fetchApi,
};
```

#### 6.4.2 Esempio di utilizzo in un componente Vue

```vue
<template>
  <div>
    <h2>Lista Utenti</h2>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.username }} - {{ user.email }}
      </li>
    </ul>
    <button @click="fetchUsers">Carica Utenti</button>
    <button @click="addUser">Aggiungi Utente</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { get, post } from '@/plugins/api';

const users = ref([]);
const loading = ref(false);
const error = ref(null);

const fetchUsers = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await get('/api/users/');
    // user.value = await get('/api/users/');
    user.value = data.results // depends on the data fetched
  } catch (err) {
    error.value = err.message;
    console.error('Errore nel caricamento degli utenti:', err);
  } finally {
    loading.value = false;
  }
};

const addUser = async () => {
  try {
    const newUser = await post('/api/users/', {
      username: 'nuovo_utente',
      email: 'nuovo@example.com',
    });
    users.value.push(newUser);
  } catch (err) {
    console.error('Errore nella creazione utente:', err);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
```

#### 6.4.3 Gestione degli errori centralizzata

Crea un file `src/utils/fetch.js` per una gestione più avanzata:

```javascript
// src/utils/fetch.js

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Richiesta timeout');
    }
    throw error;
  }
};

export const fetchJson = async (url, options = {}) => {
  try {
    const response = await fetchWithTimeout(url, options);
    
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        // Se la risposta non è JSON
      }
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }
    
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

[Torna su](#-indice)

---

### 6.5 Creare il `Dockerfile` per Vue.js

Crea un file `Dockerfile` nella root del progetto Vue:

```dockerfile
# ============================================
# DEVELOPMENT STAGE
# ============================================
# Use Node.js 20 slim image as the base for development
FROM node:20-slim AS development

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better layer caching)
COPY package*.json ./
# Install all dependencies (including dev dependencies for development)
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose port 5173 (Vite's default development server port)
EXPOSE 5173

# Start the Vite development server, binding to all network interfaces
# This allows access from outside the container (e.g., from host machine)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


# ============================================
# BUILD STAGE (for production)
# ============================================
# Use Node.js 20 slim image for building the production bundle
FROM node:20-slim AS build

# Declare the build arg so Render (or docker compose) can pass it in
# Vite embeds this value into the bundle at build time
# This allows the frontend to know the backend API URL at runtime
ARG VITE_API_URL
# Set the environment variable from the build argument
ENV VITE_API_URL=$VITE_API_URL

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better layer caching)
COPY package*.json ./
# Install all dependencies (including dev dependencies needed for building)
RUN npm install

# Copy the rest of the application source code
COPY . .
# Build the production bundle (creates the 'dist' folder)
RUN npm run build


# ============================================
# PRODUCTION STAGE (serves built files with Nginx)
# ============================================
# Use lightweight Nginx Alpine image for serving static files
FROM nginx:alpine AS production

# Copy the built static files from the build stage to Nginx's serving directory
COPY --from=build /app/dist /usr/share/nginx/html

# Uncomment if you use Vue Router in history mode (fixes 404 on page refresh):
# Copy custom Nginx configuration to handle client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (default HTTP port for Nginx)
EXPOSE 80

# Start Nginx in the foreground (required for Docker to keep the container running)
CMD ["nginx", "-g", "daemon off;"]

[Torna su](#-indice)

---

### 6.6 Creare il file `.dockerignore` per Vue.js

Crea un file `.dockerignore` nella root del progetto Vue:

```
node_modules/
dist/
.git/
.gitignore
README.md
*.log
.env.local
.env.*.local
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

[Torna su](#-indice)

---

### 6.7 Caricare il codice su GitHub

Assicurati che tutto il codice sia stato commitato e pushato su GitHub:

```bash
git add .
git commit -m "Preparazione frontend Vue per deploy containerizzato"
git push origin main
```

[Torna su](#-indice)

---

## 🚀 Passo 7: Deploy del Frontend Vue.js Containerizzato su Render

### 7.1 Creare il Web Service per il Frontend

1. Accedi a [Render Dashboard](https://dashboard.render.com)
2. Clicca su **"New +"** e seleziona **"Web Service"**
3. Connetti il tuo repository GitHub
4. Seleziona il repository del progetto Vue.js

[Torna su](#-indice)

---

### 7.2 Configurare il Web Service

Compila i campi come segue:

- **Name**: `nome-del-tuo-progetto-frontend` (es. `my-vue-app-frontend`)
- **Environment**: `Docker`
- **Region**: Scegli la regione più vicina (preferibilmente la stessa del backend)
- **Branch**: `main` (o il branch che vuoi deployare)

**Se il frontend è in una sottocartella** (monorepo):
- **Root Directory**: `frontend/` (il percorso della sottocartella)

**Docker Build Options**:
- **Dockerfile Path**: `frontend/Dockerfile` (se il Dockerfile è nella sottocartella)

[Torna su](#-indice)

---

### 7.3 Configurare il Docker Command

Nella sezione **"Docker Command"**, lascia vuoto o inserisci:

```bash
nginx -g "daemon off;"
```

Oppure, se usi l'immagine Node.js con serve:

```bash
serve -s dist -l 5000
```

> ⚠️ **Nota**: Render eseguirà il comando CMD definito nel Dockerfile. Se il Dockerfile ha il CMD corretto, puoi lasciare vuoto il campo Docker Command.

[Torna su](#-indice)

---

### 7.4 Configurare le Variabili d'Ambiente

Nella sezione **"Environment Variables"** di Render, aggiungi:

| Variabile | Valore |
|-----------|--------|
| `VUE_APP_API_URL` | `https://nome-tuo-progetto-backend.onrender.com` |
| `VUE_APP_BASE_URL` | `https://nome-tuo-progetto-frontend.onrender.com` |

> ⚠️ **Importante**: Le variabili d'ambiente su Render per container Docker vengono **iniettate al momento del build**, non al runtime. Per questo motivo, le variabili `VUE_APP_*` devono essere disponibili durante il `npm run build`.

**Problema**: Le variabili d'ambiente di Render non vengono automaticamente passate al build del container Docker.

**Soluzione**: Usa Build Arguments in Render:

1. Nella sezione **"Advanced"** durante la creazione del Web Service
2. Clicca su **"Add Build Argument"**
3. Aggiungi:
   - `VUE_APP_API_URL` = `https://nome-tuo-progetto-backend.onrender.com`

Oppure, modifica il Dockerfile (come fatto per questo progetto) per accettare Build Arguments:  (come in questo caso)

```dockerfile
...
# ============================================
# BUILD STAGE (for production)
# ============================================
# Use Node.js 20 slim image for building the production bundle
FROM node:20-slim AS build

# Declare the build arg so Render (or docker compose) can pass it in
# Vite embeds this value into the bundle at build time
# This allows the frontend to know the backend API URL at runtime
ARG VITE_API_URL
# Set the environment variable from the build argument
ENV VITE_API_URL=$VITE_API_URL

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better layer caching)
COPY package*.json ./
# Install all dependencies (including dev dependencies needed for building)
RUN npm install

# Copy the rest of the application source code
COPY . .
# Build the production bundle (creates the 'dist' folder)
RUN npm run build
...
```

**Alternativa (sconsigliata per produzione)**: Usa un file `.env.production` con valori hardcoded.

[Torna su](#-indice)

---

### 7.5 Avviare il Deploy

1. Clicca su **"Create Web Service"**
2. Render inizierà a costruire l'immagine Docker del frontend
3. Una volta completato, avrai un URL come `https://nome-tuo-progetto-frontend.onrender.com`

[Torna su](#-indice)

---

## 🌐 Configurazione CORS per il Collegamento Frontend-Backend

Per permettere al frontend Vue.js di comunicare con il backend Django, devi configurare correttamente CORS.

### 1. Configurare CORS su Django

**Assicurati che**:

1. `django-cors-headers` sia installato (`pip install django-cors-headers`)
2. `corsheaders` sia in `INSTALLED_APPS`
3. `corsheaders.middleware.CorsMiddleware` sia nel `MIDDLEWARE` (prima di `CommonMiddleware`)
4. `CORS_ALLOWED_ORIGINS` sia impostato correttamente

```python
# In settings.py
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')

# Esempio:
# CORS_ALLOWED_ORIGINS = ['https://my-vue-app-frontend.onrender.com']
```

### 2. Verificare che le richieste arrivino al backend corretto

Nel frontend, tutte le chiamate API devono usare l'URL completo del backend:

```javascript
// Corretto
const response = await fetch('https://my-django-app-backend.onrender.com/api/users/');

// Errato (senza l'URL completo)
const response = await fetch('/api/users/');
```

### 3. Testare la connessione

1. Apri la console del browser (F12)
2. Cerca errori CORS come:
   ```
   Access to fetch at 'https://my-django-app-backend.onrender.com/api/' 
   from origin 'https://my-vue-app-frontend.onrender.com' 
   has been blocked by CORS policy
   ```

3. Se vedi questo errore, verifica la configurazione CORS sul backend

[Torna su](#-indice)

---

## 📦 Strategie di Organizzazione del Repository

### Strategia 1: Repository Singolo (Monorepo)

**Struttura**:
```
il-tuo-repo/
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── entrypoint.sh
│   └── ... (codice Django)
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vue.config.js
│   └── ... (codice Vue)
└── README.md
```

**Su Render**:
- Crea due Web Service separati
- Per il backend: Root Directory = `backend/`
- Per il frontend: Root Directory = `frontend/`

**Vantaggi**:
- Un unico repository da gestire
- Versioni sincronizzate

**Svantaggi**:
- Repository più grande

[Torna su](#-indice)

---

### Strategia 2: Repository Separati

**Struttura**:
```
backend-repo/
├── Dockerfile
├── requirements.txt
└── ... (codice Django)

frontend-repo/
├── Dockerfile
├── package.json
└── ... (codice Vue)
```

**Su Render**:
- Crea due Web Service separati su repository diversi

**Vantaggi**:
- Deploy indipendenti
- Repository più piccoli

**Svantaggi**:
- Gestione separata
- Sincronizzazione manuale

[Torna su](#-indice)

---

## ⚠️ Note Importanti

### Cold Start su Render
- Render sospende le applicazioni gratuite dopo 15 minuti di inattività
- Quando ricevi una nuova richiesta, l'app viene riavviata (cold start)
- Il cold start può richiedere fino a 30 secondi
- **Impatto sul frontend**: La prima richiesta API potrebbe essere lenta

### Backup del Database
- **Neon**: Fornisce backup automatici e point-in-time recovery
- **Supabase**: Fornisce backup automatici
- **Aiven**: Fornisce backup automatici

### Consigli per la Produzione
- **Backend**:
  - Cambia le credenziali di default (admin/admin123)
  - Usa una `SECRET_KEY` robusta
  - Imposta `DEBUG=False`
  - Configura il logging per monitorare gli errori
  - Usa HTTPS (Render lo fornisce automaticamente)
  - Limita `CORS_ALLOWED_ORIGINS` agli URL del frontend

- **Frontend**:
  - Usa variabili d'ambiente per gli URL delle API
  - Implementa gestione errori robusta
  - Usa `_redirects` per Vue Router in modalità history
  - Ottimizza il bundle (code splitting, lazy loading)

### Differenze tra PostgreSQL e MariaDB

| Caratteristica | PostgreSQL | MariaDB/MySQL |
|----------------|------------|---------------|
| **JSON Support** | Eccellente (JSONB) | Buono (JSON) |
| **Full-Text Search** | Avanzata | Base |
| **ACID Compliance** | Completa | Completa |
| **Performance** | Ottima per dati complessi | Ottima per letture intensive |
| **Estensioni** | Molte (PostGIS, etc.) | Limitate |

[Torna su](#-indice)

---

## 🐛 Troubleshooting Comuni

### Backend

#### Errore: "Database not found"
- Verifica che la `DATABASE_URL` sia corretta
- Per Neon: assicurati di usare la stringa **pooled** (con `?pgbouncer=true`)
- Per Supabase: assicurati di usare la porta `6543`
- Per Aiven: verifica che il servizio sia attivo e le credenziali siano corrette

#### Errore: "Superuser already exists"
- Il comando nel Docker Command verifica già se esiste prima di crearlo
- Se ottieni errori, controlla la sintassi dello script

#### Errore: "ModuleNotFoundError: No module named 'your_project'"
- Verifica che il nome del progetto in `gunicorn` sia corretto
- Controlla che il file `wsgi.py` esista nella directory corretta

#### Errore: "psycopg2.OperationalError: could not connect to server"
- Per Supabase: verifica che l'indirizzo IP sia whitelistato (Settings > Database > Connection > "Allow all IPs")
- Per Neon: verifica che la stringa di connessione sia corretta
- Per Aiven: verifica che il servizio sia attivo

#### Errore: "mysqlclient not found"
- Verifica che `default-libmysqlclient-dev` sia installato nel Dockerfile
- Assicurati che `mysqlclient` sia nel requirements.txt

#### Errore: "Access denied for user"
- Verifica che username e password siano corretti
- Per Aiven: usa `avnadmin` come username

[Torna su](#-indice)

---

### Frontend

#### Errore: "API calls fail with CORS error"

**Sintomo**:
```
Access to fetch at 'https://backend-url/api/' from origin 'https://frontend-url' 
has been blocked by CORS policy
```

**Soluzione**:
1. Verifica che `django-cors-headers` sia installato e configurato
2. Controlla che `CORS_ALLOWED_ORIGINS` includa l'URL del frontend
3. Verifica che `CORS_ALLOW_ALL_ORIGINS` sia `False` (per produzione)

#### Errore: "404 Not Found on page refresh"

**Sintomo**: Quando ricarichi una pagina del frontend, ricevi 404

**Soluzione**: Il problema è Vue Router in modalità history. Devi configurare il server per reindirizzare tutte le richieste a `index.html`.

**Con Nginx** (raccomandato):
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Con Node.js serve**:
```bash
serve -s dist -l 5000
```

**Su Render** (Static Site):
Aggiungi un file `_redirects` nella cartella `public/`:
```txt
/*    /index.html   200
```

#### Errore: "VUE_APP_API_URL not defined"

**Sintomo**: Nel frontend, `process.env.VUE_APP_API_URL` è `undefined`

**Soluzione**:
1. Verifica che il file `.env.production` esista
2. Verifica che la variabile inizi con `VUE_APP_`
3. Se usi Build Arguments, assicurati che siano passati correttamente
4. Nel codice, usa un fallback:
   ```javascript
   const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:8000';
   ```

#### Errore: "Container fails to start"

**Sintomo**: Il container del frontend non parte

**Soluzioni**:
1. Verifica che il Dockerfile sia corretto
2. Controlla che il build (`npm run build`) venga eseguito con successo
3. Verifica che la cartella `dist/` venga creata
4. Assicurati che il CMD nel Dockerfile sia corretto
5. Controlla i log di Render per dettagli specifici

[Torna su](#-indice)

---

## 📊 Costo: Tutto Gratuito

| Servizio | Costo | Note |
|----------|------|------|
| **Render Backend** | 💰 Gratuito | Web service con sospensione dopo 15 minuti di inattività |
| **Render Frontend** | 💰 Gratuito | Web service con sospensione dopo 15 minuti di inattività |
| **Neon** | 💰 Gratuito | Database PostgreSQL con 500 MB di storage, piano gratuito permanente |
| **Supabase** | 💰 Gratuito | Database PostgreSQL con 500 MB di storage, piano gratuito permanente |
| **Aiven** | 💰 Gratuito | Database MariaDB/MySQL con 1 GB di storage, piano gratuito permanente |

**Totale**: €0,00 💸

[Torna su](#-indice)

---

## 🎯 Riepilogo

Hai configurato un'architettura completa con:

1. ✅ **Database** esterno gratuito (PostgreSQL con Neon/Supabase o MariaDB con Aiven)
2. ✅ **Backend Django** containerizzato su Render con setup automatico
3. ✅ **Frontend Vue.js** containerizzato su Render con Nginx
4. ✅ **Deploy continuo** da GitHub per entrambi
5. ✅ **Comunicazione CORS** configurata correttamente
6. ✅ **Tutto gratis**, senza scadenze di 30 giorni
7. ✅ **Supporto** sia per PostgreSQL che per MariaDB

**Scegli il database che preferisci:**
- **PostgreSQL**: Migliore per JSON, Full-Text Search e funzionalità avanzate
- **MariaDB**: Migliore per semplicità, performance in lettura e applicazioni tradizionali

**Scegli la strategia di repository:**
- **Monorepo**: Più semplice da gestire, un unico repository
- **Repository separati**: Deploy indipendenti, più modulari

[Torna su](#-indice)

---

## 📚 Risorse Utili

- [Documentazione Render Docker](https://render.com/docs/docker)
- [Documentazione Neon](https://neon.tech/docs/introduction)
- [Documentazione Supabase](https://supabase.com/docs)
- [Documentazione Aiven MariaDB](https://aiven.io/docs/products/mariadb)
- [Guida Django Deploy su Render](https://render.com/docs/deploy-django)
- [dj-database-url Documentazione](https://github.com/jacobian/dj-database-url)
- [Django con MySQL/MariaDB](https://docs.djangoproject.com/en/stable/ref/databases/#mysql-notes)
- [Django con PostgreSQL](https://docs.djangoproject.com/en/stable/ref/databases/#postgresql-notes)
- [Vue.js Deploy con Nginx](https://vuejs.org/guide/best-practices/production-deployment)
- [Vue Router History Mode](https://router.vuejs.org/guide/essentials/history-mode.html)
- [Django CORS Headers](https://pypi.org/project/django-cors-headers/)
- [Using fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

[Torna su](#-indice)