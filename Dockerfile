FROM node:slim
COPY package.json /bot/package.json
RUN cd /bot; npm install

COPY step9-resilience.js /bot/main.js
COPY MyCoolAgent.js /bot/MyCoolAgent.js
WORKDIR /bot

CMD node main.js