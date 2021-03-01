FROM node:10 AS ui-build
WORKDIR /usr/src/app
COPY jaden-website/ ./jaden-website/
RUN cd jaden-website && npm install && npm run build

FROM node:10 AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/jaden-website/build ./jaden-backend/public
# COPY jaden-backend/package*.json ./jaden-backend/
COPY . .
RUN cd jaden-backend && npm install
# COPY jaden-backend/server.js ./jaden-backend/
COPY . . 

EXPOSE 80
EXPOSE 9000

WORKDIR /root/jaden-backend/
CMD ["npm", "start"]
# CMD ["node", "./jaden-backend/server.js"]