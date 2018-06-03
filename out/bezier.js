/**
 * Bézier曲线
 */
var bezierCurve;
/**
 * Bézier曲线
 * @see https://en.wikipedia.org/wiki/B%C3%A9zier_curve
 *
 * @author feng / http://feng3d.com 03/06/2018
 */
var BezierCurve = /** @class */ (function () {
    function BezierCurve() {
    }
    /**
     * 线性Bézier曲线
     * 给定不同的点P0和P1，线性Bézier曲线就是这两个点之间的直线。曲线由下式给出
     * ```
     * B(t) = p0 + t * (p1 - p0) = (1 - t) * p0 + t * p1 , 0 <= t && t <= 1
     * ```
     * 相当于线性插值
     *
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     */
    BezierCurve.prototype.linear = function (t, p0, p1) {
        return p0 + t * (p1 - p0);
        // return (1 - t) * p0 + t * p1;
    };
    /**
     * 线性Bézier曲线关于t的导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     */
    BezierCurve.prototype.linearDerivative = function (t, p0, p1) {
        return p1 - p0;
    };
    /**
     * 线性Bézier曲线关于t的二阶导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     */
    BezierCurve.prototype.linearSecondDerivative = function (t, p0, p1) {
        return 0;
    };
    /**
     * 二次Bézier曲线
     *
     * 二次Bézier曲线是由函数B（t）跟踪的路径，给定点P0，P1和P2，
     * ```
     * B(t) = (1 - t) * ((1 - t) * p0 + t * p1) + t * ((1 - t) * p1 + t * p2) , 0 <= t && t <= 1
     * ```
     * 这可以解释为分别从P0到P1和从P1到P2的线性Bézier曲线上相应点的线性插值。重新排列前面的等式得出：
     * ```
     * B(t) = (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2 , 0 <= t && t <= 1
     * ```
     * Bézier曲线关于t的导数是
     * ```
     * B'(t) = 2 * (1 - t) * (p1 - p0) + 2 * t * (p2 - p1)
     * ```
     * 从中可以得出结论：在P0和P2处曲线的切线在P 1处相交。随着t从0增加到1，曲线沿P1的方向从P0偏离，然后从P1的方向弯曲到P2。
     *
     * Bézier曲线关于t的二阶导数是
     * ```
     * B''(t) = 2 * (p2 - 2 * p1 + p0)
     * ```
     *
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     */
    BezierCurve.prototype.quadratic = function (t, p0, p1, p2) {
        // return this.linear(t, this.linear(t, p0, p1), this.linear(t, p1, p2));
        // return (1 - t) * ((1 - t) * p0 + t * p1) + t * ((1 - t) * p1 + t * p2);
        return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
    };
    /**
     * 二次Bézier曲线关于t的导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     */
    BezierCurve.prototype.quadraticDerivative = function (t, p0, p1, p2) {
        // return 2 * this.linear(t, this.linearDerivative(t, p0, p1), this.linearDerivative(t, p1, p2));
        return 2 * (1 - t) * (p1 - p0) + 2 * t * (p2 - p1);
    };
    /**
     * 二次Bézier曲线关于t的二阶导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     */
    BezierCurve.prototype.quadraticSecondDerivative = function (t, p0, p1, p2) {
        // return 1 * 2 * this.linearDerivative(t, p1 - p0, p2 - p1)
        // return 1 * 2 * ((p2 - p1) - (p1 - p0));
        return 2 * (p2 - 2 * p1 + p0);
    };
    /**
     * 立方Bézier曲线
     *
     * 平面中或高维空间中（其实一维也是成立的，这里就是使用一维计算）的四个点P0，P1，P2和P3定义了三次Bézier曲线。
     * 曲线开始于P0朝向P1并且从P2的方向到达P3。通常不会通过P1或P2; 这些点只是为了提供方向信息。
     * P1和P2之间的距离在转向P2之前确定曲线向P1移动的“多远”和“多快” 。
     *
     * 对于由点Pi，Pj和Pk定义的二次Bézier曲线，可以将Bpipjpk(t)写成三次Bézier曲线，它可以定义为两条二次Bézier曲线的仿射组合：
     * ```
     * B(t) = (1 - t) * Bp0p1p2(t) + t * Bp1p2p3(t) , 0 <= t && t <= 1
     * ```
     * 曲线的显式形式是：
     * ```
     * B(t) = (1 - t) * (1 - t) * (1 - t) * p0 + 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t * p3 , 0 <= t && t <= 1
     * ```
     * 对于P1和P2的一些选择，曲线可以相交，或者包含尖点。
     *
     * 三次Bézier曲线相对于t的导数是
     * ```
     * B'(t) = 3 * (1 - t) * (1 - t) * (p1 - p0) + 6 * (1 - t) * t * (p2 - p1) + 3 * t * t * (p3 - p2);
     * ```
     * 三次Bézier曲线关于t的二阶导数是
     * ```
     * 6 * (1 - t) * (p2 - 2 * p1 + p0) + 6 * t * (p3 - 2 * p2 + p1);
     * ```
     *
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     * @param p3 点3
     */
    BezierCurve.prototype.cubic = function (t, p0, p1, p2, p3) {
        // return this.linear(t, this.quadratic(t, p0, p1, p2), this.quadratic(t, p1, p2, p3));
        return (1 - t) * (1 - t) * (1 - t) * p0 + 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t * p3;
    };
    /**
     * 三次Bézier曲线关于t的导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     * @param p3 点3
     */
    BezierCurve.prototype.cubicDerivative = function (t, p0, p1, p2, p3) {
        // return 3 * this.linear(t, this.quadraticDerivative(t, p0, p1, p2), this.quadraticDerivative(t, p1, p2, p3));
        return 3 * (1 - t) * (1 - t) * (p1 - p0) + 6 * (1 - t) * t * (p2 - p1) + 3 * t * t * (p3 - p2);
    };
    /**
     * 三次Bézier曲线关于t的二阶导数
     * @param t 插值度
     * @param p0 点0
     * @param p1 点1
     * @param p2 点2
     */
    BezierCurve.prototype.cubicSecondDerivative = function (t, p0, p1, p2, p3) {
        // return 3 * this.linear(t, this.quadraticSecondDerivative(t, p0, p1, p2), this.quadraticSecondDerivative(t, p1, p2, p3));
        return 6 * (1 - t) * (p2 - 2 * p1 + p0) + 6 * t * (p3 - 2 * p2 + p1);
    };
    /**
     * n次Bézier曲线
     *
     * 一般定义
     *
     * Bézier曲线可以定义为任意度n。
     *
     * @param t 插值度
     * @param ps 点列表 ps.length == n+1
     */
    BezierCurve.prototype.bn = function (t, ps) {
        ps = ps.concat();
        // n次Bézier递推
        for (var i = ps.length - 1; i > 0; i--) {
            for (var j = 0; j < i; j++) {
                ps[j] = (1 - t) * ps[j] + t * ps[j + 1];
            }
        }
        return ps[0];
    };
    /**
     * n次Bézier曲线关于t的导数
     *
     * 一般定义
     *
     * Bézier曲线可以定义为任意度n。
     *
     * @param t 插值度
     * @param ps 点列表 ps.length == n+1
     */
    BezierCurve.prototype.bnDerivative = function (t, ps) {
        if (ps.length < 2)
            return 0;
        ps = ps.concat();
        // 进行
        for (var i = 0, n = ps.length - 1; i < n; i++) {
            ps[i] = ps[i + 1] - ps[i];
        }
        //
        ps.length = ps.length - 1;
        var v = ps.length * this.bn(t, ps);
        return v;
    };
    /**
     * n次Bézier曲线关于t的二阶导数
     *
     * 一般定义
     *
     * Bézier曲线可以定义为任意度n。
     *
     * @param t 插值度
     * @param ps 点列表 ps.length == n+1
     */
    BezierCurve.prototype.bnSecondDerivative = function (t, ps) {
        if (ps.length < 3)
            return 0;
        ps = ps.concat();
        // 进行
        for (var i = 0, n = ps.length - 1; i < n; i++) {
            ps[i] = ps[i + 1] - ps[i];
        }
        //
        ps.length = ps.length - 1;
        var v = ps.length * this.bnDerivative(t, ps);
        return v;
    };
    /**
     * n次Bézier曲线关于t的dn阶导数
     *
     * Bézier曲线可以定义为任意度n。
     *
     * @param t 插值度
     * @param dn 求导次数
     * @param ps 点列表     ps.length == n+1
     */
    BezierCurve.prototype.bnND = function (t, dn, ps) {
        if (ps.length < dn + 1)
            return 0;
        var factorial = 1;
        ps = ps.concat();
        for (var j = 0; j < dn; j++) {
            // 进行
            for (var i = 0, n = ps.length - 1; i < n; i++) {
                ps[i] = ps[i + 1] - ps[i];
            }
            //
            ps.length = ps.length - 1;
            factorial *= ps.length;
        }
        var v = factorial * this.bn(t, ps);
        return v;
    };
    /**
     * 获取曲线在指定插值度上的值
     * @param t 插值度
     * @param ps 点列表
     */
    BezierCurve.prototype.getValue = function (t, ps) {
        if (ps.length == 2) {
            return this.linear(t, ps[0], ps[1]);
        }
        if (ps.length == 3) {
            return this.quadratic(t, ps[0], ps[1], ps[2]);
        }
        if (ps.length == 4) {
            return this.cubic(t, ps[0], ps[1], ps[2], ps[3]);
        }
        return this.bn(t, ps);
        // var t1 = 1 - t;
        // return t1 * t1 * t1 * ps[0] + 3 * t1 * t1 * t * ps[1] + 3 * t1 * t * t * ps[2] + t * t * t * ps[3];
    };
    /**
     * 获取曲线在指定插值度上的导数(斜率)
     * @param t 插值度
     * @param ps 点列表
     */
    BezierCurve.prototype.getDerivative = function (t, ps) {
        if (ps.length == 2) {
            return this.linearDerivative(t, ps[0], ps[1]);
        }
        if (ps.length == 3) {
            return this.quadraticDerivative(t, ps[0], ps[1], ps[2]);
        }
        if (ps.length == 4) {
            return this.cubicDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        }
        return this.bnDerivative(t, ps);
        // return 3 * (1 - t) * (1 - t) * (ps[1] - ps[0]) + 6 * (1 - t) * t * (ps[2] - ps[1]) + 3 * t * t * (ps[3] - ps[2]);
    };
    /**
     * 获取曲线在指定插值度上的二阶导数
     * @param t 插值度
     * @param ps 点列表
     */
    BezierCurve.prototype.getSecondDerivative = function (t, ps) {
        if (ps.length == 2) {
            return this.linearSecondDerivative(t, ps[0], ps[1]);
        }
        if (ps.length == 3) {
            return this.quadraticSecondDerivative(t, ps[0], ps[1], ps[2]);
        }
        if (ps.length == 4) {
            return this.cubicSecondDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        }
        return this.bnSecondDerivative(t, ps);
        // return 3 * (1 - t) * (1 - t) * (ps[1] - ps[0]) + 6 * (1 - t) * t * (ps[2] - ps[1]) + 3 * t * t * (ps[3] - ps[2]);
    };
    /**
     * 查找区间内极值所在插值度列表
     *
     * @param ps 点列表
     * @param numSamples 采样次数，用于分段查找极值
     * @param precision  查找精度
     *
     * @returns 插值度列表
     */
    BezierCurve.prototype.getTAtExtremums = function (ps, numSamples, precision) {
        if (numSamples === void 0) { numSamples = 10; }
        if (precision === void 0) { precision = 0.0000001; }
        var samples = [];
        for (var i = 0; i <= numSamples; i++) {
            samples.push(this.getDerivative(i / numSamples, ps));
        }
        // 查找存在解的分段
        var resultRanges = [];
        for (var i = 0, n = numSamples; i < n; i++) {
            if (samples[i] * samples[i + 1] < 0) {
                resultRanges.push(i / numSamples);
            }
        }
        //
        var results = [];
        for (var i = 0, n = resultRanges.length; i < n; i++) {
            var guessT = resultRanges[i];
            var derivative = this.getDerivative(guessT, ps);
            while (Math.abs(derivative) > precision) {
                // 使用斜率进行预估目标位置
                var slope = this.getSecondDerivative(guessT, ps);
                if (slope == 0)
                    break;
                guessT += -derivative / slope;
                derivative = this.getDerivative(guessT, ps);
            }
            if (guessT < 0 || guessT > 1) {
                console.log(guessT + " \u4E0D\u6B63\u786E\uFF01");
            }
            results.push(guessT);
        }
        return results;
    };
    /**
     * 获取单调区间列表
     * @returns {} {ts: 区间节点插值度列表,vs: 区间节点值列表}
     */
    BezierCurve.prototype.getMonotoneIntervals = function (ps, numSamples, precision) {
        if (numSamples === void 0) { numSamples = 10; }
        if (precision === void 0) { precision = 0.0000001; }
        // 区间内的单调区间
        var monotoneIntervalTs = [0, 1];
        var monotoneIntervalVs = [ps[0], ps[ps.length - 1]];
        // 预先计算好极值
        var extremumTs = this.getTAtExtremums(ps, numSamples, precision);
        var extremumVs = [];
        for (var i = 0; i < extremumTs.length; i++) {
            extremumVs[i] = this.getValue(extremumTs[i], ps);
            // 增加单调区间
            monotoneIntervalTs.splice(i + 1, 0, extremumTs[i]);
            monotoneIntervalVs.splice(i + 1, 0, extremumVs[i]);
        }
        return { ts: monotoneIntervalTs, vs: monotoneIntervalVs };
    };
    /**
     * 获取目标值所在的插值度T
     *
     * @param targetV 目标值
     * @param ps 点列表
     * @param numSamples 分段数量，用于分段查找，用于解决寻找多个解、是否无解等问题；过少的分段可能会造成找不到存在的解决，过多的分段将会造成性能很差。
     * @param precision  查找精度
     *
     * @returns 返回解数组
     */
    BezierCurve.prototype.getTFromValue = function (targetV, ps, numSamples, precision) {
        if (numSamples === void 0) { numSamples = 10; }
        if (precision === void 0) { precision = 0.0000001; }
        // 获取单调区间
        var monotoneIntervals = this.getMonotoneIntervals(ps, numSamples, precision);
        var monotoneIntervalTs = monotoneIntervals.ts;
        var monotoneIntervalVs = monotoneIntervals.vs;
        // 目标估计值列表
        var guessTs = [];
        // 遍历单调区间
        for (var i = 0, n = monotoneIntervalVs.length - 1; i < n; i++) {
            if ((monotoneIntervalVs[i] - targetV) * (monotoneIntervalVs[i + 1] - targetV) <= 0) {
                guessTs.push((monotoneIntervalTs[i] + monotoneIntervalTs[i + 1]) / 2);
            }
        }
        var results = [];
        for (var i = 0, n = guessTs.length; i < n; i++) {
            var result = this.getTFromValueAtRange(targetV, ps, guessTs[i], precision);
            results.push(result);
        }
        return results;
    };
    /**
     * 从存在解的区域进行插值值
     *
     * 该函数只能从单调区间内查找值，并且 targetV 处于该区间内
     *
     * @param targetV 目标值
     * @param ps 点列表
     * @param guessT 预估目标T值，单调区间内的一个预估值
     * @param precision  查找精度
     */
    BezierCurve.prototype.getTFromValueAtRange = function (targetV, ps, guessT, precision) {
        if (guessT === void 0) { guessT = 0; }
        if (precision === void 0) { precision = 0.0000001; }
        var middleV = this.getValue(guessT, ps);
        while (Math.abs(middleV - targetV) > precision) {
            // 使用斜率进行预估目标位置
            var slope = this.getDerivative(guessT, ps);
            if (slope == 0)
                break;
            guessT += (targetV - middleV) / slope;
            middleV = this.getValue(guessT, ps);
        }
        return guessT;
    };
    /**
     * 获取曲线样本数据
     *
     * 这些点可用于连线来拟合曲线。
     *
     * @param ps 点列表
     * @param num 采样次数 ，采样点分别为[0,1/num,2/num,....,(num-1)/num,1]
     */
    BezierCurve.prototype.getSamples = function (ps, num) {
        if (num === void 0) { num = 100; }
        var results = [];
        for (var i = 0; i <= num; i++) {
            var p = this.getValue(i / num, ps);
            results.push(p);
        }
        return results;
    };
    return BezierCurve;
}());
bezierCurve = new BezierCurve();
/**
 * 立方Bézier曲线
 *
 * 为了提升性能以及简化单独从BezierCurve提取出来。
 *
 * @author feng / http://feng3d.com 03/06/2018
 */
var CubicBezierCurve = /** @class */ (function () {
    /**
     * 创建立方Bézier曲线
     * @param p0 起始点
     * @param p1 控制点1
     * @param p2 控制点2
     * @param p3 终止点
     */
    function CubicBezierCurve(p0, p1, p2, p3) {
        // cache
        /**
         * 单调区间插值点列表
         */
        this.monotoneIntervalTs = [];
        /**
         * 单调区间值列表
         */
        this.monotoneIntervalVs = [];
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        // 缓存单调区间
        var monotoneIntervals = this.getMonotoneIntervals();
        this.monotoneIntervalTs = monotoneIntervals.ts;
        this.monotoneIntervalVs = monotoneIntervals.vs;
    }
    /**
     *
     * @param t 插值度
     */
    CubicBezierCurve.prototype.getValue = function (t) {
        return (1 - t) * (1 - t) * (1 - t) * this.p0 + 3 * (1 - t) * (1 - t) * t * this.p1 + 3 * (1 - t) * t * t * this.p2 + t * t * t * this.p3;
    };
    /**
     * 三次Bézier曲线关于t的导数
     * @param t 插值度
     */
    CubicBezierCurve.prototype.getDerivative = function (t) {
        return 3 * (1 - t) * (1 - t) * (this.p1 - this.p0) + 6 * (1 - t) * t * (this.p2 - this.p1) + 3 * t * t * (this.p3 - this.p2);
    };
    /**
     * 三次Bézier曲线关于t的二阶导数
     * @param t 插值度
     */
    CubicBezierCurve.prototype.getSecondDerivative = function (t) {
        return 6 * (1 - t) * (this.p2 - 2 * this.p1 + this.p0) + 6 * t * (this.p3 - 2 * this.p2 + this.p1);
    };
    /**
     * 查找区间内极值所在插值度列表
     *
     * @param numSamples 采样次数，用于分段查找极值
     * @param precision  查找精度
     *
     * @returns 极值所在插值度列表
     */
    CubicBezierCurve.prototype.getTAtExtremums = function (numSamples, precision) {
        if (numSamples === void 0) { numSamples = 10; }
        if (precision === void 0) { precision = 0.0000001; }
        // 预先计算分段斜率值
        var sampleDerivatives = [];
        for (var i = 0; i <= numSamples; i++) {
            sampleDerivatives[i] = this.getDerivative(i / numSamples);
        }
        // 查找存在解的分段
        var resultRanges = [];
        for (var i = 0, n = numSamples; i < n; i++) {
            if (sampleDerivatives[i] * sampleDerivatives[i + 1] < 0) {
                resultRanges.push(i / numSamples);
            }
        }
        //
        var results = [];
        for (var i = 0, n = resultRanges.length; i < n; i++) {
            var guessT = resultRanges[i];
            var derivative = this.getDerivative(guessT);
            while (Math.abs(derivative) > precision) {
                // 使用斜率进行预估目标位置
                var slope = this.getSecondDerivative(guessT);
                if (slope == 0)
                    break;
                guessT += -derivative / slope;
                derivative = this.getDerivative(guessT);
            }
            results.push(guessT);
        }
        return results;
    };
    /**
     * 获取单调区间列表
     * @returns {} {ts: 区间节点插值度列表,vs: 区间节点值列表}
     */
    CubicBezierCurve.prototype.getMonotoneIntervals = function (numSamples, precision) {
        if (numSamples === void 0) { numSamples = 10; }
        if (precision === void 0) { precision = 0.0000001; }
        // 区间内的单调区间
        var monotoneIntervalTs = [0, 1];
        var monotoneIntervalVs = [this.p0, this.p3];
        // 预先计算好极值
        var extremumTs = this.getTAtExtremums(numSamples, precision);
        var extremumVs = [];
        for (var i = 0; i < extremumTs.length; i++) {
            extremumVs[i] = this.getValue(extremumTs[i]);
            // 增加单调区间
            monotoneIntervalTs.splice(i + 1, 0, extremumTs[i]);
            monotoneIntervalVs.splice(i + 2, 0, extremumVs[i]);
        }
        return { ts: monotoneIntervalTs, vs: monotoneIntervalVs };
    };
    /**
     * 获取目标值所在的插值度T
     *
     * @param targetV 目标值
     * @param precision  查找精度
     *
     * @returns 返回解数组
     */
    CubicBezierCurve.prototype.getTFromValue = function (targetV, precision) {
        if (precision === void 0) { precision = 0.0000001; }
        var monotoneIntervalTs = this.monotoneIntervalTs;
        var monotoneIntervalVs = this.monotoneIntervalVs;
        // 目标估计值列表
        var guessTs = [];
        // 遍历单调区间
        for (var i = 0, n = monotoneIntervalVs.length - 1; i < n; i++) {
            if ((monotoneIntervalVs[i] - targetV) * (monotoneIntervalVs[i + 1] - targetV) < 0) {
                guessTs.push((monotoneIntervalTs[i] + monotoneIntervalTs[i + 1]) / 2);
            }
        }
        var results = [];
        for (var i = 0, n = guessTs.length; i < n; i++) {
            var result = this.getTFromValueAtRange(targetV, guessTs[i], precision);
            results.push(result);
        }
        return results;
    };
    /**
     * 从存在解的区域进行查找目标值的插值度
     *
     * 该函数只能从单调区间内查找值，并且 targetV 处于该区间内
     *
     * @param targetV 目标值
     * @param guessT 预估目标T值，单调区间内的一个预估值
     * @param precision  查找精度
     *
     * @returns 目标值所在插值度
     */
    CubicBezierCurve.prototype.getTFromValueAtRange = function (targetV, guessT, precision) {
        if (guessT === void 0) { guessT = 0; }
        if (precision === void 0) { precision = 0.0000001; }
        var middleV = this.getValue(guessT);
        while (Math.abs(middleV - targetV) > precision) {
            // 使用斜率进行预估目标位置
            var slope = this.getDerivative(guessT);
            if (slope == 0)
                break;
            guessT += (targetV - middleV) / slope;
            middleV = this.getValue(guessT);
        }
        return guessT;
    };
    /**
     * 获取曲线样本数据
     *
     * 这些点可用于连线来拟合曲线。
     *
     * @param num 采样次数 ，采样点分别为[0,1/num,2/num,....,(num-1)/num,1]
     */
    CubicBezierCurve.prototype.getSamples = function (num) {
        if (num === void 0) { num = 100; }
        var results = [];
        for (var i = 0; i <= num; i++) {
            var p = this.getValue(i / num);
            results.push(p);
        }
        return results;
    };
    return CubicBezierCurve;
}());
function createCanvas(x, y, width, height) {
    if (x === void 0) { x = 0; }
    if (y === void 0) { y = 0; }
    if (width === void 0) { width = 100; }
    if (height === void 0) { height = 100; }
    var canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.left = x + "px";
    canvas.style.top = y + "px";
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    return canvas;
}
/**
 * 清理画布
 * @param canvas 画布
 */
function clearCanvas(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 绘制背景
    ctx.fillStyle = 'brack';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
/**
 * 绘制曲线
 * @param canvas 画布
 * @param points 曲线上的点
 * @param strokeStyle 曲线颜色
 */
function drawPointsCurve(canvas, points, strokeStyle, lineWidth) {
    if (strokeStyle === void 0) { strokeStyle = 'white'; }
    if (lineWidth === void 0) { lineWidth = 3; }
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(points[0][0], points[0][1]);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.stroke();
}
function drawBezierCurve(canvas, points, strokeStyle, lineWidth) {
    if (strokeStyle === void 0) { strokeStyle = 'white'; }
    if (lineWidth === void 0) { lineWidth = 3; }
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(points[0][0], points[0][1]);
    ctx.bezierCurveTo(points[1][0], points[1][1], points[2][0], points[2][1], points[3][0], points[3][1]);
    ctx.stroke();
}
var canvas = createCanvas(100, 100, 400, 300);
// var point0 = [Math.random(), Math.random()];
// var point1 = [Math.random(), Math.random()];
var point0 = [0.25, Math.random()];
var point1 = [0.75, Math.random()];
var xs = [0, point0[0], point1[0], 1];
var ys = [0, point0[1], point1[1], 1];
clearCanvas(canvas);
//
var bezierPoints = [[0, 0], point0, point1, [1, 1]];
bezierPoints = bezierPoints.map(function (item) { return [item[0] * canvas.width, (1 - item[1]) * canvas.height]; });
drawBezierCurve(canvas, bezierPoints, "red", 9);
//
var xSamples = bezierCurve.getSamples(xs);
var ySamples = bezierCurve.getSamples(ys);
var points2 = [];
for (var i = 0; i < xSamples.length; i++) {
    points2[i] = [xSamples[i] * canvas.width, (1 - ySamples[i]) * canvas.height];
}
drawPointsCurve(canvas, points2, "green", 3);
//# sourceMappingURL=bezier.js.map