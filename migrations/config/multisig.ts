import { MultiSigConfigByNetwork } from '../../util/types';

// Make a copy of this file named `multisig.js` and input custom params as needed
export const multiSig: MultiSigConfigByNetwork = {
  kovan: {
    owners: ["0x00879BB25483636d477ED1360911CDb87058b42f"],
    confirmationsRequired: 1,
    secondsRequired: 0,
  },
};
