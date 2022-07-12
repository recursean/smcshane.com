const readline = require('readline');
const {google} = require('googleapis');
const MailComposer = require('nodemailer/lib/mail-composer');
const fs = require('fs')
const logMessage = require('./log.js');

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

/**
 * To interact with Gmail API, this app needs authorized. When starting
 * the server for the first time, a URL will appear that needs pasted into
 * a browser. After authorizing, a code will appear in the redirect URL that
 * needs pasted in the command prompt. The code will be saved in token.json 
 * for future usage. Delete token.json to force new authorization flow. The 
 * token comes with a refresh token which should be used to refresh expired
 * tokens.
 * 
 * gmail-credentials.json contains client id/secret of smcshane.com
 * project in Google Cloud Console. This project is enabled to use Gmail API.
 * 
 * @param {*} emailText Email body to send
 */
function initGmail(emailText, sendEmailFlag) {
    logMessage('Gmail API initializing')

    // Load client secrets from a local file.
    fs.readFile(__dirname + '/../gmail-credentials.json', (err, content) => {
        if (err) {
            return logMessage('Error loading client secret file:', err);
        }
        
        // Authorize a client with credentials, then call the Gmail API.
        authorize(JSON.parse(content), sendMail, emailText, sendEmailFlag);
    });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 * @param {*} emailText Email body to send
 */
function authorize(credentials, callback, emailText, sendEmailFlag) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
            return getNewToken(oAuth2Client, callback, emailText, sendEmailFlag);
        }
        oAuth2Client.setCredentials(JSON.parse(token));
        logMessage('Gmail API initialized - Existing auth')
        if(sendEmailFlag) {
            callback(oAuth2Client, emailText);
        }
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 * @param {*} emailText Email body to send
 */
function getNewToken(oAuth2Client, callback, emailText, sendEmailFlag) {
    // If modifying these scopes, delete token.json.
    const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    logMessage('Authorize Gmail API by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                return console.error('Error retrieving access token', err);
            }
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) {
                    return console.error(err);
                }
                logMessage('Gmail API token stored to', TOKEN_PATH);
            });
            logMessage('Gmail API initialized - Fresh auth')
            if(sendEmailFlag) {
                callback(oAuth2Client, emailText);
            }
        });
    });
}

/**
 * Encode email message
 * 
 * @param {*} message 
 * @returns Encoded message
 */
const encodeMessage = (message) => {
    return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

/**
 * Create message object to send via Gmail API
 * 
 * @param {*} options 
 * @returns Message object
 */
const createMail = async (options) => {
    const mailComposer = new MailComposer(options);
    const message = await mailComposer.compile().build();
    return encodeMessage(message);
};

/**
 * Sends an email via Gmail API
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {*} emailText Email body to send
 */
const sendMail = async (auth, emailText) => {
    const gmail = google.gmail({version: 'v1', auth});
    const options = {
        to: 'seanmcshane96@gmail.com',
        replyTo: 'smcshane.bot@gmail.com',
        subject: 'smcshane.com Form Submission',
        html: emailText,
        textEncoding: 'base64',
    };
    const rawMessage = await createMail(options);
    const { data: { id } = {} } = await gmail.users.messages.send({
        userId: 'me',
        resource: {
            raw: rawMessage,
        },
    });
    return id;
}

/**
 * Main wrapper function to send emails.
 * 
 * @param {*} emailText Email body to send
 */
function sendEmail(emailText) {
    initGmail(emailText, true)
}

/**
 * Initializes Gmail API. Called once at server startup.
 */
function initEmail() {
    initGmail('', false)
}

module.exports.sendEmail = sendEmail
module.exports.initEmail = initEmail