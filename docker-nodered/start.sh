#!/bin/bash
certbot certonly --standalone --non-interactive --agree-tos --staging --email $EMAIL --domain $LETSCRYPTDOMIAN
cp /etc/letsencrypt/live/$LETSCRYPTDOMIAN/cert.pem /data/cert.pem
cp /etc/letsencrypt/live/$LETSCRYPTDOMIAN/privkey.pem /data/key.pem
npm start -- --userDir /data
