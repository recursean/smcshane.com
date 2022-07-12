/**
 * This is the main web server for smcshane.com
 * 
 * TODO:
 * - Read files only once at startup of server
 */

const express = require('express')
const bp = require('body-parser')
const fs = require('fs')
const https = require('https')
const http = require('http');
const mail = require('./mail.js');
const logMessage = require('./log.js');

// HTML pages that will be read in at server startup
var arphotoviewPrivacyHtml
var arphotoviewHtml
var contactHtml 
var indexHtml
var newscloudHtml
var safHtml
var upickHtml
var upickPrivacyHtml

/**
 * Set the various HTTPS routes that the website supports.
 * 
 * @param {*} app Express app used for HTTPS
 * @param {*} httpApp Express app used for HTTP
 */
function setRoutes(app, httpApp) {
    // Redirect all HTTP traffic to HTTPS
    httpApp.get('*', (req, res) => {
        res.redirect('https://' + req.headers.host + req.url);
    })
    
    // arphotoview-privacy.html
    app.get('/arphotoview-privacy', (req, res) => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200)
        res.end(arphotoviewPrivacyHtml)
    })
    
    // arphotoview.html
    app.get('/arphotoview', (req, res) => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200)
        res.end(arphotoviewHtml)
    })
    
    // contact.html - GET
    app.get('/contact', (req, res) => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200)
        res.end(contactHtml)
    })
    
    // contact.html - POST
    app.post('/contact', (req, res) => {
        logMessage('Received form submission')
        logMessage(`  name: ${req.body.name}`)
        logMessage(`  email: ${req.body.email}`)
        logMessage(`  message: ${req.body.message}`)
        logMessage('Forwarding form submission via email')
        
        // Send as email
        const emailString = `<p><b>Name: </b>${req.body.name}</p><p><b>Email: </b>${req.body.email}</p><p><b>Message: </b>${req.body.message}</p>`
        mail.sendEmail(emailString)
        
        // Redirect to contact GET
        res.redirect('/contact')
    })
    
    // index.html
    app.get('/', (req, res) => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200)
        res.end(indexHtml)
    })
    
    // newscloud.html
    app.get('/newscloud', (req, res) => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200)
        res.end(newscloudHtml)
    })
    
    // saf.html
    app.get('/saf', (req, res) => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200)
        res.end(safHtml)
    })
    
    // upick-privacy.html
    app.get('/upick-privacy', (req, res) => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200)
        res.end(upickPrivacyHtml)
    })
    
    // upick.html
    app.get('/upick', (req, res) => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200)
        res.end(upickHtml)
    })
}

/**
 * Start the web server listening on ports 80 and 443. HTTP traffic will be
 * redirected to HTTPS. 
 */
function startServer() {
    logMessage('Server starting')
    
    // Port for server to listen on; HTTPS port
    const httpsPort = 443
    const httpPort = 80

    // Express apps to configure servers
    const app = express()
    const httpApp = express()
    
    // Read in SSL certificate for HTTPS
    logMessage('SSL cert read start')
    var key = fs.readFileSync('/etc/letsencrypt/live/smcshane.com/privkey.pem');
    var cert = fs.readFileSync('/etc/letsencrypt/live/smcshane.com/fullchain.pem');
    var options = {
        key: key,
        cert: cert
    };
    logMessage('SSL cert read complete')

    // Read in HTML files that will be served
    logMessage('HTML files read start')
    arphotoviewPrivacyHtml = fs.readFileSync(__dirname + '/html/arphotoview-privacy.html');
    arphotoviewHtml = fs.readFileSync(__dirname + '/html/arphotoview.html');
    contactHtml = fs.readFileSync(__dirname + '/html/contact.html');
    indexHtml = fs.readFileSync(__dirname + '/html/index.html');
    newscloudHtml = fs.readFileSync(__dirname + '/html/newscloud.html');
    safHtml = fs.readFileSync(__dirname + '/html/saf.html');
    upickHtml = fs.readFileSync(__dirname + '/html/upick.html');
    upickPrivacyHtml = fs.readFileSync(__dirname + '/html/upick-privacy.html');
    logMessage('HTML files read complete')

    // Allow static content to be automatically served from resources directory.
    // The below causes 'static' to not be part of the URL when static content
    // is requested. So, when requesting static content from HTML pages, do not
    // include static/ in path, instead start at resources/
    app.use(express.static('static'))

    // Parse request bodies from forms. Allows for HTML forms to be HTTP POST.
    app.use(bp.urlencoded({ extended: true }));
    
    // Create servers
    var httpsServer = https.createServer(options, app);
    var httpServer = http.createServer(httpApp);
    
    // Start HTTP server - traffic will be redirected to HTTPS
    logMessage(`Attempting to listen on port ${httpPort}`)
    httpServer.listen(httpPort, () => {
        logMessage(`** smcshane.com running on port ${httpPort}. All traffic will be redirected to HTTPS. **`)
    })
    
    // Start HTTPS server
    logMessage(`Attempting to listen on port ${httpsPort}`)
    httpsServer.listen(httpsPort, () => {
        logMessage(`** smcshane.com running on port ${httpsPort}. **`)
        
        // Ensure Gmail services are initialized. If token.json has not been 
        // created, manual auth flow will need to be followed. Because the auth
        // code will need pasted into command prompt, nohup can not be used and
        // server must be started with interactive prompt. Whichever google 
        // account is used in the auth flow will be used to send emails.
        mail.initEmail()

        // Set HTTPS routes
        setRoutes(app, httpApp)
    })
}

// Start the web server
startServer()
