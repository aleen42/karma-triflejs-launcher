## karma-triflejs-launcher

> Launcher for [TrifleJS](https://github.com/sdesalas/trifleJS) (developer version).

***Notice: Karma cannot capture headless IE8 / IE7.***

### Installation

```bash
npm install @aleen42/karma-triflejs-launcher --save-dev
```

### Configuration

- configuration file:

    ```js
    // karma.conf.js
    module.exports = config => {
        config.set({
            // ...
            browsers : ['IE9'],
            plugins  : [
                // ...
                '@aleen42/karma-triflejs-launcher',
            ],
            
            customLaunchers : {
                IE9 : {
                    base        : 'TrifleJS',
                    flags       : ['--emulate=IE9'],
                    platform    : 'windows',
                    displayName : 'IE9 (TrifleJS)',
                },
            },
            // ...
        });
    };
    ```

- CLI arguments:

    ```bash
    karma start --browsers TrifleJS
    ```

### Release History

* ==================== **1.0.0 Initial release** ====================
    * 1.0.1: fix parallel bug

### :fuelpump: How to contribute

Have an idea? Found a bug? See [How to contribute](https://wiki.aleen42.com/contribution.html).

### :scroll: License

[MIT](https://wiki.aleen42.com/MIT.html) © aleen42

----

For more information on Karma see the [homepage](http://karma-runner.github.io/).
