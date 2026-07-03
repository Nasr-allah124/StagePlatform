FROM php:8.2-apache

# Installer MySQL Server, phpMyAdmin dependencies, supervisord
RUN apt-get update && apt-get install -y \
    default-mysql-server \
    supervisor \
    unzip \
    wget \
    && docker-php-ext-install pdo pdo_mysql mysqli \
    && a2enmod rewrite\
    && rm -rf /var/lib/mysql/*

# Télécharger et installer phpMyAdmin
RUN wget https://www.phpmyadmin.net/downloads/phpMyAdmin-latest-all-languages.zip -O /tmp/pma.zip \
    && unzip /tmp/pma.zip -d /tmp/ \
    && mv /tmp/phpMyAdmin-*-all-languages /var/www/html/phpmyadmin \
    && rm /tmp/pma.zip
COPY docker/pma-config.inc.php /var/www/html/phpmyadmin/config.inc.php
# Copier le code backend PHP
COPY projet_php_backend/ /var/www/html/

# Copier la config supervisord
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/apache-config.conf /etc/apache2/sites-available/000-default.conf

# Copier le script d'init MySQL
COPY docker/init-mysql.sh /usr/local/bin/init-mysql.sh
RUN chmod +x /usr/local/bin/init-mysql.sh \
    && sed -i 's/\r$//' /usr/local/bin/init-mysql.sh

# Initialiser les dossiers MySQL + permissions
RUN mkdir -p /var/run/mysqld && chown -R mysql:mysql /var/run/mysqld \
    && chown -R www-data:www-data /var/www/html

EXPOSE 80 3306

CMD ["/bin/bash", "-c", "/usr/local/bin/init-mysql.sh && /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf"]