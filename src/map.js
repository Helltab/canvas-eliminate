;(function (undefined) {
    let _global;

    function GameMap() {
        this.mode = 2
        this.sprites = []
        this.matrix = []
        this.baseX = 12
        this.baseY = 128
        for (let j = 0; j < 8; j++) {
            this.sprites.push([])
            this.matrix.push([])
        }
        forMatrix((row, col) => {
            this.matrix[row][col] = parseInt(Math.random() * this.mode)
        })
        // this.matrix = [
        //     [1, 1, 1, 1, 4, 5],
        //     [1, 2, 3, 4, 5, 0],
        //     [1, 3, 4, 5, 0, 3],
        //     [3, 3, 3, 0, 1, 1],
        //     [4, 5, 0, 1, 6, 3],
        //     [5, 0, 1, 2, 3, 4],
        //     [6, 0, 1, 2, 1, 2],
        //     [0, 1, 3, 1, 3, 4],
        //     [1, 2, 0, 4, 6, 0],
        //     [2, 3, 2, 3, 6, 0],
        // ]
    }

    /**
     * 根据矩阵构建精灵
     */
    GameMap.prototype.createMatrix = function () {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 6; col++) {
                this.sprites[row][col] = new Sprite({row: row, col: col, type: this.matrix[row][col]})
            }
        }
    }
    /**
     * 渲染精灵
     */
    GameMap.prototype.render = function () {
        forMatrix((row, col) => {
            this.sprites[row][col].update()
            this.sprites[row][col].render()
        })
    }

    /**
     * 遍历矩阵
     * @param callback
     */
    function forMatrix(callback) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 6; col++) {
                callback(row, col)
            }
        }
    }

    GameMap.prototype.update = function () {
        // this.sprites[2][1].moveTo({targetRow: 0, targetCol: 0, duringFrames: 60})
        // this.sprites[0][0].moveTo({targetRow: 2, targetCol: 1, duringFrames: 60})
    }
    /**
     * 补充新的精灵
     */
    GameMap.prototype.supply = function () {
        this.matrix.forEach((arr, row) => {
            arr.forEach((type, col) => {
                if (type === -1) {
                    type = parseInt(Math.random() * this.mode)
                    this.matrix[row][col] = type
                    this.sprites[row][col] = new Sprite({row: row, col: col, type: type})
                    this.sprites[row][col].y -= 20
                    this.sprites[row][col].moveTo({targetRow: row, targetCol: col, duringFrames: 10})
                }
            })
        })
    }
    /**
     * 引爆精灵
     */
    GameMap.prototype.bomb = function () {
        this.checks.forEach(item => {
            let row = item[0], col = item[1]
            this.sprites[row][col].isBomb = true
            this.matrix[row][col] = -1
        })
    }
    /**
     * 交换两个精灵的位置
     * @param src [row, col]
     * @param target [row, col]
     */
    GameMap.prototype.exchange = function ({src, target}) {
        let tempA = this.matrix[src[0]][src[1]],
            tempB = this.sprites[src[0]][src[1]]
        this.matrix[src[0]][src[1]] = this.matrix[target[0]][target[1]]
        this.matrix[target[0]][target[1]] = tempA
        this.sprites[src[0]][src[1]] = this.sprites[target[0]][target[1]]
        this.sprites[target[0]][target[1]] = tempB
    }
    /**
     * 精灵下落
     */
    GameMap.prototype.flow = function () {
        let flow_arr = []
        this.matrix.forEach((arr, row) => {
            arr.forEach((item, col) => {
                if (this.matrix[row][col] === -1) return
                let flowNum = 0
                for (let below = row + 1; below < 8; below++) {
                    if (this.matrix[below][col] === -1) {
                        flowNum++
                    }
                }
                if (flowNum > 0) {
                    flow_arr.push({row: row, col: col, flowNum: flowNum})
                    this.sprites[row][col].flow({flowNum: flowNum, duringFrames: 28})
                }
            })
        })
        flow_arr.reverse().forEach(flow => {
            this.exchange({src: [flow.row, flow.col], target: [flow.row + flow.flowNum, flow.col]})
        })
    }
    /**
     * 检测消除
     */
    GameMap.prototype.check = function () {
        this.checks = []
        // 双指针算法: 横向
        for (let row = 0; row < 8; row++) {
            let cur = 0, pre = 1
            let arr = this.matrix[row]
            while (pre < 6) {
                if (arr[cur] === arr[pre]) {
                    pre++
                } else {
                    if (pre - cur >= 3) {
                        for (let col = cur; col < pre; col++) {
                            this.checks.push([row, col])
                        }
                        cur = pre
                        pre++
                    } else {
                        cur++
                        if (cur == pre) {
                            pre++
                        }
                    }
                }
            }
            if (pre - cur >= 3) {
                for (let col = cur; col < pre; col++) {
                    this.checks.push([row, col])
                }
            }
        }
        // 纵向
        for (let col = 0; col < 6; col++) {
            let cur = 0, pre = 1
            while (pre < 8) {
                if (this.matrix[cur][col] === this.matrix[pre][col]) {
                    pre++
                } else {
                    if (pre - cur >= 3) {
                        for (let row = cur; row < pre; row++) {
                            if (this.checks.indexOf([row, col]) === -1) {
                                this.checks.push([row, col])
                            }
                        }
                        cur = pre
                        pre++
                    } else {
                        cur++
                        if (cur == pre) {
                            pre++
                        }
                    }
                }
            }
            if (pre - cur >= 3) {
                for (let row = cur; row < pre; row++) {
                    if (this.checks.indexOf([row, col]) === -1) {
                        this.checks.push([row, col])
                    }
                }
            }
        }
        return !!this.checks.length
    }

    _global = (function () {
        return this || (0, eval)('this');
    }())
    // @ts-ignore
    if (typeof module !== 'undefined' && module.exports) {
        // @ts-ignore
        module.exports = GameMap;
    } else {
        // @ts-ignore
        if (typeof define === 'function' && define.cmd) {
            // @ts-ignore
            define(function () {
                return GameMap;
            })
        } else {
            !('GameMap' in _global) && (_global.GameMap = GameMap)
        }
    }
})()