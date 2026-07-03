#!/bin/bash
set -e

MYSQL_DATA_DIR="/var/lib/mysql"
DB_NAME="site_paltforme"
DB_PASS="root"

# Si MySQL n'a jamais été initialisé (premier démarrage du conteneur)
if [ ! -d "$MYSQL_DATA_DIR/mysql" ]; then
  echo ">>> Initialisation de MySQL (premier démarrage)..."
  mysql_install_db --user=mysql --datadir=$MYSQL_DATA_DIR

  # Démarrer MySQL temporairement en arrière-plan pour la config
  mysqld_safe --datadir=$MYSQL_DATA_DIR --skip-networking=0 &
  MYSQL_PID=$!

  # Attendre que MySQL soit prêt
  until mysqladmin ping --silent 2>/dev/null; do
    echo ">>> En attente de MySQL..."
    sleep 2
  done

  # Créer la base, régler le mot de passe root (syntaxe MariaDB), importer data.sql
  mysql -u root <<-EOSQL
    CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;
    ALTER USER 'root'@'localhost' IDENTIFIED BY '${DB_PASS}';
    CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY '${DB_PASS}';
    GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
EOSQL

  if [ -f /var/www/html/data.sql ]; then
    echo ">>> Import de data.sql..."
    mysql -u root -p"${DB_PASS}" "${DB_NAME}" < /var/www/html/data.sql
    echo ">>> Import terminé."
  else
    echo ">>> ATTENTION : data.sql introuvable, base créée vide."
  fi

  # Arrêter MySQL temporaire (supervisord va le relancer proprement après)
  mysqladmin -u root -p"${DB_PASS}" shutdown
  wait $MYSQL_PID
  echo ">>> Initialisation MySQL terminée."
else
  echo ">>> MySQL déjà initialisé, on passe."
fi