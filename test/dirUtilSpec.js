// Modules
const assert = require('assert');
const child_process = require('child_process');
const path = require('path');

// Utils
const dirUtil = require('../node/utils/dirUtil.js');

describe('dirUtil', function() {
    describe('#getHomeDir()', function () {
        it('should return the proper home directory of the current user', function () {
            const homeDir = child_process.execSync("echo $HOME | tr -d '\n'", {encoding: 'UTF8'});
            assert.equal(homeDir, dirUtil.getHomeDir());
        });
    });

    describe('#getPrompt()', function () {
        it("should return the prompt with $HOME in the path replaced by '~'", function () {
            const homeDir = dirUtil.getHomeDir();
            const fakeHomeDir = homeDir + "blerch";
            const relativeFakeHomeDir = homeDir.substr(1);

            // Matching
            assert.equal(path.join("/Fake", homeDir, "development/git"), dirUtil.getPrompt(path.join("/Fake", homeDir, "development/git")));
            assert.equal(path.join(fakeHomeDir, "development/git"), dirUtil.getPrompt(path.join(fakeHomeDir, "development/git")));
            assert.equal(path.join(relativeFakeHomeDir, "development/git"), dirUtil.getPrompt(path.join(relativeFakeHomeDir, "development/git")));
            assert.equal(relativeFakeHomeDir, dirUtil.getPrompt(relativeFakeHomeDir));

            // Non-matching
            assert.equal("~/development/git", dirUtil.getPrompt(path.join(homeDir, "development/git")));
            assert.equal("~", dirUtil.getPrompt(homeDir));
            assert.equal("~", dirUtil.getPrompt());
        });
    });

    describe('#getPwd()', function () {
        it("should return the process's current working directory", function () {
            assert.equal(dirUtil.getPwd(), process.cwd());
        });
    });

    describe('#setPwd(dir)', function () {
        it("should default to the homeDir if no parameter is provided", function () {
            dirUtil.setPwd();

            assert.equal(dirUtil.getPwd(), dirUtil.getHomeDir());
        });

        it("should change to the home dir if it is provided", function () {
            dirUtil.setPwd(dirUtil.getHomeDir());

            assert.equal(dirUtil.getPwd(), dirUtil.getHomeDir());
        });

        it("should be able to change to an existing relative path", function () {
            var newPwd = dirUtil.getDirectories(dirUtil.getHomeDir())[0];

            dirUtil.setPwd();
            dirUtil.setPwd(newPwd);

            assert.equal(dirUtil.getPwd(), path.join(dirUtil.getHomeDir(), newPwd));
        });

        it("should be able to change to an existing absolute path", function () {
            var newPwd = dirUtil.getDirectories(dirUtil.getHomeDir())[0];

            dirUtil.setPwd(path.join(dirUtil.getHomeDir(), newPwd));

            assert.equal(dirUtil.getPwd(), path.join(dirUtil.getHomeDir(), newPwd));
        });

        it("should not change to a non-existent path", function () {
            var nonExistentPath = "i/do/not/exist/i/think/hopefully";

            dirUtil.setPwd();
            dirUtil.setPwd(nonExistentPath);

            assert.equal(dirUtil.getHomeDir(), dirUtil.getPwd());
        });
    });

    describe('#getPwdAsPrompt()', function () {
        it("should return the process's current working directory as prompt display", function () {
            dirUtil.setPwd(dirUtil.getHomeDir());
            assert.equal('~', dirUtil.getPwdAsPrompt());
        });
    });
});