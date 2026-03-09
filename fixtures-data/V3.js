// fixtures-data/V3.js
(() => {
  const r = window.registerFixtureData;

  r("V3_Eth_Sign", {
    id: "V3_Eth_Sign",
    name: "危险的 eth_sign (Dangerous eth_sign)",
    method: "eth_sign",
    // 注意 eth_sign 在此项目里是 [message, address]
    params: ["0x797d5b9bd6fb2c70d000491ad03b9f872f8f928eb2c4326add81969094eef2e4", "{{address}}"],
  });

  r("V3_Hex_Encoded_Hash", {
    id: "V3_Hex_Encoded_Hash",
    name: "未解码的hex eth_sign",
    method: "eth_sign",
    params: [
      "{{address}}",
      "0x307864396662323162616462353262393865313465623565323639643066343562313434386434393062616538646136313236386136663264646231376337636332",
    ],
  });
})();

