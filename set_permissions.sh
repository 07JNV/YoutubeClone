#!/bin/bash

# Create the uploads directory if it doesn't exist.
mkdir -p ./uploads

# Set the correct permissions.
chmod 755 ./uploads

# Set the correct ownership (assuming the web server user is 'www-data'; change if needed).
chown -R www-data:www-data ./uploads
