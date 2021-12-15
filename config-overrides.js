// ビルド時に、aws-amplifyの中でビルドエラー起こっちゃうので
// 回避のために以下の設定を追加
module.exports = (config, env) => {
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false
    }
  });
  return config;
};
