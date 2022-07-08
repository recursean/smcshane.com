/**
 * This is the main web server for smcshane.com
 * 
 * Run as long-running task with "nohup npm start &"
 */

const express = require('express')
const server = express()
const fs = require('fs').promises;
const port = 80

// arphotoview-privacy.html
server.get('/arphotoview-privacy', (req, res) => {
    fs.readFile(__dirname + "/html/arphotoview-privacy.html")
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
server.get('/arphotoview', (req, res) => {
    fs.readFile(__dirname + "/html/arphotoview.html")
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
server.get('/contact', (req, res) => {
    fs.readFile(__dirname + "/html/contact.html")
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
server.get('/', (req, res) => {
    fs.readFile(__dirname + "/html/index.html")
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
server.get('/newscloud', (req, res) => {
    fs.readFile(__dirname + "/html/newscloud.html")
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
server.get('/saf', (req, res) => {
    fs.readFile(__dirname + "/html/saf.html")
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
server.get('/upick-privacy', (req, res) => {
    fs.readFile(__dirname + "/html/upick-privacy.html")
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
server.get('/upick', (req, res) => {
    fs.readFile(__dirname + "/html/upick.html")
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
server.use(express.static('static'))

// Start server
server.listen(port, () => {
    console.log(`smcshane.com running on port ${port}`)
})