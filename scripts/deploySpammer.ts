import { toNano } from '@ton/core';
import { Spammer } from '../wrappers/Spammer';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const spammer = provider.open(Spammer.createFromConfig({}, await compile('Spammer')));

    await spammer.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(spammer.address);

    // run methods on `spammer`
}
