# wxapp-minify

为微信小程序原生语法设计的压缩脚本。

支持压缩的文件类型：`.wxss``.json``.wxml``.svg`。

支持对`.wxss`和`.wxml`文件缓存。



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
$ npx minify
# or
$ ./node_modules/.bin/minify --help

Usage: minify [options] [targetDir]

压缩微信小程序原生语法文件

Options:
  -V, --version              output the version number
  -d, --dest <distPath>      压缩文件所放的位置（默认为'dist'）
  -c, --config <configPath>  配置文件的路径（默认为'.minify.js'）
  --cache <cache>            是否开启缓存（默认为'true'）
  --cachePath <cachePath>    存储缓存的路径（默认为'node_modules/.cache/wxapp-minify'）
  -h, --help                 display help for command
```

