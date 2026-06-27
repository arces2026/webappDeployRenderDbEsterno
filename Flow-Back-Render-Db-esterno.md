# Guida al Deploy di Django Backend su Render con Database Esterno

## 📑 Indice

- [Guida al Deploy di Django Backend su Render con Database Esterno](#guida-al-deploy-di-django-backend-su-render-con-database-esterno)
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
    - [2.4 Creare il `Dockerfile`](#24-creare-il-dockerfile)
    - [2.5 Creare il file `.dockerignore`](#25-creare-il-file-dockerignore)
    - [2.6 Caricare il codice su GitHub](#26-caricare-il-codice-su-github)
  - [🚀 Passo 3: Deploy su Render](#-passo-3-deploy-su-render)
    - [3.1 Creare il Web Service](#31-creare-il-web-service)
    - [3.2 Configurare il Web Service](#32-configurare-il-web-service)
    - [3.3 Configurare il Docker Command](#33-configurare-il-docker-command)
    - [3.4 Configurare le Variabili d'Ambiente](#34-configurare-le-variabili-dambiente)
    - [3.5 Avviare il Deploy](#35-avviare-il-deploy)
  - [✅ Passo 4: Verificare il Deploy](#-passo-4-verificare-il-deploy)
  - [🔄 Passo 5: Aggiornare l'Applicazione](#-passo-5-aggiornare-lapplicazione)
  - [⚠️ Note Importanti](#️-note-importanti)
    - [Cold Start su Render](#cold-start-su-render)
    - [Backup del Database](#backup-del-database)
    - [Consigli per la Produzione](#consigli-per-la-produzione)
    - [Differenze tra PostgreSQL e MariaDB](#differenze-tra-postgresql-e-mariadb)
  - [🐛 Troubleshooting Comuni](#-troubleshooting-comuni)
    - [Errore: "Database not found"](#errore-database-not-found)
    - [Errore: "Superuser already exists"](#errore-superuser-already-exists)
    - [Errore: "ModuleNotFoundError: No module named 'your\_project'"](#errore-modulenotfounderror-no-module-named-your_project)
    - [Errore: "psycopg2.OperationalError: could not connect to server"](#errore-psycopg2operationalerror-could-not-connect-to-server)
    - [Errore: "mysqlclient not found"](#errore-mysqlclient-not-found)
    - [Errore: "Access denied for user"](#errore-access-denied-for-user)
  - [📊 Costo: Tutto Gratuito](#-costo-tutto-gratuito)
  - [🎯 Riepilogo](#-riepilogo)
  - [📚 Risorse Utili](#-risorse-utili)

---

## 📋 Prerequisiti

- Account su [GitHub](https://github.com)
- Account su [Render](https://render.com)
- Account su [Neon](https://neon.tech) **oppure** [Supabase](https://supabase.com) **oppure** [Aiven](https://aiven.io)
- Codice sorgente del progetto Django (già in un repository GitHub)

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

Nel tuo `requirements.txt`, assicurati di avere le dipendenze per il database scelto:

**Per PostgreSQL (Neon/Supabase)**:
```txt
Django>=4.0
gunicorn>=20.0
psycopg2-binary>=2.9.0
dj-database-url>=2.0.0
python-dotenv>=1.0.0
```

**Per MariaDB/MySQL (Aiven)**:
```txt
Django>=4.0
gunicorn>=20.0
mysqlclient>=2.2.0
dj-database-url>=2.0.0
python-dotenv>=1.0.0
```

> ⚠️ **Nota**: `mysqlclient` richiede dipendenze di sistema che installeremo nel Dockerfile.

[Torna su](#-indice)

---

### 2.2 Configurare `settings.py` per PostgreSQL

Modifica il tuo `settings.py` per leggere il database da una variabile d'ambiente:

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

# Database configuration for PostgreSQL
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600,
        conn_health_checks=True,
    )
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

### 2.4 Creare il `Dockerfile`

Crea un file `Dockerfile` nella root del progetto:

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

Crea un file `.dockerignore` per escludere file inutili:

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

## 🚀 Passo 3: Deploy su Render

### 3.1 Creare il Web Service

1. Accedi a [Render Dashboard](https://dashboard.render.com)
2. Clicca su **"New +"** e seleziona **"Web Service"**
3. Connetti il tuo repository GitHub
4. Seleziona il repository del progetto Django

[Torna su](#-indice)

---

### 3.2 Configurare il Web Service

Compila i campi come segue:

- **Name**: `nome-del-tuo-progetto` (es. `my-django-app`)
- **Environment**: `Docker`
- **Region**: Scegli la regione più vicina (preferibilmente la stessa del database)
- **Branch**: `main` (o il branch che vuoi deployare)

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

Crea uno script `entrypoint.sh` nella root del progetto:

```bash
#!/bin/bash
# entrypoint.sh

echo "=== Installando dipendenze ==="
pip install -r requirements.txt

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

echo "=== Avviando Gunicorn ==="
gunicorn --bind 0.0.0.0:8000 your_project.wsgi:application
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
| `DATABASE_URL` | La stringa di connessione **pooled** di Neon/Supabase |
| `SECRET_KEY` | Una chiave segreta lunga e casuale (es. generata con `openssl rand -hex 32`) |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1,nome-tuo-progetto.onrender.com` |

**Esempio di DATABASE_URL (Neon)**:
```
postgresql://username:password@ep-xyz.us-east-1.aws.neon.tech/dbname?pgbouncer=true
```

**Esempio di DATABASE_URL (Supabase)**:
```
postgresql://postgres:password@db.xxxxxx.supabase.co:6543/postgres
```

**Per MariaDB/MySQL (Aiven)**:

Se usi `dj-database-url`:

| Variabile | Valore |
|-----------|--------|
| `DATABASE_URL` | `mysql://avnadmin:password@host:port/defaultdb` |
| `SECRET_KEY` | Una chiave segreta lunga e casuale |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1,nome-tuo-progetto.onrender.com` |

**Esempio di DATABASE_URL (Aiven)**:
```
mysql://avnadmin:password@my-django-mariadb-project.aivencloud.com:12345/defaultdb
```

**Se usi il parsing manuale** (senza `dj-database-url`):

| Variabile | Valore |
|-----------|--------|
| `DB_NAME` | `defaultdb` |
| `DB_USER` | `avnadmin` |
| `DB_PASSWORD` | La password generata da Aiven |
| `DB_HOST` | L'host di Aiven (es. `my-project.aivencloud.com`) |
| `DB_PORT` | La porta di Aiven (es. `12345`) |
| `SECRET_KEY` | Una chiave segreta lunga e casuale |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1,nome-tuo-progetto.onrender.com` |

[Torna su](#-indice)

---

### 3.5 Avviare il Deploy

1. Clicca su **"Create Web Service"**
2. Render inizierà a costruire l'immagine Docker
3. Al primo avvio, eseguirà il Docker Command con tutte le operazioni di setup
4. Aspetta che il deploy sia completato (potrebbe richiedere qualche minuto)

[Torna su](#-indice)

---

## ✅ Passo 4: Verificare il Deploy

1. Nella dashboard di Render, clicca sull'URL del servizio (es. `https://nome-tuo-progetto.onrender.com`)
2. Dovresti vedere la tua applicazione Django in esecuzione
3. Verifica l'accesso all'admin: `https://nome-tuo-progetto.onrender.com/admin`
4. Accedi con le credenziali create (username: `admin`, password: `admin123`)

[Torna su](#-indice)

---

## 🔄 Passo 5: Aggiornare l'Applicazione

Quando fai modifiche al codice:

1. Fai commit e push su GitHub:
```bash
git add .
git commit -m "Aggiornamento applicazione"
git push origin main
```

2. Render rileverà automaticamente il cambio e farà il redeploy
3. Il Docker Command verrà eseguito di nuovo (migrazioni, creazione superuser solo se non esiste, caricamento dati)

[Torna su](#-indice)

---

## ⚠️ Note Importanti

### Cold Start su Render
- Render sospende le applicazioni gratuite dopo 15 minuti di inattività
- Quando ricevi una nuova richiesta, l'app viene riavviata (cold start)
- Il cold start può richiedere fino a 30 secondi

### Backup del Database
- **Neon**: Fornisce backup automatici e point-in-time recovery
- **Supabase**: Fornisce backup automatici
- **Aiven**: Fornisce backup automatici

### Consigli per la Produzione
- Cambia le credenziali di default (admin/admin123)
- Usa una `SECRET_KEY` robusta
- Imposta `DEBUG=False`
- Configura il logging per monitorare gli errori
- Usa HTTPS (Render lo fornisce automaticamente)

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

### Errore: "Database not found"
- Verifica che la `DATABASE_URL` sia corretta
- Per Neon: assicurati di usare la stringa **pooled** (con `?pgbouncer=true`)
- Per Supabase: assicurati di usare la porta `6543`
- Per Aiven: verifica che il servizio sia attivo e le credenziali siano corrette

### Errore: "Superuser already exists"
- Il comando nel Docker Command verifica già se esiste prima di crearlo
- Se ottieni errori, controlla la sintassi dello script

### Errore: "ModuleNotFoundError: No module named 'your_project'"
- Verifica che il nome del progetto in `gunicorn` sia corretto
- Controlla che il file `wsgi.py` esista nella directory corretta

### Errore: "psycopg2.OperationalError: could not connect to server"
- Per Supabase: verifica che l'indirizzo IP sia whitelistato (Settings > Database > Connection > "Allow all IPs")
- Per Neon: verifica che la stringa di connessione sia corretta
- Per Aiven: verifica che il servizio sia attivo

### Errore: "mysqlclient not found"
- Verifica che `default-libmysqlclient-dev` sia installato nel Dockerfile
- Assicurati che `mysqlclient` sia nel requirements.txt

### Errore: "Access denied for user"
- Verifica che username e password siano corretti
- Per Aiven: usa `avnadmin` come username

[Torna su](#-indice)

---

## 📊 Costo: Tutto Gratuito

| Servizio | Costo | Note |
|----------|------|------|
| **Render** | 💰 Gratuito | Web service con sospensione dopo 15 minuti di inattività |
| **Neon** | 💰 Gratuito | Database PostgreSQL con 500 MB di storage, piano gratuito permanente |
| **Supabase** | 💰 Gratuito | Database PostgreSQL con 500 MB di storage, piano gratuito permanente |
| **Aiven** | 💰 Gratuito | Database MariaDB/MySQL con 1 GB di storage, piano gratuito permanente |

**Totale**: €0,00 💸

[Torna su](#-indice)

---

## 🎯 Riepilogo

Hai configurato:
1. ✅ Database esterno gratuito (PostgreSQL con Neon/Supabase o MariaDB con Aiven)
2. ✅ Applicazione Django containerizzata su Render
3. ✅ Setup automatico (migrazioni, superuser, dati iniziali)
4. ✅ Deploy continuo da GitHub
5. ✅ Tutto gratis, senza scadenze di 30 giorni
6. ✅ Supporto sia per PostgreSQL che per MariaDB

**Scegli il database che preferisci:**
- **PostgreSQL**: Migliore per JSON, Full-Text Search e funzionalità avanzate
- **MariaDB**: Migliore per semplicità, performance in lettura e applicazioni tradizionali

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

[Torna su](#-indice)