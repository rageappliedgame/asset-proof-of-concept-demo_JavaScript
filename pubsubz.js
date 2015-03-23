/*!
* Pub/Sub implementation
* http://addyosmani.com/
* Licensed under the GPL
* http://jsfiddle.net/LxPrq/
*/

// todo error checks on nil/undefined objects (as func in subscribers[len].func(topic, args) ?).
// todo add sender in publish (or is args enough)?
// todo add some more bookkeeping (like list events).
// todo use the hashtable from AssetManager instead (so rewrite this code)?
// 
// done added pubsubz.define(topic) method.
// 
; (function (window, doc, undef) {

    var topics = {},
        subUid = -1,
        pubsubz = {};

    /// <summary>
    /// Defines this object.
    /// </summary>
    ///
    /// <param name="topic"> The topic. </param>
    pubsubz.define = function (topic) {

        if (!topics[topic]) {
            topics[topic] = [];
        }
    }

    /// <summary>
    /// Publishes.
    /// </summary>
    ///
    /// <param name="topic"> The topic. </param>
    /// <param name="args">  The arguments. </param>
    ///
    /// <returns>
    /// true if the topic exists
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

    pubsubz.unsubscribe = function (token) {
        for (var m in topics) {
            if (topics[m]) {
                for (var i = 0, j = topics[m].length; i < j; i++) {
                    if (topics[m][i].token === token) {
                        topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return false;
    };

    getPubSubz = function () {
        return pubsubz;
    };

    window.pubsubz = getPubSubz();

}(this, this.document));
