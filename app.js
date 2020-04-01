const jws = require('jws')
const fs = require('fs')

/**
 * E-mail of the service account which has Domain-Wide Delegation enabled
 * and is added with correct scopes in "Manage API client access" at admin.google.com->Security->Advanced settings
 */ 
const serviceAccountEmail = "serviceaccount@project.iam.gserviceaccount.com" 

/**
 * The key file for the service account
 */
const keyFile = "./key.json" 

/**
 * The scopes to use for subsequent requests for the API
 * ex: https://www.googleapis.com/auth/admin.directory.user
 * Complete list of all OAuth 2.0 scopes is available at 
 * https://developers.google.com/identity/protocols/oauth2/scopes
 */ 
const scopes = "https://www.googleapis.com/auth/admin.directory.user https://www.googleapis.com/auth/admin.directory.user.security"

/**
 * E-mail of a G Suite Admin to impersonate when calling the API
 * This is necessary due to how some G Suite APIs authorize requests towards specific endpoints such as the Directory API
 * Explained in detail at https://issuetracker.google.com/issues/113755665
 */ 
const gSuiteAdminUser = "user@domain.com"

const key = fs.readFileSync(keyFile, 'utf8');
const body = JSON.parse(key);
const privateKey = body.private_key;
const iat = Math.floor(new Date().getTime() / 1000);

const payload = {
    iss: serviceAccountEmail,
    scope: scopes,
    aud: "https://www.googleapis.com/oauth2/v4/token",
    exp: iat + 3600,
    iat,
    sub: gSuiteAdminUser,
}

const signedJWT = jws.sign({
    header: { alg: 'RS256' },
    payload,
    secret: privateKey,
});

console.log(signedJWT)