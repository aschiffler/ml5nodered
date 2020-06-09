FROM nodered/node-red
RUN adduser node-red root
USER node-red
COPY --chown=node-red:node-red /docker-nodered/package.json .
RUN npm install --only=production
COPY --chown=node-red:node-red /docker-nodered/settings.js /data/settings.js
COPY --chown=node-red:node-red /docker-nodered/flows.json /data/flows.json
COPY --chown=node-red:node-red /ml5_classification/index.html /data/uibuilder/ml5/src/index.html
COPY --chown=node-red:node-red /ml5_classification/index.js /data/uibuilder/ml5/src/index.js
COPY --chown=node-red:node-red /ml5_classification/sketch.js /data/uibuilder/ml5/src/sketch.js
COPY --chown=node-red:node-red /ml5_train_classification/index.html /data/uibuilder/ml5_train/src/index.html
COPY --chown=node-red:node-red /ml5_train_classification/index.js /data/uibuilder/ml5_train/src/index.js
COPY --chown=node-red:node-red /ml5_train_classification/style.css /data/uibuilder/ml5_train/src/style.css
COPY --chown=node-red:node-red /ml5_train_classification/shutter.mp3 /data/uibuilder/ml5_train/src/shutter.mp3
COPY --chown=node-red:node-red /ml5_posenet/index.html /data/uibuilder/pose/src/index.html
COPY --chown=node-red:node-red /ml5_posenet/index.js /data/uibuilder/pose/src/index.js
COPY --chown=node-red:node-red /ml5_posenet/sketch.js /data/uibuilder/pose/src/sketch.js
COPY --chown=node-red:node-red /docker-nodered/start.sh .
COPY /docker-nodered/cert.pem /data/cert.pem
COPY /docker-nodered/key.pem /data/key.pem

CMD ["npm", "start"]
