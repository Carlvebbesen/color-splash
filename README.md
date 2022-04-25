# ColorSplash Backend
ColorSplash is a multiplayer game created for Android devices as the main project for the course TDT4240 Software Architecture at NTNU.
This is the backend repository running the Heroku server. 
Click [here](https://github.com/FabianFoss/color-splash-frontend) to get to the frontend repositry. Here you can run the project and game locally.

## Structure
```
.
├── .github/workflows #CI/CD to push the backend to Heroku, the hosting service we decided to use.
├── backend #The folder containing all backend code
  ├── src
    ├── events #Folder containing all the different events our server listen on
    ├── serverState #Folder containing the internal serverstate, for alle games and players
    └── types #All the types used in backend
  ├── .DS_Store
  ├── globalEvents.ts #all the different events to send and recieve as string constants
  ├── server.ts #the file setting up the server and socket.io connection
  └── utils.ts #all logical functions used backend
├── .DS_Store               
└──  README.md
```
Our project is divided into two distinct repositories as they are not dependent of each other.

## How to compile and run backend


## Contributors
**The group consists of:**<br>
[Fabian Foss Budal](https://github.com/FabianFoss)<br>
[Carl Valdemar Ebbesen](https://github.com/Carlvebbesen)<br>
[Ingrid Hagen](https://github.com/hageningrid)<br>
[Karen Hompland](https://github.com/karenhompland)<br>
[Marius Nåvli Sjølie](https://github.com/mariussjolie)<br>
[Håkon Telje](https://github.com/vaarantnu)<br>
[Vår Åsheim](https://github.com/haakonte)<br>
