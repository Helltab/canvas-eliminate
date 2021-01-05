;(function (undefined) {
    let _global;

    /**
     *
     * @type {{ANIMATE: string, CHECK: string, NONE: string, STATIC: string}}
     */
    const STATE = {
        STATIC: 'static', // 静稳状态
        CHECK: 'check', // 移动状态
        ANIMATE: 'animate', // 动画状态
        NONE: 'none', // 无状态
    }


    function Game({canvas}) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d");
        this.fno = 0
        this.images = []
        this.R = {}
        let sp_arr = []
        this.map = null
        this.state = STATE.CHECK
        this.callbackFuns = {}
    }

    Game.prototype.loadR = function () {
        let xhr = new XMLHttpRequest()
        xhr.onload = e => {
            this.images = JSON.parse(xhr.responseText).images
            let len = this.images.length
            for (let i = 0; i < len; i++) {
                let imgObj = this.images[i], self = this
                this.R[imgObj.name] = new Image()
                this.R[imgObj.name].src = imgObj.url
                this.R[imgObj.name].onload = function () {
                    console.log(`图片资源正在加载中(${i + 1}/${len})`)
                    if (i + 1 === len) {
                        self.sp_arr = [self.R['sp1'], self.R['sp2'], self.R['sp3'], self.R['sp4'], self.R['sp5'], self.R['sp6'], self.R['sp7'],];
                        self.init()
                    }
                }
                this.R[imgObj.name].onerror = function (e) {
                    console.error(e, '出错了')
                }
            }
        };
        xhr.open('GET', './src/R.json')
        xhr.send()
    }
    Game.prototype.init = function () {
        this.ctx.drawImage(this.R['grid'], 0, 0)
        this.start()
    }
    Game.prototype.start = function () {
        this.map = new GameMap()
        this.map.createMatrix()
        setInterval(() => {
            this.fno++
            this.clean()
            switch (this.state) {
                case STATE.STATIC:
                    break;
                case STATE.CHECK:
                    this.state = this.map.check() ? STATE.ANIMATE : STATE.STATIC
                    break;
                case STATE.ANIMATE:
                    this.map.bomb()
                    this.state = STATE.STATIC
                    this.registry(30, () => {
                        this.map.flow()
                        this.registry(40, () => {
                            this.map.supply()
                            this.registry(30, () => {
                                this.state = STATE.CHECK
                            })
                        })
                    })
                    break;
            }
            if (this.callbackFuns.hasOwnProperty(this.fno)) {
                this.callbackFuns[this.fno]()
            }
            this.ctx.drawImage(this.R['grid'], 0, 0, this.canvas.width, this.R['grid'].height * (this.canvas.width / this.R['grid'].width))
            this.ctx.save()
            this.ctx.font = '30px Arial'
            this.ctx.fillText("fno: " + this.fno, 10, this.canvas.height - 10)
            this.map.render()
            this.ctx.restore()

            if (this.fno == 100) {
                this.map.check()
            }
        }, 20)
    }

    Game.prototype.registry = function (after, callback) {
        this.callbackFuns[this.fno + after] = callback
    }
    Game.prototype.clean = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    _global = (function () {
        return this || (0, eval)('this');
    }())
    // @ts-ignore
    if (typeof module !== 'undefined' && module.exports) {
        // @ts-ignore
        module.exports = Game;
    } else {
        // @ts-ignore
        if (typeof define === 'function' && define.cmd) {
            // @ts-ignore
            define(function () {
                return Game;
            })
        } else {
            !('Game' in _global) && (_global.Game = Game)
        }
    }
})()