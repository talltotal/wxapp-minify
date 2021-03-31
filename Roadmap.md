## 打包
调整为esm模式，使用rollup打包，支持esm和cjs。


## deps模式
不加载未使用文件。


## 验证 options
`require('schema-utils').validate`


## 增加 exclude 配置
`miniprogram_npm` 目录


## 应用多进程
```js
{
    // spawned worker 数量
    // true 为：`os.cpus().length - 1`
    // false 为：`0`
    /**
     * 测试数据：
     * 0: 4491-4780
     * 1: 3599-3826
     * 2: 3916-4032
     * 3: 4117-4474
     */
    workers: 0,
}

const os = require('os')
const jestWorker = require('jest-worker').default


const availableNumberOfCores = getAvailableNumberOfCores(opts.workers)
const worker = availableNumberOfCores > 0 ? new jestWorker(require.resolve('./minify'), {
    numWorkers: availableNumberOfCores
}) : null


if (worker) {
    worker.minWxss(txt)
}

if (worker) {
    await worker.end()
}


function getAvailableNumberOfCores(parallel) {
    // In some cases cpus() returns undefined
    // https://github.com/nodejs/node/issues/19022
    const cpuLen = (os.cpus() || {
      length: 1
    }).length
    return parallel === true ? cpuLen - 1 : Math.min(Number(parallel) || 0, cpuLen - 1)
}
```


