# The adventures of Cool  Dog
by [VenturaStudios](http://venturastudios.org)

## Chapter 1 - Lost in space
----------

> The adventures of Cool Dog, chapter 1 - lost in space is an open source game released under the [MOZILLA](http://choosealicense.com/licenses/mozilla/) 2.0 license.

##RoadMap
* Working on Alpha[current]
* Reach beta state
* Release beta and release campaign for fundraising
* Official code release

##Contributing

You can contribute code with pull requests, if you want to contribute artworks or sounds you can email me at rafinskipg(at)gmail(dot)com.

### Todo list For Beta

- Redesign game mechanichs and levels.
- Create a "worlds" or "planets" list, to choose levels.
- Polish backgrounds and sprites
- Add all the entities into quadtrees
- Create intro scene

### New game mechanics notes

####level 1: space junkyard

various elements in the enviroment, broken satellites, rocket pieces, etc...

-enemy 1: space rat (invader)

mean looking little rat in a purple spacesuit armed with a rusty gun, shoots single bullets, medium health, fast movement, no formation

-enemy 2: faulty defense drone

scattered, still defensive satellites will shoot lasers and missiles at anybody that comes close, either you or the invaders, powerful firepower, very slow fire rate

-enemy 3: orbital worm 

very large monster, very fast movement, no fire, impossible to kill health, ignores you (the main objective might be to just dodge this one)

-enemy 4: space rat battle station (invader)

flying reverse E shaped contraption manned by 3 space rats, one in each stick of the letter E, stronger firepower than the lone space rat but much slower movement,
they may appear in groups of 3 in line across the vertical, firing out of sync so the player can evade being hit

-final monster: junk mutant

made with pens, washing machines, tvs, pig carcasses, and other junk floating in space, a monster is born, somehow

throws balls of scrap metal and cliché souvenirs, very large health, slow movement, slow fire rate, big size


level 4: slime nebula

enemy 1: Lamprey guards (invader)
lamprey king
Shoots clouds of poisonous slime that will damage the player as long as he is in contact with it.


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

##Crosswalk

If you want to compile it with crosswalk, get whatever you need from [Crosswalk page](https://crosswalk-project.org/)

Compile for android
````
python make_apk.py --manifest=/PATH_TO_MY_APP/manifest.json
````
Install
````
adb install -r cool_dog_arm.apk
````

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