/*!
* Pub/Sub implementation
* http://addyosmani.com/
* Licensed under the GPL
* http://jsfiddle.net/LxPrq/
*/

// veg@ou.nl:
// 
// todo error checks on nil/undefined objects (as func in subscribers[len].func(topic, args) ?).
// todo add sender in publish (or is args enough)?
// todo add some more bookkeeping (like list events).
// todo use the hashtable from AssetManager instead (so rewrite this code)?
// 
// done added pubsubz.define(topic) method.
// done changed some methods return values to be more consistent.
// 

/// <summary>
/// A pubsubz class.
/// </summary>
; (function (window, doc, undef) {

    /// <summary>
    /// The topics.
    /// </summary>
    var topics = {};

    /// <summary>
    /// The sub UID.
    /// </summary>
    var subUid = -1;

    var pubsubz = {};

    /// <summary>
    /// Defines this object.
    /// </summary>
    ///
    /// <param name="topic"> The topic. </param>
    ///
    /// <returns>
    /// true if newly defined, false if already defined.
    /// </returns>
    pubsubz.define = function (topic) {

        if (!topics[topic]) {
            topics[topic] = [];

            return true;
        }

        return false;
    }

    /// <summary>
    /// Publishes.
    /// </summary>
    ///
    /// <param name="topic"> The topic. </param>
    /// <param name="args">  The arguments. </param>
    ///
    /// <returns>
    /// true if the topic exists else false.
    /// </returns>
    pubsubz.publish = function (topic, args) {

        if (!topics[topic]) {
            return false;
        }

        setTimeout(function () {
            var subscribers = topics[topic],
                len = subscribers ? subscribers.length : 0;

            while (len--) {
                subscribers[len].func(topic, args);
            }
        }, 0);

        return true;
    };

    /// <summary>
    /// Subscribes.
    /// </summary>
    ///
    /// <param name="topic"> The topic. </param>
    /// <param name="func">  The function. </param>
    ///
    /// <returns>
    /// the event subscription token.
    /// </returns>
    pubsubz.subscribe = function (topic, func) {

        if (!topics[topic]) {
            topics[topic] = [];
        }

        var token = (++subUid).toString();
        topics[topic].push({
            token: token,
            func: func
        });

        return token;
    };

    /// <summary>
    /// Unsubscribes the given event subscription token.
    /// </summary>
    ///
    /// <param name="token"> The event subscription token. </param>
    ///
    /// <returns>
    /// true if unsubscribed else false.
    /// </returns>
    pubsubz.unsubscribe = function (token) {
        for (var m in topics) {
            if (topics[m]) {
                for (var i = 0, j = topics[m].length; i < j; i++) {
                    if (topics[m][i].token === token) {
                        topics[m].splice(i, 1);
                        return true;
                    }
                }
            }
        }
        return false;
    };

    /// <summary>
    /// Gets pubsubz instance.
    /// </summary>
    ///
    /// <returns>
    /// The pub subz.
    /// </returns>
    getPubSubz = function () {
        return pubsubz;
    };

    window.pubsubz = getPubSubz();

}(this, this.document));
