![Node.js CI](https://github.com/cardinalby/webext-buildtools-chrome-webstore-action/workflows/build-test/badge.svg)

# Publish your uploaded WebExtension at Chrome Web Store

Based on [ChromeWebstoreBuilder](https://www.npmjs.com/package/webext-buildtools-chrome-webstore-builder) 
package.

## Inputs

* `extensionId` **Required**<br>
Your extension id in Chrome Web Store

* To allow action accessing to Chrome Webstore API you can choose 2 ways:
    1. Set `apiAccessToken` input directly (you can obtain it using 
    [google-api-fetch-token-action](https://github.com/cardinalby/google-api-fetch-token-action)) 

    2. Set the following inputs to let action get access token for you. Read 
    [Using the Chrome Web Store Publish API](https://developer.chrome.com/webstore/using_webstore_api), 
    [How to generate Google API keys](https://github.com/DrewML/chrome-webstore-upload/blob/master/How%20to%20generate%20Google%20API%20keys.md)
    to learn how to obtain these values.
        * `apiClientId` **Required**
        * `apiClientSecret` **Required**
        * `apiRefreshToken` **Required** 

    Don't forget to store sensitive data as secrets.

* `publishTarget` **Default: `default`**<br>
Publishing target: `default` or `trustedTesters`

* `publishIgnore500Error` **Default: `true`**<br>
Experimental option to bypass undocumented Webstore API behaviour. For example, extension had 
a version 1.10.0, then we successfully published a new one with version 1.20.0 (status = 'OK').
But this version is still in publishing progress. Now we are publishing 1.30.0 and 'publish' 
request fails with 500 error. But, actually, our version have been accepted, and after 
some time our extension increases its version to 1.30.0. Set this option to `true` to consider 
500 response as success.

## Outputs

* `publishedWith500Error` Values: `true`, `false`. Indicates whether publish finished with 500 error (special case)
* `publishStatus` Set of publish statuses from API response separated by `|`. Can be empty in case of 500 error.
Possible values in set: `OK`, `NOT_AUTHORIZED`, `INVALID_DEVELOPER`, `DEVELOPER_NO_OWNERSHIP`, `DEVELOPER_SUSPENDED`,
`ITEM_NOT_FOUND`, `ITEM_PENDING_REVIEW`, `ITEM_TAKEN_DOWN`, `PUBLISHER_SUSPENDED`

## Simple usage example

```yaml
uses: cardinalby/webext-buildtools-chrome-webstore-publish-action@v1
with:
  extensionId: 'fonhjbpoimjmgfgbboichngpjlmilbmk'
  apiClientId: ${{ secrets.G_CLIENT_ID }}
  apiClientSecret: ${{ secrets.G_CLIENT_SECRET }}
  apiRefreshToken: ${{ secrets.G_REFRESH_TOKEN }}
```

## Google refresh token expiration

According to [Google's guide](https://developers.google.com/identity/protocols/oauth2#expiration), 
the refresh token might **stop working** if it has not been used for **six months**. 

To avoid that, schedule
[google-api-fetch-token-action](https://github.com/cardinalby/google-api-fetch-token-action) action 
with the same credentials.