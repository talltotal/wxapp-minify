#!/usr/bin/env node

require('v8-compile-cache');
const start = Date.now()

const fs = require('fs')
const program = require('commander')

program
    .version(require('../package.json').version)
    .description('压缩微信小程序原生语法文件')
    .arguments('[targetDir]')
    .option('-d, --dest <distPath>', '压缩文件所放的位置（默认为\'dist\'）')
    .option('-c, --config <configPath>', '配置文件的路径（默认为\'.minify.js\'）')
    .option('--cache <cache>', '是否开启缓存（默认为\'true\'）')
    .option('--cachePath <cachePath>', '存储缓存的路径（默认为\'node_modules/.cache/wxapp-minify\'）')
    .action((targetDir, options) => {
        let opts = Object.assign({}, options)
        if (targetDir) {
            opts.srcPath = targetDir
        }

        if (options.configPath) {
            delete opts.configPath
            if (fs.existsSync(options.configPath)) {
                try {
                    opts = Object.assign({}, opts, require(configPath))
                } catch (err) {
                    throw err
                }
            }
        }

        require('../lib/index.js')(opts)

        process.on('exit', () => {
            console.log(`压缩完成，用时：${Date.now() - start}ms。`)
        })
    })

program.parse(process.argv)
