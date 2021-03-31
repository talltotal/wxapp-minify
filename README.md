# wxapp-minify

为微信小程序原生语法设计的压缩脚本。

支持压缩的文件类型：`.wxss` `.json` `.wxml` `.svg`。

支持对`.wxss` `.wxml`和`.svg`文件的压缩结果缓存。



## 安装
```bash
npm i @talltotal/wxapp-minify -D
# or
yarn add @talltotal/wxapp-minify -D
```



## 使用
> 配置优先级：指令 > 配置文件 > 内置默认配置

配置文件`.minify.js`：
```js
// 这里展示的为默认配置
module.exports = {
    // 源码文件所放的位置
    srcPath: 'app',

    // 压缩文件所放的位置
    distPath: 'dist',

    // 是否开启缓存
    cache: true,
    
    // 存储缓存的路径
    cachePath: 'node_modules/.cache/wxapp-minify',
}
```


指令运行：
```bash
$ npx wxapp-minify
# or
$ ./node_modules/.bin/wxapp-minify --help

Usage: wxapp-minify [options] [targetDir]

压缩微信小程序原生语法文件

Options:
    -V, --version              output the version number
    -d, --dest <distPath>      压缩文件所放的位置（默认为'dist'）
    -c, --config <configPath>  配置文件的路径（默认为'.minify.js'）
    --cache <cache>            是否开启缓存（默认为'true'）
    --cachePath <cachePath>    存储缓存的路径（默认为'node_modules/.cache/wxapp-minify'）
    -h, --help                 display help for command
```


脚本中使用：
```js
const wxappMinify = require('@talltotal/wxapp-minify')

wxappMinify()
```



## 对比

### `miniprogram-ci@1.1.6`
- `minifyJS`
    - 使用`terser`或`uglify-js`压缩JS
- `minifyWXML`
    - 未使用`html-minifier`，只做了`code.replace(/\r\n/g, "\n")`
- `minifyWXSS`
    - 使用`cssnano`压缩WXSS
    - `{preset:["default",{ reduceTransforms:false,calc:false,minifySelectors:false,normalizeUrl:false }]}`
- `minify`


### `miniprogram-slim@1.0.0-beta.1`
- 使用`imagemin`对glob匹配的文件做压缩图片
- 使用`spritesmith`对glob匹配的文件做雪碧图（生成一个png和一个css）
- 使用`jscpd`对js做相似度对比分析
- 从`project.config.json`目录到各页面引入的组件以及各模块，找到所有使用的文件

