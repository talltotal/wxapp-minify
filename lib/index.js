const fs = require('fs-extra')
const path = require('path')
const { defaults } = require('./options.js')
const { minWxss, minSvg, minWxml, minJson} = require('./minify.js')
const Cache = require('./cache.js')


module.exports = async function (options) {
    const opts = Object.assign({}, defaults, options)

    let cacheWxssVm
    let cacheWxmlVm
    if (opts.cache) {
        cacheWxssVm = new Cache({
            cacheDirectory: opts.cachePath,
            getKey: filePath => minWxss.version + filePath
        })
        cacheWxmlVm = new Cache({
            cacheDirectory: opts.cachePath,
            getKey: filePath => minWxml.version + filePath
        })
    }

    // 重置dist文件夹
    clearDist(opts.distPath)

    // 遍历源码目录处理各类型文件
    ergodic(
        opts.srcPath,
        (filePath) => {
            const { ext } = path.parse(filePath)
            const target = path.resolve(opts.distPath, path.relative(opts.srcPath, filePath))

            const handleFile = async (fn, cacheVm) => {
                try {
                    let cacheResult = false
                    if (cacheVm) {
                        cacheResult = await cacheVm.get(filePath)
                    }
                    if (cacheResult !== false) {
                        fs.writeFile(target, cacheResult)
                        return
                    }
    
                    const txt = await fs.readFile(filePath, 'utf-8')
                    const result = await fn(txt)

                    if (cacheVm) {
                        cacheVm.store(filePath, result)
                    }
                    await fs.writeFile(target, result)
                } catch (err) {
                    console.log('file `', filePath, '` minify fail:', err)
                    fs.copyFile(filePath, target, (err) => {
                        if (err) throw err
                    })
                }
            }
            switch (ext) {
                case '.wxss':
                    handleFile(minWxss, cacheWxssVm)
                    break
                case '.svg':
                    handleFile(minSvg)
                    break
                case '.wxml':
                    handleFile(minWxml, cacheWxmlVm)
                    break
                case '.json':
                    handleFile(minJson)
                    break
                default:
                    fs.copyFile(filePath, target)
            }
        },
        (dirPath, cb) => {
            const target = path.resolve(opts.distPath, path.relative(opts.srcPath, dirPath))
            fs.mkdir(target).then(cb)
        }
    )
}

function clearDist (distPath) {
    fs.removeSync(distPath)
    fs.mkdirSync(distPath)
}

const ergodic = (dirPath, handleFile, handleDir) => {
    fs.readdir(dirPath, {
        withFileTypes: true
    }).then(files => {
        files.forEach(fileItem => {
            const filename = fileItem.name
            const filePath = path.join(dirPath, filename)
            const isFile = fileItem.isFile()
            const isDir = fileItem.isDirectory()

            if (filename[0] === '.') {
                return
            }

            if (isFile) {
                handleFile(filePath)
            } else if (isDir) {
                handleDir(filePath, () => {
                    ergodic(filePath, handleFile, handleDir)
                })
            }
        })
    })
}
