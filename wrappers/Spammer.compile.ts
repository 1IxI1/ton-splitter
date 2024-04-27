import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/spammer.fc'],
    postCompileHook: async (code) => {
        const auto = path.join(__dirname, '..', 'contracts', 'auto');
        await mkdir(auto, { recursive: true });
        await writeFile(
            path.join(auto, 'spammer-code.fc'),
            `cell spammer_code() asm "B{${code.toBoc().toString('hex')}} B>boc PUSHREF";`,
        );
    },
};
