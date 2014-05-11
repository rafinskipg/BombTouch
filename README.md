## BombTouch
----------
Nyancat is a super sayan!

[DEMO](http://rvpg.me/experiments/BombTouch/)

TODO :
- Adjust life / damage of enemies.
- Make a menu appear when you hit Esc key
- Make it respond to back button on android
- Rethink the top menu
- Add that movement equation i saw on goo create.
- Add the social sharer on the gameover screen, add the points
- Implement the badges logic.
- The bonuses stay much longer, appear rarely
- Create a class like sprite.js for paralax rendering
- When you end a game it saves the current progress in a progress list, badges extract information from here.

### Installation 

Run from shell (needs node)

````
npm install 
````
Then

````
bower update
````

Then 

```
grunt server
````
Build
````
grunt build
````

### Cordova
*See [cordova tutorial](http://coenraets.org/blog/cordova-phonegap-3-tutorial/)*

Requirements: 
- Download cordova cli
````
sudo npm install -g cordova
````
- Install Java 
````
sudo apt-get install openjdk-6-jdk
````
- Install ANT
````
sudo apt-get install ant
````
- Add ANT, ADT and java to the path 
````
export PATH=${PATH}:/home/rafa/tools/adt/sdk/tools
export PATH=${PATH}:/home/rafa/tools/adt/sdk/platform-tools
export ANDROID_HOME=/home/rafa/tools/adt/sdk/tools
export JAVA_HOME=/usr/lib/jvm/java-6-openjdk-amd64
export PATH=${PATH}:/usr/bin/ant
````

Install a android version in the ADV..

And run with (dont use sudo, it will load other .bashrc file)
````
cordova run android
cordova emulate android
`````

Cordova plugins
````

cordova plugin add https://github.com/leecrossley/cordova-plugin-social-message.git
cordova plugin add org.apache.cordova.dialogs

````


