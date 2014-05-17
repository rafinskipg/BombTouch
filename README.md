# The adventures of Cool  Dog
by [VenturaStudios](http://venturastudios.org)

## Chapter 1 - Lost in space
----------

> The adventures of Cool Dog, chapter 1 - lost in space is an open source game released under the [MOZILLA](http://choosealicense.com/licenses/mozilla/) 2.0 license.

##RoadMap
* Alpha
* Release beta and release campaign for fundraising
* Beta with online scores

##Contributing

You can contribute code with pull requests, if you want to contribute artworks or sounds you can email me at ventura@venturastudios.com.

### Todo list

- Make a menu appear when you hit Esc key
- Redesign the top menu
- Create a "paralax.js" or "canvas.js" for paralax rendering with different layers and speeds
- Send the game score to the backend
- Add a -currentFrame method on the sprite.js, used to know when to shoot.
- Make again the gif on the home

### Installation

Run from shell (needs node)

````
sudo npm install 
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

Be sure you have installed some android version on the android version management.

Adding cordova plugins
````
cordova plugin add https://github.com/leecrossley/cordova-plugin-social-message.git
cordova plugin add org.apache.cordova.dialogs

````


*build your project and copy the distributed version onto /cordova/www*

And run the cordova project with the following command (dont use sudo, it will load other .bashrc file)

````
cordova run android
cordova emulate android 
`````


##Common problems

My device won't show up. List Cordova devices
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

Creating a new cordova project
````
cordova create myproject com.yourname.myproject MyProject
````

### Optimization

We are using [CocoonJS](https://www.ludei.com/cocoonjs/) cloud compiler service for optimization.