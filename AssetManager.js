/// <summary>
/// A Simple Asset Manager class that registers instances of classes and supplies some
/// bookkeeping methods to allow inter asset communication.
/// 
/// Based on a pattern in http://addyosmani.com/resources/essentialjsdesignpatterns/book/.
/// 
/// TODO add loadScriptAsync/loadScriptSync to AssetManager's public interface.
/// TODO typescript implementation.
/// </summary>
var AssetManager = (function () {

    /// <summary>
    /// Instance stores a reference to the Singleton.
    /// </summary>
    var instance;

    /// <summary>
    /// See http://stackoverflow.com/questions/950087/include-a-javascript-file-in-another-javascript-
    /// file.
    /// </summary>
    ///
    /// <param name="url">      URL of the document. </param>
    /// <param name="callback"> The callback. </param>
    ///
    /// <returns>
    /// The script.
    /// </returns>
    function loadScriptAsync(url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    }

    /// <summary>
    /// See http://stackoverflow.com/questions/2879509/dynamically-loading-javascript-synchronously
    /// See https://github.com/addyosmani/pubsubz.
    /// </summary>
    ///
    /// <param name="url"> URL of the document. </param>
    function loadScriptSync(url) {
        var xhrObj = new XMLHttpRequest();
        xhrObj.open('GET', 'pubsubz.js', false);
        xhrObj.send(null);
        eval(xhrObj.responseText);
    }

    /// <summary>
    /// Ported from http://www.mojavelinux.com/articles/javascript_hashes.html 
    /// © Mojavelinux, Inc
    /// Document Version: 1.3 Last Modified: Fri Mar 4, 2012 
    /// License: Creative Commons Attribution-ShareAlike 3.0 Unported License.
    /// </summary>
    function HashTable() {

        /// <summary>
        /// Init.
        /// </summary>
        this.length = 0;

        /// <summary>
        /// An object that holds the hash table items.
        /// 
        /// The keys are property names, 
        /// the property values are the objects stored in the hast table.
        /// </summary>
        this.items = {};

        /// <summary>
        /// Sets an item.
        /// </summary>
        ///
        /// <param name="key">   The key. </param>
        /// <param name="value"> The value. </param>
        ///
        /// <returns>
        /// The previous value if defined.
        /// </returns>
        this.setItem = function (key, value) {
            var previous = undefined;
            if (this.hasItem(key)) {
                previous = this.items[key];
            }
            else {
                this.length++;
            }
            this.items[key] = value;
            return previous;
        }

        /// <summary>
        /// Gets an item.
        /// </summary>
        ///
        /// <param name="key"> The key. </param>
        ///
        /// <returns>
        /// The item.
        /// </returns>
        this.getItem = function (key) {
            return this.hasItem(key) ? this.items[key] : undefined;
        }

        /// <summary>
        /// Has item.
        /// </summary>
        ///
        /// <param name="key"> The key. </param>
        ///
        /// <returns>
        /// true if the item for the key is found
        /// </returns>
        this.hasItem = function (key) {
            return this.items.hasOwnProperty(key);
        }

        /// <summary>
        /// Removes the item described by key.
        /// </summary>
        ///
        /// <param name="key"> The key. </param>
        ///
        /// <returns>
        /// The value of the removed key.
        /// </returns>
        this.removeItem = function (key) {
            if (this.hasItem(key)) {
                previous = this.items[key];
                this.length--;
                delete this.items[key];
                return previous;
            }
            else {
                return undefined;
            }
        }

        /// <summary>
        /// Keys this object.
        /// 
        /// If used with foreach it returns the indexes and not the key values themselves.
        /// </summary>
        ///
        /// <returns>
        /// The keys of the hash table.
        /// </returns>
        this.keys = function () {
            var keys = [];
            for (var k in this.items) {
                if (this.hasItem(k)) {
                    keys.push(k);
                }
            }
            return keys;
        }

        /// <summary>
        /// Values this object.
        /// </summary>
        ///
        /// <returns>
        /// The values in the hash table.
        /// </returns>
        this.values = function () {
            var values = [];
            for (var k in this.items) {
                if (this.hasItem(k)) {
                    values.push(this.items[k]);
                }
            }
            return values;
        }

        /// <summary>
        /// Applies a method to each of the hash table items.
        /// </summary>
        ///
        /// <param name="fn"> The function. </param>
        this.each = function (fn) {
            for (var k in this.items) {
                if (this.hasItem(k)) {
                    fn(k, this.items[k]);
                }
            }
        }

        /// <summary>
        /// Clears this object to its blank/initial state.
        /// </summary>
        this.clear = function () {
            this.items = {}
            this.length = 0;
        }

    }

    /// <summary>
    /// The test subscriber.
    /// </summary>
    var testSubscriber;

    /// <summary>
    /// The test subscription.
    /// </summary>
    var testSubscription;

    /// <summary>
    /// The initialise event system.
    /// 
    /// See https://github.com/addyosmani/pubsubz
    /// 
    /// Note: because of the setTimeout used in pubSubz the assets subscribing later will get to see this event.
    /// </summary>
    var initEventSystem = function () {
        pubsubz.define('EventSystem.Init');

        pubsubz.publish('EventSystem.Init', 'hello event!');
    };

    /// <summary>
    /// The assets hash table.
    /// </summary>
    var assets = new HashTable();

    /// <summary>
    /// Initialises this object.
    /// </summary>
    ///
    /// <returns>
    /// The asset manager.
    /// </returns>
    function init() {

        // Singleton
        //
        console.log("AssetManager.init()")

        // Async external script loading.
        // 
        // loadScript("pubsubz.js", initEventSystem);

        // See http://stackoverflow.com/questions/2879509/dynamically-loading-javascript-synchronously
        // See https://github.com/addyosmani/pubsubz
        //
        loadScriptSync('pubsubz.js');

        initEventSystem();

        console.log("After initEventSystem");

        // Private methods and variables
        // 
        //function privateMethod() {
        //    console.log("I am private");
        //}

        /// <summary>
        /// User to generate uniqueId's for registered assets.
        /// </summary>
        var idGenerator = 0;

        // var privateVariable = "Im also private";

        // var privateRandomNumber = Math.random();

        return {

            // Public methods and variables
            // 
            //publicMethod: function () {
            //    console.log("The public can see me!");
            //},

            //publicProperty: "I am also public",

            //getRandomNumber: function () {
            //    return privateRandomNumber;
            //},

            /// <summary>
            /// Registers the asset instance.
            /// </summary>
            ///
            /// <param name="asset"> The asset. </param>
            /// <param name="claz">  The claz. </param>
            ///
            /// <returns>
            /// .
            /// </returns>
            registerAssetInstance: function (asset, claz) {
                // console.log(name);
                // This does not work if we can remove or rename items! 
                // Unless the length of the array never shrinks.

                var keys = assets.keys();
                for (i = 0; i < assets.length; i++) {
                    if (assets.getItem(keys[i]) === asset) {
                        return keys[i];
                    }
                }

                var Id = claz + "_" + (idGenerator++).toString(); //assets.length

                asset.Id = Id;

                console.log("Registering Asset " + typeof (asset) + "/" + claz + " as " + Id);

                //todo check for dupes.
                assets.setItem(Id, asset);

                console.log("Registered " + assets.length + " Asset(s)");

                return Id;
            },

            /// <summary>
            /// Returns the exact match.
            /// </summary>
            ///
            /// <param name="id"> The identifier. </param>
            ///
            /// <returns>
            /// The found asset by identifier.
            /// </returns>
            findAssetById: function (id) {
                return assets.getItem(id);
            },

            /// <summary>
            /// Returns the first match by class.
            /// </summary>
            ///
            /// <param name="claz"> The claz. </param>
            ///
            /// <returns>
            /// The found asset by class.
            /// </returns>
            findAssetByClass: function (claz) {
                var keys = assets.keys();

                for (i = 0; i < assets.length; i++)
                    if (keys[i].indexOf(claz + "_") == 0) {
                        return assets.getItem(keys[i]);
                    }

                return null;
            },

            /// <summary>
            /// Searches for the first assets by class.
            /// </summary>
            ///
            /// <param name="claz"> The claz. </param>
            ///
            /// <returns>
            /// The found assets by class.
            /// </returns>
            findAssetsByClass: function (claz) {
                var keys = assets.keys();
                var results = [];

                for (i = 0; i < assets.length; i++) {
                    if (keys[i].indexOf(claz + "_") == 0) {
                        results.push(assets.getItem(keys[i]));
                    }
                }

                return results;
            },
        };
    };

    // Return (and create once) the instance.
    // 
    return {

        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function () {
            if (!instance) {
                instance = init();
            }

            return instance;
        },
    };

})();