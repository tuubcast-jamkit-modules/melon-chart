var module = (function() {
    const webjs = require("webjs-helper");

    var _id = "", _handlers = [];
    var _dir_path = "";
    var _web_loaded = false;
    var _chart_selected = false;
   
    function _on_web_start(data) {
        if (data["url"].includes("main_chart.htm")) {
            console.log(JSON.stringify(data))
            webjs.call("expandChartList")
                .then(function(result) {
                    /* Do nothing */
                })
                .catch(function(error) {
                    console.log(JSON.stringify(error));
                });

            _chart_selected = true;
    
            return
        }
    
        if (data["url"].includes("main_chartPaging.htm")) {
            _handlers.forEach(function(handler) {
                handler();
            });

            _web_loaded = true, _handlers = [];
    
            return
        }
    }

    function _on_web_loaded(data) {
        if (data["url"].startsWith("https://m2.melon.com/onboarding")) {
            webjs.import(_dir_path + "/melon.js");
            webjs.call("fireInnerButton")
                .then(function(result) {
                    /* Do nothing */
                })
                .catch(function(error) {
                    console.log(JSON.stringify(error))
                });

            return;
        }

        if (data["url"].startsWith("https://m2.melon.com/buy/pamphlet")) {
            view.object(data["id"]).action("home");

            return;
        }

        if (!_chart_selected) {
            webjs.import(_dir_path + "/melon.js");
            webjs.call("goMainChart")
                .then(function(result) {
                    /* Do nothing */
                })
                .catch(function(error) {
                    console.log(JSON.stringify(error))
                });
        } else {
            webjs.import(_dir_path + "/melon.js");
            webjs.call("expandChartList")
                .then(function(result) {
                    /* Do nothing */
                })
                .catch(function(error) {
                    console.log(JSON.stringify(error));
                });
        }
    }

    return {
        initialize: function(id) {
            var web_prefix = id.replace(".", "_");
            var dir_path = this.__ENV__["dir-path"];
            
            global[web_prefix + "__on_web_start"] = function(data) {
                if (data["is-for-main-frame"] === "yes") {
                    webjs.configure(id + ".web", "__$_bridge");
                }
                
                _on_web_start(data);
            }

            global[web_prefix + "__on_web_loaded"] = function(data) {
                _on_web_loaded(data);
            }

            view.object(id).action("load", { 
                "filename": dir_path + "/web.sbml",
                "web-id": id, 
                "web-prefix": web_prefix
            });

            _id = id, _dir_path = dir_path;

            return this;
        },

        get_top_musics: function() {
            return new Promise(function(resolve, reject) {
                var handler = function() {
                    webjs.call("getTopMusics")
                        .then(function(result) {
                            resolve(result);
                        })
                        .catch(function(error) {
                            reject(error);
                        });
                }

                _web_loaded ? handler() : _handlers.push(handler);
            });
        },
    }
})();

__MODULE__ = module;
