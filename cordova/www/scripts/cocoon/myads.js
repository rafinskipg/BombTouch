(function() {
    /***
    This demo only Works on the CocoonJS environment.
    */
    if(!CocoonJS.nativeExtensionObjectAvailable) return;

    var demo = {
        isHidden: false,
        position: CocoonJS.Ad.BannerLayout.BOTTOM_CENTER,
        x : 0,
        y : 0,
        width : 0,
        height : 0,
        ctx:null,
        fullScreenAdvertisement : null,
        fullScreenAlreadyDownloaded: false,
        params: {
            banner : {
                "status" : null
            },
            fullscreen : {
                "status" : null
            }
        }
    };

    demo.createAdBanners = function(){
        CocoonJS.Ad.onBannerShown.addEventListener(function()
        {
            console.log("onBannerShown");
            demo.params.banner.status = "onBannerShown";
            demo.isBannerHidden = false;
        });

        CocoonJS.Ad.onBannerHidden.addEventListener(function()
        {
            console.log("onBannerHidden");
            demo.params.banner.status = "onBannerHidden";
            demo.isBannerHidden = true;
        });

        CocoonJS.Ad.onBannerReady.addEventListener(function(width,height)
        {
            console.log("onBannerReady " + width, height);
            demo.layoutBanner();
        });

    }

    demo.layoutBanner = function() {
        var rect = CocoonJS.Ad.getRectangle();
        var dpr = window.devicePixelRatio;
        if (demo.position == CocoonJS.Ad.BannerLayout.TOP_CENTER) {
            rect.x = window.innerWidth * dpr/2 - rect.width/2;
            rect.y = 0;

        } else {
            rect.x = window.innerWidth * dpr/2 - rect.width/2;
            rect.y = window.innerHeight * dpr - rect.height;
        }

        CocoonJS.Ad.setRectangle(rect);
        if (!demo.isBannerHidden)
            CocoonJS.Ad.showBanner();
    }

    demo.createFullscreenAds = function(){
         // Pregame Fullscreen
         CocoonJS.Ad.onFullScreenShown.addEventListener(function()
         {
            demo.params.fullscreen.status = "onFullScreenShown";
            demo.params.fullscreen.sub_status = "";
            console.log("onFullScreenShown");
        });
        CocoonJS.Ad.onFullScreenHidden.addEventListener(function()
         {
            console.log("onFullScreenHidden");
            demo.params.fullscreen.status = "Full screen hidden,";
            demo.params.fullscreen.sub_status = "press CACHE AD to download another ad.";
        });
        CocoonJS.Ad.onFullScreenReady.addEventListener(function()
         {
            demo.fullScreenAlreadyDownloaded = true;
            demo.params.fullscreen.status = "Showing ad";
            demo.params.fullscreen.sub_status = "";
            CocoonJS.Ad.showFullScreen();
        });
     }

     demo.init = function(){

        var canvas= document.createElement("canvas");
        var dpr = window.devicePixelRatio;
        var w= 960;
        var h = 640;
        canvas.width= w;
        canvas.height= h;

        var scale = Math.min(window.innerHeight/h,window.innerWidth/w);

        canvas.style.position = "absolute";
        canvas.style.width = (w * scale) + "px";
        canvas.style.height = (h * scale) + "px";
        canvas.style.left = (window.innerWidth * 0.5 - w * scale * 0.5) + "px";
        canvas.style.top = (window.innerHeight * 0.5 - h * scale * 0.5) + "px";

        document.body.appendChild(canvas);

        ctx= canvas.getContext("2d");
        demo.ctx = ctx;
        var image= new Image();
        image.onload=function() {
            ctx.drawImage( image,0,0 );

            var touchOrClick = function(x, y)
            {
                var bound = canvas.getBoundingClientRect();
                x = (x - bound.left) / scale;
                y = (y - bound.top) / scale;

                if(x >= 540 && x <= 885 && y >= 200 && y <= 255){
                    CocoonJS.Ad.showBanner();
                }else if (x >= 540 && x <= 885 && y >= 273 && y <= 327){
                    CocoonJS.Ad.hideBanner();
                }else if (x >= 540 && x <= 885 && y >= 350 && y <= 403){
                    // Other way of laying the banners out, using a rect to set the area the banner is going to fill.
                    var rect = CocoonJS.Ad.getRectangle();

                    if (demo.position == CocoonJS.Ad.BannerLayout.BOTTOM_CENTER) {
                        demo.position = CocoonJS.Ad.BannerLayout.TOP_CENTER;
                    } 
                    else {
                        demo.position = CocoonJS.Ad.BannerLayout.BOTTOM_CENTER;
                    }
                    demo.layoutBanner();
                }else if (x >= 540 && x <= 885 && y >= 430 && y <= 482){
                    demo.params.banner.status = "Downloading banner...";
                    CocoonJS.Ad.refreshBanner();
                }else if (x >= 77 && x <= 418 && y >= 200 && y <= 254){
                    demo.params.fullscreen.status = "Showing ad";
                    demo.params.fullscreen.sub_status = "";
                    CocoonJS.Ad.showFullScreen();
                }else if (x >= 77 && x <= 418 && y >= 272 && y <= 325){
                    console.log("Downloading fullscreen...");
                    demo.params.fullscreen.status = "Downloading full screen...";
                    demo.params.fullscreen.sub_status = "";
                    CocoonJS.Ad.refreshFullScreen();
                }else{
                    console.log("No button selected: ", x | 0 , y | 0);
                }

            }

            canvas.addEventListener(
                "touchstart",
                function( touches ) {
                    var that = touches.targetTouches[0];

                        var x= that.pageX;
                        var y= that.pageY;
                        touchOrClick(x, y);

                },
                false
                );
            setInterval(function(){

                ctx.clearRect(0,0,window.innerWidth,window.innerHeight);

                ctx.drawImage(image,0,0);

                ctx.fillStyle = '#888';
                ctx.font = '22px Arial';
                ctx.textBaseline = 'bottom';
                ctx.fillText('Full screen status: '+demo.params.fullscreen.status, 77, 510);
                ctx.fillText('Banner status: '+demo.params.banner.status, 540, 510);
                ctx.fillText(demo.params.fullscreen.sub_status, 77, 530);

            },1000 / 60);

        };
        image.src="resources/images/asiqueda.png";
    }
    /***
    * So here is the magic, the following method is the best way to create banners and show them on the screen:
    * - Create the banners // fullscreen ads (this will add the listeners to manage the ads)
    * - When there is an ad cached, you will be notified by the onBannerReady method, then you can show it.
    *
    * More information about the ads extension can be found here:
    * https://ludei.zendesk.com/hc/en-us/articles/200767308-Ads
    */

    // Create banner ads trought the CocoonJS Ads extension
    //demo.createAdBanners();
    // Create fullscreen ads trought the CocoonJS Ads extension
    demo.createFullscreenAds();

    /*
        Download ad banners // fullscreen ads
    */
    CocoonJS.Ad.preloadBanner();
    //TODO CHECK THIS: http://support.ludei.com/hc/communities/public/questions/200869726-Basic-Ad-Implementation-
    var bannerParams = {
        "bannerAdUnit": "384920304a74405db071f834ca65afaa",
        refresh: 30 //Whatever you want
    }
    CocoonJS.Ad.preloadFullScreen(bannerParams);

    /***
    * Ads are ready, show the canvas to manage them:
    */
    demo.params.banner.status = "Downloading banner...";
    demo.params.fullscreen.status = "Downloading full screen...";
    demo.params.fullscreen.sub_status = "";

    var addInterstitial =  function() {
        var successCreateBannerView = function() { console.log("addInterstitial Success"); 
        
        var success = function() { console.log("requestAd Success"); };
        var error = function(message) { console.log("Oopsie! " + message); };
        admob.requestAd({'isTesting': false},success,error); };
        var options = {
            'publisherId': 'ca-app-pub-6642955064281280/7366083050'
        }
        admob.createInterstitialView(options,successCreateBannerView,error);
    };
    
    var killAd = function() {
        var success = function() { console.log("killAd Success"); };
        var error = function(message) { console.log("Oopsie! " + message); };
        admob.killAd(success,error);
    }

    addInterstitial();

})();



