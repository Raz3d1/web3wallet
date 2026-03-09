//// LooksRare 挂单签名样例，实际金额远高于挂单金额，但可能由于UI设计不当被用户忽略，导致用户以为自己签署了无关紧要的订单，实际是授权一个高价订单
function v6_LooksRareFixture(address) {
  return window.buildFixtureFromData("V6_LooksRare", { address });
}

