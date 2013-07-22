var pluginsText = '(function(){var e;var t=function(){};var n=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"];var r=n.length;var i=window.console=window.console||{};while(r--){e=n[r];if(!i[e]){i[e]=t;}}})();';

var fs = require('fs'),
    https = require('https'),
    http = require('http'),
    mkdirp = require('mkdirp');

var BIN = 'website',
    SRC = "project/develop/",
    FOLDERS = [BIN + "/cdn/images", BIN + "/cdn/fonts", BIN + "/cdn/sound", BIN + "/css", BIN + "/js/vendor", BIN + "/data", SRC + "/coffee", SRC + "/stylus"],

    index   = BIN + "/index.html",
    norm    = BIN + "/css/normalize.css",
    plugins = BIN + "/js/plugins.js",

    request = null,

    icon = 'http://www.unit9.com/wp-content/themes/unit9_2011/img/favicon.ico',
    boilerplate = 'https://raw.github.com/h5bp/html5-boilerplate/master/index.html',
    normalize = 'https://raw.github.com/h5bp/html5-boilerplate/master/css/normalize.css';

var color = {
    reset : '\x1b[0m',
    green : '\x1b[32m',
    red : '\x1b[31m'
};


function writeIndexBoilerplate(callBack)
{
    // download latest HTML5 boilerplate
    var indexFile = fs.createWriteStream(index);
    request = https.get(boilerplate, function(response) {
      response.pipe(indexFile);
      log("Default " + index + " created.");

      // download latest CSS normalize
      var cssNorm = fs.createWriteStream(norm);
        request = https.get(normalize, function(response) {
          response.pipe(cssNorm);

          log("Default " + norm + " created.");

          if(callBack) callBack();
        });
    });
}

function writePluginsJS(callBack)
{
    fs.writeFile(plugins, pluginsText, function(err) {
        if(err) {
            console.log(err);
        } else {
            log("Default " + plugins + " created.");
            if(callBack) callBack();
        }
    });
}

function writeDefaultIcon(callBack)
{
    var ico = fs.createWriteStream(BIN + "/favicon.ico");
    request = http.get(icon, function(response) {
      response.pipe(ico);

      log("Default " + BIN + "/favicon.ico" + " created.");

      if(callBack) callBack();
    });
}

function setup()
{
    mkdirp(BIN, function(err) {

        // create folders
        for(var i in FOLDERS) mkdirp(FOLDERS[i]);

        log("Default folders created.");

        writeIndexBoilerplate(function(){
            writePluginsJS(function(){
                writeDefaultIcon();
            });
        });
    });
}

function log(msg, error)
{
    error = error || false;
    console.log(error ? color.red : color.green + msg + color.reset);
}


setup();
