/**
 * 细分精度
 */
var SUBDIVISION_PRECISION = 0.0000001;
/**
 * 细分最大迭代次数
 */
var SUBDIVISION_MAX_ITERATIONS = 10;
var bezierCurve;
/**
 * 贝塞尔曲线
 * @see https://en.wikipedia.org/wiki/B%C3%A9zier_curve
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
     * 贝塞尔曲线可以定义为任意度n。
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
     * 贝塞尔曲线可以定义为任意度n。
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
     * 贝塞尔曲线可以定义为任意度n。
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
     * 贝塞尔曲线可以定义为任意度n。
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
        // if (ps.length == 2)
        // {
        //     return this.linear(t, ps[0], ps[1]);
        // }
        // if (ps.length == 3)
        // {
        //     return this.quadratic(t, ps[0], ps[1], ps[2]);
        // }
        // if (ps.length == 4)
        // {
        //     return this.cubic(t, ps[0], ps[1], ps[2], ps[3]);
        // }
        // return this.bn(t, ps);
        var t1 = 1 - t;
        return t1 * t1 * t1 * ps[0] + 3 * t1 * t1 * t * ps[1] + 3 * t1 * t * t * ps[2] + t * t * t * ps[3];
    };
    /**
     * 获取曲线在指定插值度上的斜率
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
     * 获取目标值所在的插值度T，该方法只适用于在连续递增
     *
     * @param targetV 目标值
     * @param ps 点列表
     * @param startT 起始插值点
     * @param endT 终止插值点
     * @param numSamples 分段数量，用于分段查找，用于解决寻找多个解、是否无解等问题；过少的分段可能会造成找不到存在的解决，过多的分段将会造成性能很差。
     * @returns 返回解数组
     */
    BezierCurve.prototype.getTFromValue = function (targetV, ps, numSamples) {
        if (numSamples === void 0) { numSamples = 10; }
        var samples = this.getSamples(ps, numSamples);
        // 查找存在解的分段
        var resultRanges = [];
        for (var i = 0, n = numSamples; i < n; i++) {
            if ((samples[i] - targetV) * (samples[i + 1] - targetV) < 0) {
                resultRanges.push([i / numSamples, (i + 1) / numSamples, samples[i], samples[i + 1]]);
            }
        }
        var results = [];
        for (var i = 0, n = resultRanges.length; i < n; i++) {
            var result = this.getTFromValueAtRange(targetV, ps, (resultRanges[i][0] + resultRanges[i][1]) / 2);
            results.push(result);
        }
        return results;
    };
    /**
     * 从存在解的区域进行插值值
     * @param targetV 目标值
     * @param ps 点列表
     * @param guessT 预估目标T值
     * @param maxIterations 最大迭代次数
     */
    BezierCurve.prototype.getTFromValueAtRange = function (targetV, ps, guessT, maxIterations) {
        if (guessT === void 0) { guessT = 0; }
        if (maxIterations === void 0) { maxIterations = 4; }
        var middleV = this.getValue(guessT, ps);
        // console.assert((x0 - targetX) * (x1 - targetX) < 0, `targetX 必须在 起点终点之间！`);
        var i = 0;
        while (Math.abs(middleV - targetV) > SUBDIVISION_PRECISION && i++ < maxIterations) {
            // 使用斜率进行预估目标位置
            var slope = this.getDerivative(guessT, ps);
            if (slope == 0)
                break;
            // var slope = this.cubicDerivative(guessT, ps[0], ps[1], ps[2], ps[3]);
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
QUnit.module("BezierCurve", function () {
    // 允许误差
    var deviation = 0.0000001;
    QUnit.test("bn linear", function (assert) {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        var v0 = bezierCurve.linear(t, ps[0], ps[1]);
        var v1 = bezierCurve.bn(t, ps);
        assert.ok(Math.abs(v0 - v1) < deviation);
    });
    QUnit.test("bn quadratic", function (assert) {
        // 二次Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        var v0 = bezierCurve.quadratic(t, ps[0], ps[1], ps[2]);
        var v1 = bezierCurve.bn(t, ps);
        assert.ok(Math.abs(v0 - v1) < deviation);
    });
    QUnit.test("bn cubic", function (assert) {
        // 立方Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        var v0 = bezierCurve.cubic(t, ps[0], ps[1], ps[2], ps[3]);
        var v1 = bezierCurve.bn(t, ps);
        assert.ok(Math.abs(v0 - v1) < deviation);
        var v2 = bezierCurve.getValue(t, ps);
        assert.ok(Math.abs(v0 - v2) < deviation);
    });
    QUnit.test("bnD linearDerivative", function (assert) {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.linearDerivative(t, ps[0], ps[1]);
        var d1 = bezierCurve.bnDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnD quadraticDerivative", function (assert) {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.quadraticDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezierCurve.bnDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnD cubicDerivative", function (assert) {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.cubicDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezierCurve.bnDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnSD linearSecondDerivative", function (assert) {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.linearSecondDerivative(t, ps[0], ps[1]);
        var d1 = bezierCurve.bnSecondDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnSD quadraticSecondDerivative", function (assert) {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.quadraticSecondDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezierCurve.bnSecondDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnSD cubicSecondDerivative", function (assert) {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.cubicSecondDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezierCurve.bnSecondDerivative(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND linearDerivative", function (assert) {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.linearDerivative(t, ps[0], ps[1]);
        var d1 = bezierCurve.bnND(t, 1, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND quadraticDerivative", function (assert) {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.quadraticDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezierCurve.bnND(t, 1, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND cubicDerivative", function (assert) {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.cubicDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezierCurve.bnND(t, 1, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND linearSecondDerivative", function (assert) {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.linearSecondDerivative(t, ps[0], ps[1]);
        var d1 = bezierCurve.bnND(t, 2, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND quadraticSecondDerivative", function (assert) {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.quadraticSecondDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezierCurve.bnND(t, 2, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
    QUnit.test("bnND cubicSecondDerivative", function (assert) {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        // 导数
        var d0 = bezierCurve.cubicSecondDerivative(t, ps[0], ps[1], ps[2], ps[3]);
        var d1 = bezierCurve.bnND(t, 2, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });
});
//# sourceMappingURL=tests.js.map