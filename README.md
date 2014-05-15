## BombTouch
----------
Nyancat is a super sayan!

[DEMO](http://rvpg.me/experiments/BombTouch/)

TODO :

- Make a menu appear when you hit Esc key
- Rethink the top menu
- Create a class like sprite.js for paralax rendering
- Send the game score to the backend
- Add a -currentFrame method on the sprite.js, used to know when to shoot.
- Add difficulties. 
- Make again the gif on the home

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


List Cordova devices
```
adb devices
````

Device ??????? no permisions
````
sudo ./adb kill-server
sudo ./adb start-server
sudo ./adb devices
````

Sudo adb not command found
````
Symlink to adb
sudo ln -s /opt/android-sdk-linux_x86/platform-tools/adb /usr/local/sbin/adb
````

