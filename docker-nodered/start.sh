#!/bin/bash
flow=$(<flows.json)
echo ${flow//myhashedsecret/$SECRET} > flows.json
certbot certonly --standalone --non-interactive --agree-tos --email $EMAIL --domain $LETSENCRYPTDOMAIN 
cp /etc/letsencrypt/live/$LETSENCRYPTDOMAIN/cert.pem /data/cert.pem
cp /etc/letsencrypt/live/$LETSENCRYPTDOMAIN/privkey.pem /data/key.pem
npm start -- --userDir /data
