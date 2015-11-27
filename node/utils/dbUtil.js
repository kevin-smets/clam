const Promise = require('promise');

// Init the db
const Datastore = require('nedb');

var db;

var dbLength = 0;
var activeIndex = 0;

const _getCmd = function (index) {
    return new Promise(function (resolve, reject) {
        db.find({n: index}, function (err, docs) {
            if (!err && docs.length == 1) {
                resolve(docs[0].cmd);
            }

            reject(err);
        });
    });
};

const getDb = function () {
    return db;
};

const getPreviousCmd = function () {
    if (activeIndex <= 1) {
        activeIndex = 1;
    } else {
        activeIndex--;
    }

    return _getCmd(activeIndex);
};

const getNextCmd = function () {
    if (activeIndex >= dbLength) {
        activeIndex = dbLength;
        return new Promise(function (resolve) {
            resolve("")
        })
    } else {
        activeIndex++;
    }

    return _getCmd(activeIndex)
};

function setDatastoreFile(filePath) {
    return new Promise(function (resolve, reject){
        db = new Datastore({filename: filePath});
        db.loadDatabase(function(err){
            if (err != null) {
                console.log(err);
                db = undefined;
                return reject(err);
            }

            console.log("Loaded db: " + filePath );

            db.count({}, function (err, count) {
                console.log(count);
                dbLength = count;
                // Used to keep track of which cmd to show on 'up'
                activeIndex = count + 1;
                resolve()
            });
        });
    });
}

module.exports = {
    _getCmd: _getCmd,
    getDb: getDb,
    getNextCmd: getNextCmd,
    getPreviousCmd: getPreviousCmd,
    setDatastoreFile: setDatastoreFile
};