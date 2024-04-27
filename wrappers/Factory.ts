import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type FactoryConfig = {
    owner: Address;
};

export function factoryConfigToCell(config: FactoryConfig): Cell {
    return beginCell().storeAddress(config.owner).endCell();
}

export class Op {
    static start_split = 0x7e0f2a10;
    static spammm = 0x53203609;
    static init_spammer = 0x72148b7c;
}

export class Factory implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new Factory(address);
    }

    static createFromConfig(config: FactoryConfig, code: Cell, workchain = 0) {
        const data = factoryConfigToCell(config);
        const init = { code, data };
        return new Factory(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
    async sendSplit(provider: ContractProvider, via: Sender, split: number, until: number = 0, value: bigint) {
        // start_split# query_id:uint64 split:uint8 until:uint48 = InternalMsgBody;
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Op.start_split, 32)
                .storeUint(0, 64) // query_id
                .storeUint(split, 8)
                .storeUint(until, 48)
                .endCell(),
        });
    }
}
