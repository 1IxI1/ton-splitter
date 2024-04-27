import { compile as compileFunc, CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    preCompileHook: async () => {
        await compileFunc('Spammer');
    },
    targets: ['contracts/auto/spammer-code.fc', 'contracts/factory.fc'],
};
