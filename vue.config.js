// eslint-disable-next-line
const px2rem = require('postcss-px2rem');
const path = require('path');

const { env: { BASE_URL }, VUE_CLI_SERVICE: { mode } } = process;
const resolve = dir => path.join(__dirname, dir);

module.exports = {
  // 修改为相对路径
  baseUrl: BASE_URL,
  outputDir: 'docs',
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    port: 8080
  },
  chainWebpack: config => (
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('variable', resolve('src/variable.styl'))
  ),
  css: {
    loaderOptions: {
      postcss: {
        plugins: [px2rem({ remUnit: 192 })]
      }
    }
  },
  productionSourceMap: mode !== 'production',
};
