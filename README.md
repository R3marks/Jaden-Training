# Jaden-Website
This project is an example website I have created for Jaden Smith. The purpose of which was to learn exactly how to create a modern full stack website from scratch.

**Stack**
 - React (Apollo Client)
 - Node JS (Apollo Server)
 - GraphQL API
 - notarealdb (Straightforward to replace with a real DB)
 - Jest

## Demonstration
![Home Page](https://github.com/R3marks/Jaden-Website/blob/main/Images%20-%20Jaden/Home-Page.png?raw=true)
![Tours Page](https://github.com/R3marks/Jaden-Website/blob/main/Images%20-%20Jaden/Tours-Page.png?raw=true)
![Merch Page](https://github.com/R3marks/Jaden-Website/blob/main/Images%20-%20Jaden/Merch-Page.png?raw=true)
![Cart Page](https://github.com/R3marks/Jaden-Website/blob/main/Images%20-%20Jaden/Cart-Page.png?raw=true)
![Story Page](https://github.com/R3marks/Jaden-Website/blob/main/Images%20-%20Jaden/Story-Page.png?raw=true)
![Sign In Page](https://github.com/R3marks/Jaden-Website/blob/main/Images%20-%20Jaden/Sign-In-Page.png?raw=true)
![Profile Page](https://github.com/R3marks/Jaden-Website/blob/main/Images%20-%20Jaden/Profile-Page.png?raw=true)

## Preface
This is my first public repository, and one used primarily to learn web design for myself. The code will be filled with lots of bad practices, mistakes, and generally inefficient ways to go about programming something. However, all this sets a foundation to build upon and grow, and hopefully one or two things can help others who are also stuck, on how to program a specific feature or overcome a certain problem.

## Getting Started - Docker
The easiest way to locally host this website is using Docker. This will allow you to host the website locally in a docker container, however, other devices on your same network wont be able to access the docker container

### Prerequisites
Install Docker Desktop for Windows. This will allow you to use docker compose to build the website image as well as starting and stopping it. The documentation for installing Docker Desktop for Windows can be found [here](https://docs.docker.com/docker-for-windows/install/).

Once installed you'll need to right click on the docker icon in the taskbar and switch to using Linux containers for this to work. This will prompt you to download the [Linux kernel update package](https://docs.microsoft.com/en-us/windows/wsl/install-win10#step-4---download-the-linux-kernel-update-package).

### Setup
You can then build the image 
```bash
{FOLDER}\Jaden-Website> docker-compose build
```
and assuming it built successfully, start the web app container
```bash
{FOLDER}\Jaden-Website> docker-compose up
```
Passing the `-d` flag allows you to run it in detatched mode.
You should be able to access the website in your browser via `localhost:9000`.
You can then stop running the container
```bash
{FOLDER}\Jaden-Website> docker-compose down
```
Or `Ctrl + c` if you did not run it in detatched mode.

## Deployment
The website can also be hosted in production locally, and then deployed using a Cloud Application Platform such as [Heroku](https://www.apollographql.com/docs/apollo-server/deployment/heroku/)

### Prerequisites
You'll need to have Node JS installed to run the server.

### Setup
To host the website locally, you'll need to build the react application and place the build folder inside the server's directory. This can be achieved by modifying the `jaden-frontend/package.json` file.  
```JSON
"build": "react-scripts build && move build ../jaden-backend/public",
```

Before building either the frontend or backend, make sure to install the repositories packages in each directory with `npm install`, as well as creating a `.env` file to host environment variables that would normally be supplied to the backend by docker.
```js
// Jaden-Website/jaden-backend/.env
PORT=9000
SECRET=secrettext
```

In the `jaden-frontend` directory, you can then build the react app.
```bash
{FOLDER}\Jaden-Website\jaden-frontend> npm run build
```
From here, you can then start the server, which will look for the new `jaden-backend/public` folder.
```bash
{FOLDER}\Jaden-Website\jaden-backend> npm start
```
Any device on your local network should then be able to access the website using your device's IP address.

To have people *outside* of your network access the website, you can push the production version of the website to a service like Heroku to host, or you can set up port forwarding on your personal router to allow incoming connections from the internet to access the website.

## Devlopment
To continue developing the website, run the react app and server separately. You will need react to point to the server, and will therefore need to change where the Apollo Provider points to by changing the `uri` of the `HttpLink`
```js
// Jaden-Training\jaden-frontend\src\api\ApolloProvider.js
	const link = new HttpLink({
		uri: 'http://localhost:9000/graphql',
        credentials: "include"
    })
```
To prevent errors showing on the server, you can also comment out certain lines in `jaden-backend/server.js` that reference the `public` build folder. However, this is optional and won't break the server. 

Start the React app
```bash
{FOLDER}\Jaden-Website\jaden-frontend> npm start
```
and then the server in development
```bash
{FOLDER}\Jaden-Website\jaden-backend> npm run dev
```

## Tests
To run the current set of unit tests for both the frontend and the backend, perform the `npm test` command in both the `jaden-frontend/` and `jaden-backend/` directories. These tests only check the functionality of the Apollo queries, and do not test any other front end or back end logic.

## Credits
Free resources that helped me create the website:  
 - [WebDevSimplified](https://www.youtube.com/channel/UCFbNIlppjAuEX4znoulh0Cw)
 - [Mirko Nasato](https://www.youtube.com/watch?v=lKlXdmG0aKQ)
 - [Apollo Docs](https://www.apollographql.com/docs/)

Subscription resources that helped me create the website:
 - [PluralSight](https://app.pluralsight.com/paths/skill/building-graphql-apis-with-apollo)

## License
MIT © [R3marks]()
