## BombTouch
----------
Nyancat is a super sayan!

[DEMO](http://rvpg.me/experiments/BombTouch/)

TODO :
- Adjust life / damage of enemies.
- Add a animation when you are hit
- Make boss bullets go faster
- Add sounds when you are hit
- add sounds when the boss enters
- Add lifes like bonuses


## Contribute!!
- Add new levels
- Add better sprites for the boss
- New shooting modes
- Add flying bonuses that changes your shoot 
- Add wathever you want!!

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



