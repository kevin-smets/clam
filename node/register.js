const dirUtil = require('./utils/dirUtil.js');
const ipc = require('electron').ipcMain;
const path = require('path');
const shell = require('shelljs');

module.exports = function () {
    // Get the user home dir and set it as pwd for the process
    shell.pushd(dirUtil.getHomeDir(), {silent: true});
    console.log('Pwd set to ' + process.cwd());

    ipc.on('search', function (event, data) {
        db.find({cmd:  new RegExp(data)}, function(err, docs){
            if (!err) {
                event.sender.send('search-reply', docs);
            }
        });
    });

    ipc.on('pwd-get', function (event) {
        event.sender.send('pwd', dirUtil.getPrompt(process.cwd()));
    });
};