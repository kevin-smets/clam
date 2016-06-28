const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

/**
 * Fetches the home directory.
 *
 * E.g. "/Users/kevinsmets"
 *
 * @returns {String}
 */
const getHomeDir = function () {
    return shell.env['HOME'];
};

/**
 * Replaces the home directory in a path with '~'. If no dir is provided, return '~' is returned.
 *
 * E.g. "/Users/kevinsmets/development/git" returns "~/development/git"
 * E.g. "/Users/kevinsmets" returns "~"
 *
 * @param dir the pwd
 * @returns {*}
 */
const getPrompt = function (dir) {
    if (!!dir) {
        const homeDir = getHomeDir();

        if (dir.indexOf(homeDir) == 0 && (dir[homeDir.length] == '/' || homeDir.length == dir.length)) {
            return dir.replace(getHomeDir(), '~');
        } else {
            return dir;
        }
    }

    return '~';
};

/**
 * Sets the process's pwd. Defaults to the user home directory.
 *
 * @param pwd
 */
const setPwd = function (pwd) {
    shell.cd(pwd);
};

/**
 * Gets the process's pwd.
 */
const getPwd = function () {
    return shell.pwd();
};

/**
 * Gets the process's pwd, to use for displaying in the prompt
 */
const getPwdAsPrompt = function () {
    return getPrompt(getPwd());
};

/**
 * Returns a list of directories in the given directory
 *
 * @param dirPath
 * @returns [] Array of directories
 */
function getDirectories(dirPath) {
    return fs.readdirSync(dirPath).filter(function (file) {
        return fs.statSync(path.join(dirPath, file)).isDirectory();
    });
}

module.exports = {
    getDirectories: getDirectories,
    getHomeDir: getHomeDir,
    getPrompt: getPrompt,
    getPwd: getPwd,
    getPwdAsPrompt: getPwdAsPrompt,
    setPwd: setPwd
};