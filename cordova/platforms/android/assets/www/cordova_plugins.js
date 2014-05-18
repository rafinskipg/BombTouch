cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/uk.co.ilee.socialmessage/www/socialmessage.js",
        "id": "uk.co.ilee.socialmessage.SocialMessage",
        "clobbers": [
            "socialmessage"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/notification.js",
        "id": "org.apache.cordova.dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/android/notification.js",
        "id": "org.apache.cordova.dialogs.notification_android",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/com.google.cordova.plugin.AdMobPlugin/www/AdMobPlugin.js",
        "id": "com.google.cordova.plugin.AdMobPlugin.AdMob",
        "clobbers": [
            "window.admob"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.console": "0.2.7",
    "org.apache.cordova.device": "0.2.8",
    "uk.co.ilee.socialmessage": "0.2.6",
    "org.apache.cordova.dialogs": "0.2.7",
    "com.google.cordova.plugin.AdMobPlugin": "0.0.2"
}
// BOTTOM OF METADATA
});