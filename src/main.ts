import * as ghActions from '@actions/core';
import ChromeCrxBuilder, { IChromeWebstoreOptions } from 'webext-buildtools-chrome-webstore-builder';
import { actionInputs } from './actionInputs';
import { getLogger } from './logger';
import { actionOutputs } from './actionOutputs';

async function run(): Promise<void> {
    try {
        await runImpl();
    } catch (error) {
        ghActions.setFailed(String(error));
    }
}

async function runImpl() {
    const logger = getLogger();

    const options = getChromeWebstoreOptions();
    const chromeWebstoreBuilder = new ChromeCrxBuilder(options, logger);

    chromeWebstoreBuilder.requirePublishedExt();
    const webstoreResult = await chromeWebstoreBuilder.build();

    const publishedExtAsset = webstoreResult.getAssets().publishedExt;
    if (!publishedExtAsset) {
        throw new Error('publishedExt asset not found in results');
    }

    actionOutputs.publishedWith500Error.setValue(publishedExtAsset.getValue().error500);
    const publishResponse = publishedExtAsset.getValue().publishResponse;
    if (publishResponse) {
        actionOutputs.publishStatus.setValue(publishResponse.status);
    }
}

function getChromeWebstoreOptions(): IChromeWebstoreOptions {
    const options: IChromeWebstoreOptions = {
        extensionId: actionInputs.extensionId,
        publish: {
            target: actionInputs.publishTarget,
            ignore500Error: actionInputs.publishIgnore500Error
        }
    };
    if (actionInputs.apiAccessToken) {
        options.accessToken = actionInputs.apiAccessToken;
    } else if (actionInputs.apiClientId && actionInputs.apiClientSecret && actionInputs.apiRefreshToken) {
        options.apiAccess = {
            clientId: actionInputs.apiClientId,
            clientSecret: actionInputs.apiClientSecret,
            refreshToken: actionInputs.apiRefreshToken
        };
    } else {
        throw new Error(
            'Api access inputs not set. You should set either apiAccessToken directly or ' +
            'apiClientId, apiClientSecret, apiRefreshToken (to obtain access token)'
        )
    }

    return options;
}

// noinspection JSIgnoredPromiseFromCall
run();
