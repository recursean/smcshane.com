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
const mail = require('./mail.js');

const app = express()
const httpApp = express()

// Parse request bodies from forms. Allows for HTML forms to be HTTP POST here.
app.use(bp.urlencoded({ extended: true }));

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
    console.log(`${new Date()} Received message:`)
    console.log(`  name: ${req.body.name}`)
    console.log(`  email: ${req.body.email}`)
    console.log(`  message: ${req.body.message}`)
    console.log('Forwarding via email')

    const emailString = `<p><b>Name: </b>${req.body.name}</p><p><b>Email: </b>${req.body.email}</p><p><b>Message: </b>${req.body.message}</p>`
    mail.sendEmail(emailString)

    // Redirect to contact GET
    res.redirect('/contact')
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
console.log(`${new Date()}`)

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

// Create servers
var httpsServer = https.createServer(options, app);
var httpServer = http.createServer(httpApp);

// Start HTTP server - traffic will be redirected to HTTPS
httpServer.listen(httpPort, () => {
    console.log(`smcshane.com running on port ${httpPort}. All traffic will be redirected to HTTPS.`)
})

// Start HTTPS server
httpsServer.listen(httpsPort, () => {
    console.log(`smcshane.com running on port ${httpsPort}.`)

    // Ensure Gmail services are initialized. If token.json has not been 
    // created, manual auth flow will need to be followed. Because the auth
    // code will need pasted into command prompt, nohup can not be used and
    // server must be started with interactive prompt. Whichever google 
    // account is used in the auth flow will be used to send emails.
    mail.initEmail()
})
