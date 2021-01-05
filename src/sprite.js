;(function (undefined) {
    let _global;

    let bomb_json = {
        "bomb_0": {"x": 60, "y": 61, "w": 6, "h": 7},
        "bomb_1": {"x": 54, "y": 54, "w": 21, "h": 20},
        "bomb_10": {"x": 10, "y": 11, "w": 104, "h": 111},
        // "bomb_11": {"x": 25, "y": 23, "w": 76, "h": 79},
        // "bomb_12": {"x": 31, "y": 23, "w": 68, "h": 78},
        // "bomb_13": {"x": 34, "y": 25, "w": 68, "h": 73},
        // "bomb_14": {"x": 33, "y": 24, "w": 72, "h": 77},
        "bomb_2": {"x": 42, "y": 42, "w": 42, "h": 42},
        "bomb_3": {"x": 36, "y": 36, "w": 55, "h": 54},
        "bomb_4": {"x": 13, "y": 17, "w": 101, "h": 101},
        "bomb_5": {"x": 2, "y": 6, "w": 125, "h": 121},
        "bomb_6": {"x": 0, "y": 5, "w": 127, "h": 122},
        "bomb_7": {"x": 0, "y": 2, "w": 127, "h": 125},
        "bomb_8": {"x": 0, "y": 0, "w": 127, "h": 127},
        "bomb_9": {"x": 0, "y": 0, "w": 127, "h": 126},
    }

    function Sprite({row, col, type}) {
        this.row = row
        this.col = col
        this.img = game.R['sp' + (type + 1)]
        this.bombImg = game.R['bomb']
        this.width = 60
        this.height = 60
        this.padding = game.canvas.width / 6 - 61
        this.x = this.col * (this.width + this.padding) + game.map.baseX
        this.y = this.row * (this.height + this.padding) + game.map.baseY
        this.dx = 0
        this.dy = 0
        this.moveNo = 0
        this.isBomb = false
        this.bombNo = 10
        this.isHide = false
    }

    Sprite.prototype.render = function () {
        if (this.isHide) return
        if (this.isBomb) {
            this.bomb()
        } else {
            game.ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        }
    }
    Sprite.prototype.update = function () {
        if (this.moveNo > 0) {
            this.x += this.dx;
            this.y += this.dy;
            this.moveNo--
        }
        // this.render()
    }
    Sprite.prototype.moveTo = function ({targetRow, targetCol, duringFrames}) {
        this.moveNo = duringFrames
        this.col = targetCol
        this.row = targetRow
        this.dx = (targetCol * (this.width + this.padding) + game.map.baseX - this.x) / duringFrames
        this.dy = (targetRow * (this.height + this.padding) + game.map.baseY - this.y) / duringFrames
    }
    Sprite.prototype.flow = function ({flowNum, duringFrames}) {
        if (this.isHide) return
        this.moveNo = duringFrames
        this.row += flowNum
        this.dy = flowNum * (this.height + this.padding) / duringFrames
    }
    Sprite.prototype.bomb = function () {
        let bombObj = bomb_json['bomb_' + this.bombNo]
        game.ctx.drawImage(this.bombImg, bombObj.x, bombObj.y, bombObj.w, bombObj.h, this.x, this.y, this.width, this.height)
        if (this.bombNo === 0) {
            this.bombNo = 10
            this.isBomb = false
            this.isHide = true
        }
        if (game.fno % 3 === 0) {
            this.bombNo--
        }
    }

    _global = (function () {
        return this || (0, eval)('this');
    }())
    // @ts-ignore
    if (typeof module !== 'undefined' && module.exports) {
        // @ts-ignore
        module.exports = Sprite;
    } else {
        // @ts-ignore
        if (typeof define === 'function' && define.cmd) {
            // @ts-ignore
            define(function () {
                return Sprite;
            })
        } else {
            !('Sprite' in _global) && (_global.Sprite = Sprite)
        }
    }
})()