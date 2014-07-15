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
- [DEVELOPMENT] Save the current level played, the total gems used, total gems won.
- [DEVELOPMENT] Use gems to unlock level.
- [DEVELOPMENT] Add object pooling
- [DEVELOPMENT] Add quad tree for bullets / enemies
- [DEVELOPMENT] Optimize the game, try CocoonJS with the full game.
- [GAME DESIGN] Explain more in depth the mechanichs. We need the life of the monster, when and where the bonus / enemies appear, how many damage they do, how they move, etc.
- [GAME DESIGN]**Some different mechanichs have to be analyzed in depth and sketched in notes for being evaluated as prototypes.**
- [ART] Create the intro scene composed by several subscenes that will be animated. Decide which pieces will be animated and how will they be moved. Some sort of fire/light effects could be added by the developer. 
- [ART] Talk with the lord audio leader for creating the best audio / image pair possible.
- [AUDIO] Make the intro scene audio. Make the best decisions on the audio of the beta. 

### Alpha enemies
This is the list of the implemented enemies
#### Various
This are random stuff that appears on the screen
![various_1](https://raw.githubusercontent.com/rafinskipg/BombTouch/master/documentation/enemies/unknown.png)

#### Rat
This sprite may be redone
![various_1](https://raw.githubusercontent.com/rafinskipg/BombTouch/master/documentation/enemies/rat.png)

#### Ship
This sprite needs more animation frames
![various_1](https://raw.githubusercontent.com/rafinskipg/BombTouch/master/documentation/enemies/ship.png)

#### To be implemented
![various_1](https://raw.githubusercontent.com/rafinskipg/BombTouch/master/app/images/arts/level_1.jpg)

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

throws balls of scrap metal and clich? souvenirs, very large health, slow movement, slow fire rate, big size


cooldog


--level 2: Antsteroid field

-enemy 1: asteroid ant workers (invader)

fast movement, small size, low health, no fire, attacks the player directly, kamikaze style. Appears in line formation approaching from one corner of the screen moving towards the player.

-enemy 2: asteroid ant soldiers (invader)

slow moving, large health, spits acid in the player's direction, harmful if touched, they move in vertical line formation but cover behind each other when shoot  

-enemy 3: symbiotic carnivorous funghi

static trap-like enemies, get to close and they will eat you, instant death, doesn't affect the ants

-final monster: asteroid ant queen

spawns ant workers, squirts acid in all directions



--level 3: slime nebula

-enemy 1: Lamprey guards (invader)

Medium health, medium speed.Shoots clouds of poisonous slime that will damage the player as long as he is in contact with it and greatly slow its speed. Moves in spear formation ( V ).

-enemy 2: electromagnetic eel (invader)

medium health, medium speed, moves in reverse spear formation, delivers electric shocks every few seconds that may damage the player if a certain distance, they will also shoot low damage sparks at the player.

-enemy 3: giant slime bubble

a big ball of sticky looking mucus floats through the screen, if the player touches it it will make him slower for X seconds

-enemy 4: galactic paramecium

low health, small size, medium slow movement, no fire, seeks the player, poisons and causes damage when hit.

-final monster: morbous dick, space sperm whale

mean looking rabid sperm whale pukes paramecium and shoots cannonballs from a rusty pirate cannon stuck in his head.


--weapons:

-freeze grenade-

a grenade that delivers a freeze shock that paralizes every monster in the screen

-plasma gun

basic gun shoots plasma balls at medium speed, medium damage, infinite ammo

-minigun

shoots bullets at very fast fire rate, low damage, 1000 bullets per clip

-seeker missile:

very high damage, never misses target enemy

-poison grenade

creates a cloud of poison that slowly drains enemies health

-flamethrower

damages greatly all enemies in a large area, ammo runs away fast

-the catacroker bomb

a bomb very difficult to find, delivers a massive amount of damage to every enemy on screen


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

First of all, generate the build with `grunt build` (it takes a while)

Then go to the latest crosswalk arm-x86 folder you downloaded from the Crosswalk project.

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