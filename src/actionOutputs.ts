import { ActionTrOutput } from 'github-actions-utils';

export const actionOutputs = {
    publishedWith500Error: new ActionTrOutput<boolean>('publishedWith500Error', b => b ? 'true' : 'false'),
    publishStatus: new ActionTrOutput<string[]>('publishStatus', v => v.join('|'))
}