const path = require('path');
const svgSpriteDirs = [
  path.resolve(__dirname, './src/assets'),
];

export default {
  "entry": "src/index.js",
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr",
        "transform-runtime",
        ["import", { "libraryName": "antd", "style": "css" }]
      ],
      "svgSpriteLoaderDirs": svgSpriteDirs
    },
    "production": {
      "extraBabelPlugins": [
        "transform-runtime",
        ["import", { "libraryName": "antd", "style": "css" }]
      ],
      "svgSpriteLoaderDirs": svgSpriteDirs
    }
  },
  "proxy": {
    "/api": {
      "target": "http://guolh-php.guolh.com/",
      "changeOrigin": true,
    },
  },
  "disableCSSModules": true,
  "svgSpriteLoaderDirs": svgSpriteDirs
};
