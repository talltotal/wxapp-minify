const postcss = require('postcss')
const postcssVersion = require('postcss/package.json').version
const cssnano = require('cssnano')
const cssnanoVersion = require('cssnano/package.json').version
const htmlMinifier = require('html-minifier').minify
const htmlVersion = require('html-minifier/package.json').version
const svgo = require('svgo')
const svgoVersion = require('svgo/package.json').version

function minWxss (txt) {
    /**
     * postcss + cssnano
     */
    return postcss([cssnano({})])
        .process(txt, { from: undefined })
        .then(result => {
            return Promise.resolve(result.css)
        })
}
// 如果本包的处理方式调整，应带上本包的版本号或只针对这个函数的版本号
minWxss.version = `${postcssVersion}+${cssnanoVersion}+`

function minSvg (txt) {
    return new Promise((resolve) => {
        let t = txt
        try {
            t = svgo.optimize(t).data
        } catch (e) {
            console.error(e)
        }
        resolve(t)
    })
}
minSvg.version = `${svgoVersion}+`

function minWxml (txt) {
    return new Promise((resolve) => {
        let t = txt
        try {
            t = htmlMinifier(t, {
                caseSensitive: true,
                removeComments: true,
                collapseWhitespace: false, // todo 需要保留换行样式的: 特定标签名/注释
                collapseBooleanAttributes: true,
                removeScriptTypeAttributes: true,
                removeAttributeQuotes: false,
                preventAttributesEscaping: true,
                keepClosingSlash: true,
                ignoreCustomFragments: [
                    /<wxs([\s\S]*?)<\/wxs>/,
                    /<wxs( *(src|module)=\s*)* *\/>/,
                    /<import( *(src)=\s*)* *\/>/,
                    /{{([\s\S]*?)}}/,
                ],
            })
        } catch (e) {
            console.error(e)
        }
        resolve(t)
    })
}
minWxml.version = `${htmlVersion}+`

function minJson (txt) {
    return Promise.resolve(JSON.stringify(JSON.parse(txt)))
}

module.exports = {
    minWxss,
    minSvg,
    minWxml,
    minJson,
}
