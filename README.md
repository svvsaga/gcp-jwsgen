# gcp-jwsgen
Generate valid JSON Web Signatures to obtain OAuth 2.0 tokens used in Google APIs

# About
This small app is used to be able to generate valid JSON Web Signatures when you want to explore the Google APIs through Postman or other means. 
The Admin SDK / G Suite Directory API is in particular quirky, read [this issue](https://issuetracker.google.com/issues/113755665)

Usually you would use a library provided by Google, because it handles both generating JWS, obtaining an OAuth 2.0 access token and calling the APIs. Google have libraries both for [Java](https://developers.google.com/api-client-library/java), Go, Python and .NET

# Prereqs
1. Create a GCP project
2. Enable Admin SDK for the project
3. Create a service account with G Suite Domain-Wide Delegation enabled. The service account at this point gets a client id
4. Set up suitable authorization scopes in the G Suite admin -> Security -> Advanced Settings->Manage API Client Access. Google provides a [full list of all scopes](https://developers.google.com/identity/protocols/oauth2/scopes) for their APIs. You use the client id of the service account when setting up the API access.
5. If you want to use the Directory API you need to impersonate an admin user when obtaining a OAuth 2.0 token, otherwise you will get a 403. 
6. Download a service account key in JSON format

# How to run the app?
1. Configure the settings in app.js - they are pretty self-explanatory
2. Ensure you have installed Node and have it on your path
3. Run the app with `node app.js` - the app wil emit a JWS which you can use to obtain a valid OAuth 2.0 [as explained](https://developers.google.com/identity/protocols/oauth2/service-account#authorizingrequests)

# What next?
1. Obtain a token
```
curl --location --request POST 'https://www.googleapis.com/oauth2/v4/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer' \
--data-urlencode 'assertion=[GENERATEDJWS]'
```
2. Use the token in an actual request
```
curl --location --request GET 'https://www.googleapis.com/admin/directory/v1/users?maxResults=2' \
--header 'Authorization: Bearer [ACCESS_TOKEN]'
```
The above request needs a specific scope set up in the prereqs:
* https://www.googleapis.com/auth/admin.directory.user
