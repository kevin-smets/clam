// Modules
const assert = require('assert');
const describe = require('mocha').describe;
const it = require('mocha').it;
const child_process = require('child_process');
const path = require('path');

// Utils
const dbUtil = require(path.join(process.cwd(), 'node/utils/dbUtil.js'));

describe('dbUtil', function () {
    describe('#setDatastoreFile()', function () {
        it('should not load a non existing db', function (done) {
            dbUtil.setDatastoreFile(path.join(process.cwd(), 'test/fixtures/db/corruptDb.json'))
                .catch(function () {
                    assert(typeof dbUtil.getDb() == "undefined");
                    done();
                })
        });
    });

    describe('#_getCmd(index)', function () {
        it('should reject a non existing index', function () {
            return dbUtil._getCmd(-1)
                .catch(function (err) {
                    assert(err != null);
                })
        });
    });

    describe('#setDatastoreFile()', function () {
        it('should load the db successfully', function (done) {
            dbUtil.setDatastoreFile(path.join(process.cwd(), 'test/fixtures/db/db.json'))
                .then(function () {
                    assert(typeof dbUtil.getDb() != "undefined");
                    done();
                })
        });
    });

    ['cat', 'subl', 'open .', 'ls', 'ls -la', 'ls -la'].forEach(function (cmd) {
        describe('#getPreviousCmd()', function () {

            it('should return the previous cmd', function () {
                return dbUtil.getPreviousCmd()
                    .then(function (prevCmd) {
                        assert.equal(prevCmd, cmd);
                    });
            })
        });
    });

    ['ls', 'open .', 'subl', 'cat', ''].forEach(function (cmd) {
        describe('#getNextCmd()', function () {

            it('should return the next cmd', function () {
                return dbUtil.getNextCmd()
                    .then(function (nextCmd) {
                        assert.equal(nextCmd, cmd);
                    });
            })
        });
    });
});