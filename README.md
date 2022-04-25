# ColorSplash Backend
ColorSplash is a multiplayer game created for Android devices as the main project for the course TDT4240 Software Architecture at NTNU.
This is the backend repository running the Heroku server [here](https://color-splash.herokuapp.com/). <br/><br/>
Click [here](https://github.com/FabianFoss/color-splash-frontend) to get to **the frontend repositry**. Here you can run the project and game locally.

## Structure
```
.
├── .github/workflows     #CI/CD to push the backend to Heroku, the hosting service we decided to use.
├── backend               #The folder containing all backend code
  ├── src
    ├── events                #Folder containing all the different events our server listen on
    ├── serverState           #Folder containing the internal serverstate, for alle games and players
    └── types                 #All the types used in backend
  ├── .DS_Store
  ├── globalEvents.ts       #All the different events to send and recieve as string constants
  ├── server.ts             #The file setting up the server and socket.io connection
  └── utils.ts              #All logical functions used backend
├── .DS_Store               
└──  README.md
```
Our project is divided into two distinct repositories as they are not dependent of each other.

## How to compile and run backend
1. Clone or download the repository
2. Go to the backend folder, command: ```cd backend```.
3. Start by installing all dependencies by running ```npm install```.
4. Then to run the backend run the command: ```npm start ```. The project will build itself, and compile it to the ```/dist folder```. It will also recompile on changes. The server will run on ```http://localhost:8000``` if not a port is specified in an ```.env file```.

If you want to build the backend run: ```npm run build```. The build will appear in the ```/dist folder```.


## Contributors
[Fabian Foss Budal](https://github.com/FabianFoss)<br>
[Carl Valdemar Ebbesen](https://github.com/Carlvebbesen)<br>
[Ingrid Hagen](https://github.com/hageningrid)<br>
[Karen Hompland](https://github.com/karenhompland)<br>
[Marius Nåvli Sjølie](https://github.com/mariussjolie)<br>
[Håkon Telje](https://github.com/vaarantnu)<br>
[Vår Åsheim](https://github.com/haakonte)<br>
