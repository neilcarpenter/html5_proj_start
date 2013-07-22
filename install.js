// append with your git ignore list of files
var git_ignore  = ["node_modules"];

var fs     = require('fs'),
    https  = require('https'),
    http   = require('http'),
    mkdirp = require('mkdirp');

var BIN = 'website',
    SRC = "project/develop/",
    FOLDERS = [BIN + "/cdn/images", BIN + "/cdn/fonts", BIN + "/cdn/sound", BIN + "/css", BIN + "/js/vendor", BIN + "/data", SRC + "/coffee", SRC + "/stylus"],

    index   = BIN + "/index.html",
    norm    = BIN + "/css/normalize.css",
    plugins = BIN + "/js/plugins.js",
    ignore  = ".gitignore",

    request = null,
    commandQueue = [],

    icon        = 'http://www.unit9.com/wp-content/themes/unit9_2011/img/favicon.ico',
    boilerplate = 'https://raw.github.com/h5bp/html5-boilerplate/master/index.html',
    normalize   = 'https://raw.github.com/h5bp/html5-boilerplate/master/css/normalize.css';

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
      // download latest CSS normalize
      var cssNorm = fs.createWriteStream(norm);
        request = https.get(normalize, function(response) {
          response.pipe(cssNorm);
          if(callBack) callBack();
        });
    });
}

function writePluginsJS(callBack)
{
    var pluginsText = '(function(){var e;var t=function(){};var n=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"];var r=n.length;var i=window.console=window.console||{};while(r--){e=n[r];if(!i[e]){i[e]=t;}}})();';
    fs.writeFile(plugins, pluginsText, function(err) {
        if(err) {
            console.log(err);
        } else {
            if(callBack) callBack();
        }
    });
}

function writeGitIgnore(callBack)
{
    fs.writeFile(ignore, git_ignore.toString().split(",").join("\n"), function(err) {
        if(err) {
            console.log(err);
        } else {
            if(callBack) callBack();
        }
    });
}


function writeDefaultIcon(callBack)
{
    var ico = fs.createWriteStream(BIN + "/favicon.ico");
    request = http.get(icon, function(response) {
      response.pipe(ico);

      if(callBack) callBack();
    });
}

function createDefaultFolders(callBack)
{
    total = FOLDERS.length - 2;
    current = 0;

    mkdirp(BIN, function(err) {

        // create folders
        for(var i in FOLDERS) mkdirp(FOLDERS[i], function(){
            if(current == total) if(callBack) callBack();
            current++;
        });
    });
}

function processQueue()
{
    commandQueue[0].c.apply(this, [commandComplete]);
}

function commandComplete()
{
    log(commandQueue[0].msg);

    if(commandQueue.length > 1)
    {
        commandQueue.shift();
        processQueue();
    } else {
        log("=) Ready to go\n");
    }
}

function log(msg, error)
{
    error = error || false;
    console.log(error ? color.red : color.green + msg + color.reset);
}

/*

Setup order of commands to process

*/

function setup()
{
    commandQueue = [];
    commandQueue.push({c : createDefaultFolders  , msg : "Folders -> OK"});
    commandQueue.push({c : writeIndexBoilerplate , msg : "Index Boilerplate -> OK"});
    commandQueue.push({c : writePluginsJS        , msg : "Default Plugins -> OK"});
    commandQueue.push({c : writeDefaultIcon      , msg : "Default Icon -> OK"});
    commandQueue.push({c : writeGitIgnore        , msg : "git ignore -> OK"});
    
    processQueue();
}


setup();
