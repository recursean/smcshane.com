/**
 * This is the main web server for smcshane.com
 * 
 * TODO:
 * - Accept post on contact.html
 * - Read files only once at startup of server
 */

const express = require('express')
const bp = require('body-parser')
const fs = require('fs')
const fsp = require('fs').promises
const https = require('https')
const http = require('http');

const app = express()
const httpApp = express()

// Redirect all HTTP traffic to HTTPS
httpApp.get('*', (req, res) => {
    res.redirect('https://' + req.headers.host + req.url);
})

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

// contact.html - GET
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

// contact.html - POST
app.post('/contact', (req, res) => {
    console.log(req)
    // console.log(`email: ${req.body.email}`)
    // console.log(`message: ${req.body.message}`)
    res.writeHead(200)
    res.end()
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

console.log('== SERVER STARTING ==')
console.log(new Date())

// Port for server to listen on; HTTPS port
const httpsPort = 443
const httpPort = 80

// Read in certificate for HTTPS
var key = fs.readFileSync('/etc/letsencrypt/live/smcshane.com/privkey.pem');
var cert = fs.readFileSync('/etc/letsencrypt/live/smcshane.com/fullchain.pem');
var options = {
  key: key,
  cert: cert
};

// Allow static content to be automatically served from resources directory.
// The below causes 'static' to not be part of the URL when static content
// is requested. So, when requesting static content from HTML pages, do not
// include static/ in path, instead start at resources/
app.use(express.static('static'))

// Parse request bodies from forms
app.use(bp.urlencoded({ extended: false }));

// Create servers
var httpsServer = https.createServer(options, app);
var httpServer = http.createServer(httpApp);

// Start servers
httpsServer.listen(httpsPort, () => {
    console.log(`smcshane.com running on port ${httpsPort}.`)
})
httpServer.listen(httpPort, () => {
    console.log(`smcshane.com running on port ${httpPort}. All traffic will be redirected to HTTPS.`)
})