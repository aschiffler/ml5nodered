FROM nodered/node-red
COPY /docker-nodered/package.json .
RUN npm install --only=production
COPY /docker-nodered/settings.js /data/settings.js
COPY /docker-nodered/flows.json /data/flows.json
COPY --chown=node-red:node-red /ml5_classification/index.html /data/uibuilder/ml5/src/index.html
COPY --chown=node-red:node-red /ml5_classification/index.js /data/uibuilder/ml5/src/index.js
COPY --chown=node-red:node-red /ml5_classification/sketch.js /data/uibuilder/ml5/src/sketch.js
COPY /docker-nodered/cert.pem /data/cert.pem
COPY /docker-nodered/key.pem /data/key.pem

CMD ["npm", "start"]
