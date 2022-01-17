const fs = require('fs');
const path = require('path');
const Jobs = require('qjobs');

// TrifleJS can only emulate one version at once
const jobs = new Jobs({maxConcurrency : 1});

function serializeOption(value) {
    if (typeof value === 'function') {
        return value.toString();
    }
    return JSON.stringify(value);
}

function trifleDir() {
    return path.join(__dirname, 'TrifleJS');
}

function trifleJSExePath() {
    return path.join(trifleDir(), 'TrifleJS.exe');
}

function TrifleJSBrowser(baseBrowserDecorator, config, args) {
    const self = this;
    baseBrowserDecorator(self);

    const options = (args && args.options) || (config && config.options) || {};
    const flags = (args && args.flags) || (config && config.flags) || [];

    self._start = url => {
        // Create the js file that will open Karma
        // noinspection JSUnresolvedVariable
        const captureFile = path.join(self._tempDir, 'capture.js');
        let optionsCode = Object.keys(options).map(key => {
            if (key !== 'settings') { // settings cannot be overridden, it should be extended!
                return `page.${key} = ${serializeOption(options[key])};`;
            }
        });

        if (options.settings) {
            optionsCode = optionsCode.concat(Object.keys(options.settings).map(key =>
                `page.settings.${key} = ${serializeOption(options.settings[key])};`));
        }

        const captureCode = 'var page = require("webpage").create();\n'
                            + optionsCode.join('\n') + '\npage.open("' + url + '");\n';
        fs.writeFileSync(captureFile, captureCode);

        // Start trifleJS
        jobs.add((args, done) => {
            // noinspection JSUnresolvedFunction
            self._execCommand(self._getCommand(), flags.concat(captureFile));
            self.on('done', done);
        }, []);

        jobs.run();
    };

}

TrifleJSBrowser.prototype = {
    name        : 'TrifleJS',
    DEFAULT_CMD : {
        win32 : trifleJSExePath(),
    },
    ENV_CMD     : 'trifleJS_BIN',
};

TrifleJSBrowser.$inject = ['baseBrowserDecorator', 'config.triflejsLauncher', 'args'];

// PUBLISH DI MODULE
module.exports = {'launcher:TrifleJS' : ['type', TrifleJSBrowser]};
