import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type SpammerConfig = {};

export function spammerConfigToCell(config: SpammerConfig): Cell {
    return beginCell().endCell();
}

export class Spammer implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Spammer(address);
    }

    static createFromConfig(config: SpammerConfig, code: Cell, workchain = 0) {
        const data = spammerConfigToCell(config);
        const init = { code, data };
        return new Spammer(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
