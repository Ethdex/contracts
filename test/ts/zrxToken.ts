import * as assert from 'assert';
import * as Web3 from 'web3';
import * as BigNumber from 'bignumber.js';
import { testUtil } from '../../util/test_util';
import { Artifacts } from '../../util/artifacts';
import { ContractInstance } from '../../util/types';

const { EDXToken } = new Artifacts(artifacts);
const web3Instance: Web3 = web3;

contract('EDXToken', (accounts: string[]) => {
  const owner = accounts[0];
  const spender = accounts[1];

  const MAX_UINT = (new BigNumber(2)).pow(256).minus(1);

  let edx: ContractInstance;

  beforeEach(async () => {
    edx = await EDXToken.new({ from: owner });
  });

  describe('constants', () => {
    it('should have 18 decimals', async () => {
      const decimals = await edx.decimals.call();
      const expectedDecimals = '18';
      assert.equal(decimals.toString(), expectedDecimals);
    });

    it('should have a total supply of 1 billion tokens', async () => {
      const totalSupply = await edx.totalSupply.call();
      const expectedTotalSupply = '1000000000';
      assert.equal(web3Instance.fromWei(totalSupply, 'ether').toString(), expectedTotalSupply.toString());
    });

    it('should be named Ethdex Token', async () => {
      const name = await edx.name.call();
      const expectedName = 'Ethdex Token';
      assert.equal(name, expectedName);
    });

    it('should have the symbol EDX', async () => {
      const symbol = await edx.symbol.call();
      const expectedSymbol = 'EDX';
      assert.equal(symbol, expectedSymbol);
    });
  });

  describe('constructor', () => {
    it('should initialize owner balance to totalSupply', async () => {
      const ownerBalance = await edx.balanceOf(owner);
      const totalSupply = await edx.totalSupply.call();
      assert.equal(totalSupply.toString(), ownerBalance.toString());
    });
  });

  describe('transfer', () => {
    it('should transfer balance from sender to receiver', async () => {
      const receiver = spender;
      const initOwnerBalance = await edx.balanceOf(owner);
      const amountToTransfer = new BigNumber(1);
      await edx.transfer(receiver, amountToTransfer, { from: owner });
      const finalOwnerBalance = await edx.balanceOf(owner);
      const finalReceiverBalance = await edx.balanceOf(receiver);

      const expectedFinalOwnerBalance = initOwnerBalance.minus(amountToTransfer);
      const expectedFinalReceiverBalance = amountToTransfer;
      assert.equal(finalOwnerBalance.toString(), expectedFinalOwnerBalance.toString());
      assert.equal(finalReceiverBalance.toString(), expectedFinalReceiverBalance.toString());
    });

    it('should return true on a 0 value transfer', async () => {
      const didReturnTrue = await edx.transfer.call(spender, 0, { from: owner });
      assert.equal(didReturnTrue, true);
    });
  });

  describe('transferFrom', () => {
    it('should return false if owner has insufficient balance', async () => {
      const ownerBalance = await edx.balanceOf(owner);
      const amountToTransfer = ownerBalance.plus(1);
      await edx.approve(spender, amountToTransfer, { from: owner });
      const didReturnTrue = await edx.transferFrom.call(owner, spender, amountToTransfer, { from: spender });
      assert.equal(didReturnTrue, false);
    });

    it('should return false if spender has insufficient allowance', async () => {
      const ownerBalance = await edx.balanceOf(owner);
      const amountToTransfer = ownerBalance;

      const spenderAllowance = await edx.allowance(owner, spender);
      const spenderAllowanceIsInsufficient = spenderAllowance.cmp(amountToTransfer) < 0;
      assert.equal(spenderAllowanceIsInsufficient, true);

      const didReturnTrue = await edx.transferFrom.call(owner, spender, amountToTransfer, { from: spender });
      assert.equal(didReturnTrue, false);
    });

    it('should return true on a 0 value transfer', async () => {
      const amountToTransfer = 0;
      const didReturnTrue = await edx.transferFrom.call(owner, spender, amountToTransfer, { from: spender });
      assert.equal(didReturnTrue, true);
    });

    it('should not modify spender allowance if spender allowance is 2^256 - 1', async () => {
      const initOwnerBalance = await edx.balanceOf(owner);
      const amountToTransfer = initOwnerBalance;
      const initSpenderAllowance = MAX_UINT;
      await edx.approve(spender, initSpenderAllowance, { from: owner });
      await edx.transferFrom(owner, spender, amountToTransfer, { from: spender });

      const newSpenderAllowance = await edx.allowance(owner, spender);
      assert.equal(initSpenderAllowance.toFixed(), newSpenderAllowance.toFixed());
    });

    it('should transfer the correct balances if spender has sufficient allowance', async () => {
      const initOwnerBalance = await edx.balanceOf(owner);
      const amountToTransfer = initOwnerBalance;
      const initSpenderAllowance = initOwnerBalance;
      await edx.approve(spender, initSpenderAllowance, { from: owner });
      await edx.transferFrom(owner, spender, amountToTransfer, { from: spender });

      const newOwnerBalance = await edx.balanceOf(owner);
      const newSpenderBalance = await edx.balanceOf(spender);

      assert.equal(newOwnerBalance.toString(), '0');
      assert.equal(newSpenderBalance.toString(), initOwnerBalance.toString());
    });

    it('should modify allowance if spender has sufficient allowance less than 2^256 - 1', async () => {
      const initOwnerBalance = await edx.balanceOf(owner);
      const amountToTransfer = initOwnerBalance;
      const initSpenderAllowance = initOwnerBalance;
      await edx.approve(spender, initSpenderAllowance, { from: owner });
      await edx.transferFrom(owner, spender, amountToTransfer, { from: spender });

      const newSpenderAllowance = await edx.allowance(owner, spender);
      assert.equal(newSpenderAllowance, '0');
    });
  });
});
