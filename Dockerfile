FROM node:10 AS ui-build
WORKDIR /usr/src/app
COPY jaden-frontend/ ./jaden-frontend/
RUN cd jaden-frontend && npm install && npm run build

FROM node:10 AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/jaden-frontend/build ./jaden-backend/public
COPY . .
RUN cd jaden-backend && npm install
COPY . . 

EXPOSE 80
EXPOSE 9000

WORKDIR /root/jaden-backend/
CMD ["npm", "start"]