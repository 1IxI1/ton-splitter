import { Blockchain, SandboxContract, TreasuryContract, printTransactionFees } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Spammer } from '../wrappers/Spammer';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { Factory } from '../wrappers/Factory';

describe('Spammer', () => {
    let code: Cell;
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let factory: SandboxContract<Factory>;
    let spammer: SandboxContract<Spammer>;

    beforeEach(async () => {
        code = await compile('Factory');
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');
        factory = blockchain.openContract(Factory.createFromConfig({ owner: deployer.address }, code, 0));

        const deployResult = await factory.sendDeploy(deployer.getSender(), toNano('2'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: factory.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy factory', async () => {
        // the check is done inside beforeAll
        // blockchain and factory are ready to use
    });

    it('should start spam to 4 shards', async () => {
        // 4 shards
        await blockchain.setVerbosityForAddress(factory.address, { vmLogs: 'vm_logs' });
        const result = await factory.sendSplit(deployer.getSender(), 2, 0, toNano('20'));
        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: factory.address,
            success: true,
            outMessagesCount: 4,
        });
        printTransactionFees(result.transactions);
    });
});
