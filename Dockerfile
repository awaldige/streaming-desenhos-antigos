FROM php:8.2-apache

# Instala a extensão MySQLi que seu código precisa
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# Copia os arquivos do seu projeto para dentro do servidor
COPY . /var/www/html/

# Ajusta permissões
RUN chown -R www-data:www-data /var/www/html/

EXPOSE 80
