// fixtures-data/V7.js
(() => {
  const r = window.registerFixtureData;

  r("V7_KnownDangerous_list", {
    list: [
      // ScamSniffer 获取的真实钓鱼地址
      { name: "ScamSniffer 标记钓鱼地址", to: "0x164e84226882c385940134f5b292cb89bc4feed6" },
      // Etherscan 获取的黑客地址
      { name: "Etherscan 标记黑客地址", to: "0x057a3B930702c30E73c309b38A39fD54B468fD83" },
    ],
  });
})();

