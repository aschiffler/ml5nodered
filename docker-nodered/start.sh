#!/bin/bash
flowstr=$(</data/flows.json)
tee /data/flows.json <<< ${flowstr//myhashedsecret/$SECRET}
chown node-red /data/flows.json
chgrp node-red /data/flows.json
ls -l /data
certbot certonly --standalone --non-interactive --agree-tos --email $EMAIL --domain $LETSENCRYPTDOMAIN 
cp /etc/letsencrypt/live/$LETSENCRYPTDOMAIN/cert.pem /data/cert.pem
cp /etc/letsencrypt/live/$LETSENCRYPTDOMAIN/privkey.pem /data/key.pem
npm start -- --userDir /data
