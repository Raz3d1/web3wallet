// fixtures-data/V10.js
(() => {
  const r = window.registerFixtureData;

  r("V10_PersonalSignCorruptedChallenge", {
    id: "V10_PersonalSignCorruptedChallenge",
    name: "Personal Sign 挑战数据损坏 (Personal Sign with Corrupted Challenge)",
    method: "personal_sign",
    // personal_sign: [message, address]（这里沿用你原来的顺序）
    params: ["0x4c6f67696e20746f2057616c6", "{{address}}"],
  });

  r("V10_PersonalSignSwappedParams", {
    id: "V10_PersonalSignSwappedParams",
    name: "Personal Sign 参数顺序颠倒 (Personal Sign with Swapped Parameters)",
    method: "personal_sign",
    // 故意交换：把 address 放到第一个参数
    params: ["{{address}}", "0x4c6f67696e20746f2057616c6c6554727574680a"],
  });
})();

