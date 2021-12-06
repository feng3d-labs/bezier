/**
 * 基于时间轴的连续三阶Bézier曲线
 *
 * @author feng / http://feng3d.com 10/06/2018
 */
var TimeLineCubicBezierSequence = /** @class */ (function () {
    function TimeLineCubicBezierSequence() {
        /**
         * 最大tan值，超出该值后将会变成分段
         */
        this.maxtan = 1000;
        this.keys = [];
    }
    Object.defineProperty(TimeLineCubicBezierSequence.prototype, "numKeys", {
        /**
         * 关键点数量
         */
        get: function () {
            return this.keys.length;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 添加关键点
     *
     * 添加关键点后将会执行按t进行排序
     *
     * @param key 关键点
     */
    TimeLineCubicBezierSequence.prototype.addKey = function (key) {
        this.keys.push(key);
        this.sort();
    };
    /**
     * 关键点排序
     *
     * 当移动关键点或者新增关键点时需要再次排序
     */
    TimeLineCubicBezierSequence.prototype.sort = function () {
        this.keys.sort(function (a, b) { return a.t - b.t; });
    };
    /**
     * 删除关键点
     * @param key 关键点
     */
    TimeLineCubicBezierSequence.prototype.deleteKey = function (key) {
        var index = this.keys.indexOf(key);
        if (index != -1)
            this.keys.splice(index, 1);
    };
    /**
     * 获取关键点
     * @param index 索引
     */
    TimeLineCubicBezierSequence.prototype.getKey = function (index) {
        return this.keys[index];
    };
    /**
     * 获取关键点索引
     * @param key 关键点
     */
    TimeLineCubicBezierSequence.prototype.indexOfKeys = function (key) {
        return this.keys.indexOf(key);
    };
    /**
     * 获取曲线上点信息
     * @param t 时间轴的位置 [0,1]
     */
    TimeLineCubicBezierSequence.prototype.getPoint = function (t) {
        var keys = this.keys;
        var maxtan = this.maxtan;
        for (var i = 0, n = keys.length; i < n; i++) {
            // 使用 bezierCurve 进行采样曲线点
            var key = keys[i];
            var prekey = keys[i - 1];
            if (i > 0 && prekey.t <= t && t <= key.t) {
                var xstart = prekey.t;
                var ystart = prekey.y;
                var tanstart = prekey.tan;
                var xend = key.t;
                var yend = key.y;
                var tanend = key.tan;
                if (maxtan > Math.abs(tanstart) && maxtan > Math.abs(tanend)) {
                    var ct = (t - prekey.t) / (key.t - prekey.t);
                    var sys = [ystart, ystart + tanstart * (xend - xstart) / 3, yend - tanend * (xend - xstart) / 3, yend];
                    var fy = bezier.getValue(ct, sys);
                    return { t: t, y: fy, tan: bezier.getDerivative(ct, sys) / (xend - xstart) };
                }
                else {
                    return { t: t, y: prekey.y, tan: 0 };
                }
            }
            if (i == 0 && t <= key.t) {
                return { t: t, y: key.y, tan: 0 };
            }
            if (i == n - 1 && t >= key.t) {
                return { t: t, y: key.y, tan: 0 };
            }
        }
        return null;
    };
    /**
     * 获取值
     * @param t 时间轴的位置 [0,1]
     */
    TimeLineCubicBezierSequence.prototype.getValue = function (t) {
        var point = this.getPoint(t);
        return point.y;
    };
    /**
     * 查找关键点
     * @param t 时间轴的位置 [0,1]
     * @param y 值
     * @param precision 查找精度
     */
    TimeLineCubicBezierSequence.prototype.findKey = function (t, y, precision) {
        var keys = this.keys;
        for (var i = 0; i < keys.length; i++) {
            if (Math.abs(keys[i].t - t) < precision && Math.abs(keys[i].y - y) < precision) {
                return keys[i];
            }
        }
        return null;
    };
    /**
     * 添加曲线上的关键点
     *
     * 如果该点在曲线上，则添加关键点
     *
     * @param t 时间轴的位置 [0,1]
     * @param y y坐标
     * @param precision 查找进度
     */
    TimeLineCubicBezierSequence.prototype.addKeyAtCurve = function (t, y, precision) {
        var point = this.getPoint(t);
        if (Math.abs(y - point.y) < precision) {
            this.addKey(point);
            return point;
        }
        return null;
    };
    /**
     * 获取曲线样本数据
     *
     * 这些点可用于连线来拟合曲线。
     *
     * @param num 采样次数 ，采样点分别为[0,1/num,2/num,....,(num-1)/num,1]
     */
    TimeLineCubicBezierSequence.prototype.getSamples = function (num) {
        if (num === void 0) { num = 100; }
        var results = [];
        for (var i = 0; i <= num; i++) {
            var p = this.getValue(i / num);
            results.push(p);
        }
        return results;
    };
    return TimeLineCubicBezierSequence;
}());
//# sourceMappingURL=TimeLineCubicBezierSequence.js.map