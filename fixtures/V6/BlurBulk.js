//// fixtures/v6/BlurBulk.js root信息涵盖了多个挂单，一般App会调用对应（blur）的API来获取这些信息，但如果App没有正确展示这些信息，用户可能会忽略掉其中的风险，导致批量授权高价订单
function v6_BlurBulkFixture(address) {
    return window.buildFixtureFromData('V6_Blur_Bulk', { address });
}