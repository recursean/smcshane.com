/**
 * This is the main web server for smcshane.com
 */

const express = require('express')
const fs = require('fs')
const fsp = require('fs').promises
const https = require('https')

const app = express()
const port = 443

// Read in self-signed certificate for HTTPS
var key = fs.readFileSync(__dirname + '/certs/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt');
var options = {
  key: key,
  cert: cert
};

// arphotoview-privacy.html
app.get('/arphotoview-privacy', (req, res) => {
    fsp.readFile(__dirname + "/html/arphotoview-privacy.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
})

// arphotoview.html
app.get('/arphotoview', (req, res) => {
    fsp.readFile(__dirname + "/html/arphotoview.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
})

// contact.html
app.get('/contact', (req, res) => {
    fsp.readFile(__dirname + "/html/contact.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
})

// index.html
app.get('/', (req, res) => {
    fsp.readFile(__dirname + "/html/index.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
})

// newscloud.html
app.get('/newscloud', (req, res) => {
    fsp.readFile(__dirname + "/html/newscloud.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
})

// saf.html
app.get('/saf', (req, res) => {
    fsp.readFile(__dirname + "/html/saf.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
})

// upick-privacy.html
app.get('/upick-privacy', (req, res) => {
    fsp.readFile(__dirname + "/html/upick-privacy.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
})

// upick.html
app.get('/upick', (req, res) => {
    fsp.readFile(__dirname + "/html/upick.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
})

// Allow static content to be automatically served from resources directory.
// The below causes 'static' to not be part of the URL when static content
// is requested. So, when requesting static content from HTML pages, do not
// include static/ in path, instead start at resources/
app.use(express.static('static'))

var server = https.createServer(options, app);

// Start server
server.listen(port, () => {
    console.log(`smcshane.com running on port ${port}`)
})