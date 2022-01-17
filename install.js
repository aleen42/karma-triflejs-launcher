const fs = require('fs');
const dirname = 'TrifleJS';
const filename = `${dirname}.Latest.zip`;
const path = require('path');
const request = require('request');
const unzip = require('unzipper');
const formatUrl = require('url').format;

function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        const files = fs.readdirSync(path);
        files.forEach(file => {
            const curPath = `${path}/${file}`;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

deleteFolderRecursive(dirname);
fs.mkdirSync(dirname);
const zipName = path.join(dirname, filename);

const proxyUrl = process.env.npm_config_https_proxy
                 || process.env.npm_config_http_proxy
                 || process.env.npm_config_proxy;

// noinspection JSUnresolvedFunction
request({
    // Stable: https://github.com/sdesalas/trifleJS/releases/download/v0.4/TrifleJS.zip
    // Beta: https://github.com/sdesalas/trifleJS/raw/master/Build/Binary/TrifleJS.Latest.zip
    uri            : `https://github.com/sdesalas/trifleJS/raw/master/Build/Binary/${filename}`,
    // Use the user-agent string from the npm config
    headers        : {'User-Agent' : process.env.npm_config_user_agent},
    // The default download path redirects to a CDN URL
    followRedirect : true,
    ...proxyUrl && (proxy => {
        // Print using proxy
        const proxyInfo = new URL(proxyUrl);
        if (proxyInfo.auth) {
            // Mask password
            proxyInfo.auth = proxyInfo.auth.replace(/:.*$/, ':******');
        }
        console.log(`Using proxy ${formatUrl(proxyInfo)}`);

        // Enable proxy
        return {proxy};
    })(proxyUrl),
}).pipe(fs.createWriteStream(zipName))
    .on('close', () => {
        fs.createReadStream(zipName).pipe(
            unzip.Extract({path : dirname}).on('close', () => {
                fs.unlinkSync(zipName);
            })
        );
    });
