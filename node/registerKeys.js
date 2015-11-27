const ipc = require('electron').ipcMain;
const path = require('path');
const shell = require('shelljs');
const dbUtil = require('./utils/dbUtil');
const db = dbUtil.getDb();

module.exports = function () {
    ipc.on('key-tab', function (event, cmd) {
        if (cmd === "") {
            var child = shell.exec("ls", {async: true, silent: true});
            child.stdout.on('data', function (data) {
                if (!!data)
                    event.sender.send('reply', data)
            });
            child.stderr.on('data', function (data) {
                if (!!data)
                    event.sender.send('reply', data)
            });
        }
    });

    ipc.on('key-up', function (event) {
        dbUtil.getPreviousCmd()
            .then(function (cmd) {
                event.sender.send('cmd', cmd);
            })
    });

    ipc.on('key-down', function (event) {
        dbUtil.getNextCmd()
            .then(function (cmd) {
                event.sender.send('cmd', cmd);
            })
    });

    ipc.on('submit', function (event, cmd) {
        if (!cmd || cmd === "") {
            return
        }

        // Save the cmd to db and reset the counter
        db.count({}, function (err, count) {
            db.insert({
                n: count + 1,
                cmd: cmd
            }, function (err, newDoc) {
                if (!err) {
                    dbLength = count + 1;
                    counter = count + 1;
                    console.log ("Saved '" + cmd + "' with _id " + newDoc._id);
                } else {
                    dbLength = count;
                    counter = count;
                    console.log ("Something went wrong when saving the cmd:'" + cmd);
                }

            });
        });

        // Exec the cmd
        if (cmd.indexOf('cd') == 0) {
            var cdParam = cmd.split(' ')[1];
            var out = dirUtil.setPwd(cdParam);

            if (!!out) {
                event.sender.send('pwd', out);
            } else {
                event.sender.send('reply', cdParam + ': no such file or directory')
            }
        } else {
            var child = shell.exec(cmd, {async: true, silent: true});
            var output = "";

            child.on('exit', function (c) {
                console.log(output);
                console.log('Exit code is ' + c);
                event.sender.send('reply', output);
            });

            child.stdout.on('data', function (data) {
                if (!!data)
                    output += data;
            });

            child.stderr.on('data', function (data) {
                if (!!data)
                    output += data;
            });
        }
    });
};