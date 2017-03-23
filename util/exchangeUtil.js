const { createFill, createCancel } = require('./formatters.js');

module.exports = exchange => {
  const exchangeUtil = {
    fill: (order, { fillValueM, from, caller }) => {
      const params = createFill(order, caller || from, fillValueM);
      return exchange.fill(
        params.traders,
        params.tokens,
        params.caller,
        params.feeRecipient,
        params.values,
        params.fees,
        params.expiration,
        params.fillValueM,
        params.v,
        params.rs,
        { from }
      );
    },
    cancel: (order, { cancelValueM, from, caller }) => {
      const params = createCancel(order, caller || from, cancelValueM);
      return exchange.cancel(
        params.traders,
        params.tokens,
        params.caller,
        params.feeRecipient,
        params.values,
        params.fees,
        params.expiration,
        params.cancelValueM,
        { from }
      );
    },
    getOrderHash: order => {
      const params = createFill(order);
      return exchange.getOrderHash(
        params.traders,
        params.tokens,
        params.feeRecipient,
        params.values,
        params.fees,
        params.expiration
      );
    },
    isValidSignature: order => {
      const orderHash = typeof order.orderHash === 'string' ? order.orderHash : `0x${order.orderHash.toString('hex')}`;
      const isValidSignature = exchange.isValidSignature(
        order.maker,
        orderHash,
        order.v,
        order.r,
        order.s
      );
      return isValidSignature;
    },
  };
  return exchangeUtil;
};
