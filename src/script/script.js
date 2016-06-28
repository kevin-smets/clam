(function () {
    var form, input, searchInput, searchResults, searchWrapper, ipc, log, prompt, specialKeys;

    // Main (Electron) process
    ipc = require('electron').ipcRenderer;

    // DOM elements
    form = document.getElementById("form");
    input = document.getElementById("input");
    searchInput = document.getElementById("search__input");
    searchResults = document.getElementById("search__results");
    searchWrapper = document.getElementById("search__wrapper");
    log = document.getElementById("log");
    prompt = document.getElementById("prompt");

    // 'Model'
    specialKeys = {};

    /**
     * Prevents the form from actually submitting (which trigger a page refresh)
     * Sends the input to the main process instead.
     */
    form.addEventListener('submit', function (e) {
        ipc.send('submit', input.value);
        input.value = "";
        e.preventDefault();
    });

    /**
     * Sets the caret at the end on focus
     */
    input.addEventListener('focus', function () {
        input.value = input.value;
    });

    /**
     * Processes speshiul keys such as tab, up, down, ...
     * But also registers modifier keys (ctrl, alt, shift)
     */
    input.addEventListener('keydown', function (e) { // Has to be keydown, otherwise it's too late to intercept things such as tabs in the webview
        if (e.altKey || e.ctrlKey || e.shiftKey) {
            if (e.altKey)
                specialKeys.altKey = true;

            if (e.ctrlKey)
                specialKeys.ctrlKey = true;

            if (e.shiftKey)
                specialKeys.shiftKey = true;
        }

        if (e.ctrlKey ) {
            if (e.which == 82) { // R
                searchWrapper.style.transform = 'none';
                searchInput.focus();
                e.preventDefault();
            }
        }

        var sendKey = function (e, key, data) {
            ipc.send('key-' + key, data);
            e.preventDefault();
        };

        switch (e.which) {
            case 9:
                sendKey(e, 'tab', input.value);
                break;
            case 38:
                sendKey(e, 'up');
                break;
            case 40:
                sendKey(e, 'down');
                break;
        }
    });

    /**
     * Unregisters modifier keys
     */
    input.addEventListener('keyup', function (e) {
        if (e.which == 16)
            specialKeys.shiftKey = false;

        if (e.which == 18)
            specialKeys.altKey = false;

        if (e.which == 17)
            specialKeys.ctrlKey = false;
    });

    /**
     * Processes speshiul keys such as tab, up, down, ctrl, alt, shift...
     */
    searchInput.addEventListener('keyup', function (e) {
        if (e.which == 27) { // Esc
            searchWrapper.style.transform = 'translateY(-100%)';
            input.focus();
            e.preventDefault();
        }

        if (searchInput.value != "") {
            ipc.send('search', searchInput.value);
        }else {
            searchResults.innerHTML = "";
        }
    });

    /**
     * Focuses the terminal input
     */
    document.addEventListener('click', function () {
        input.focus();
    });


    /**
     * Refreshes the prompt with the cwd of the main process
     */
    ipc.on('pwd', function (sender, pwd) {
        prompt.innerHTML = pwd;
    });

    /**
     * Sends the requested cmd from the db
     */
    ipc.on('cmd', function (sender, cmd) {
        input.value = cmd;
    });

    /**
     * Processes the search results
     */
    ipc.on('search-reply', function (docs) {
        // TODO: avoid DOM trashing
        searchResults.innerHTML = "";

        if (!!docs) {
            docs.forEach(
                function(doc){
                    var result = document.createElement("div");
                    result.setAttribute('class', 'search__result');
                    var command = document.createTextNode(doc.cmd);
                    result.appendChild(command);
                    searchResults.appendChild(result);
                }
            )
        }

    });

    /**
     * Logs the output of the main process to the view,
     * most likely the result of the execution of a command
     */
    ipc.on('reply', function (sender, reply) {
        if (!!reply && reply.trim() != "") {
            var pre, text;
            pre = document.createElement("div");
            pre.setAttribute('class', 'stdout');
            text = document.createTextNode(reply);
            pre.appendChild(text);
            log.appendChild(pre);

            // hljs.highlightBlock(pre); // TODO this has to become conditional, only actual code should be highlighted, e.g. after cat
        }

        window.scrollTo(0, document.body.scrollHeight);
    });

    // Set the prompt, always. Also on refresh.
    prompt.innerHTML = ipc.send('pwd-get');

}).call(this);