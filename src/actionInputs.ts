import { actionInputs as inputs, transformIfSet } from 'github-actions-utils';

export const actionInputs = {
    extensionId: inputs.getString('extensionId', true),

    apiAccessToken: inputs.getString('apiAccessToken', false, true),
    apiClientId: inputs.getString('apiClientId', false, true),
    apiClientSecret: inputs.getString('apiClientSecret', false, true),
    apiRefreshToken: inputs.getString('apiRefreshToken', false, true),

    publishTarget: inputs.getString('publishTarget', true),
    publishIgnore500Error: inputs.getBool('publishIgnore500Error', true)
}