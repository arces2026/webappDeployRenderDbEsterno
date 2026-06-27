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

