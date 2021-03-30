const fs = require('fs-extra')
const path = require('path')
const crypto = require('crypto')

function Cache (opts) {
    const { cacheDirectory, getKey = p => p } = opts
    this.cacheDirectory = cacheDirectory
    this.hasCacheDir = false
    this.getKey = filePath => path.join(cacheDirectory, `${digest(getKey(filePath))}.json`)
}

Cache.prototype.store = function (filePath, content) {
    fs.stat(filePath, ((err, stats) => {
        if (err) {
            return
        }
        const key = this.getKey(filePath)

        if (!this.hasCacheDir) {
            fs.mkdirp(this.cacheDirectory, err => {
                if (err) {
                    return
                }

                this.hasCacheDir = true

                fs.writeJSON(key, {
                    mtime: stats.mtime.getTime(),
                    content
                })
            })
        } else {
            fs.writeJSON(key, {
                mtime: stats.mtime.getTime(),
                content
            })
        }
    }))
}

Cache.prototype.get = function (filePath) {
    return new Promise ((resolve) => {
        const key = this.getKey(filePath)

        fs.readJSON(key, (err, data) => {
            if (err) {
                return resolve(false)
            }

            fs.stat(filePath, ((err, stats) => {
                if (err) {
                    return resolve(false)
                }

                if (stats.mtime.getTime() !== data.mtime) {
                    return resolve(false)
                } else {
                    return resolve(data.content)
                }
            }))
        })
    })
}

function digest(str) {
    return crypto.createHash('md5').update(str).digest('hex')
}

module.exports = Cache
