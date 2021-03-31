const postcss = require('postcss')
const postcssVersion = require('postcss/package.json').version
const cssnano = require('cssnano')
const cssnanoVersion = require('cssnano/package.json').version
const htmlMinifier = require('@talltotal/html-minifier').minify
const htmlVersion = require('@talltotal/html-minifier/package.json').version
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
                // 区分大小写
                caseSensitive: true,
                // 删掉注释
                removeComments: true,
                // 折叠空白
                collapseWhitespace: false, // todo 需要保留换行样式的: 特定标签名/注释
                // 折叠布尔属性
                collapseBooleanAttributes: false,
                // 删除属性值的引号
                removeAttributeQuotes: false,
                // 防止属性值转义
                preventAttributesEscaping: true,
                // 在单例元素上保留尾部斜杠
                keepClosingSlash: true,
                // 压缩js部分
                minifyJS: true,
                // 压缩css部分
                minifyCSS: true,
                // 忽略的片段
                ignoreCustomFragments: [
                  /<import( *(src)=\s*)* *\/>/,
                  /<include( *(src)=\s*)* *\/>/,
                  /{{([\s\S]*?)}}/,
                ],
                // 新增配置，{{}}区域用js表达式压缩
                customExpressionFragments: [
                  new RegExp('(?<={{)([\\s\\S]*?)(?=}})'),
                ]
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
