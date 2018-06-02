QUnit.module("BezierCurve", () =>
{
    // 允许误差
    var deviation = 0.0000001;

    QUnit.test("bn linear", (assert) =>
    {

        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random()];
        var v0 = bezierCurve.linear(t, ps[0], ps[1]);
        var v1 = bezierCurve.bn(t, ps);
        assert.ok(Math.abs(v0 - v1) < deviation);

        // 导数
        var d0 = bezierCurve.linearDerivative(t, ps[0], ps[1]);
        var d1 = bezierCurve.bnD(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });

    QUnit.test("bn quadratic", (assert) =>
    {

        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random()];
        var v0 = bezierCurve.quadratic(t, ps[0], ps[1], ps[2]);
        var v1 = bezierCurve.bn(t, ps);
        assert.ok(Math.abs(v0 - v1) < deviation);

        // 导数
        var d0 = bezierCurve.quadraticDerivative(t, ps[0], ps[1], ps[2]);
        var d1 = bezierCurve.bnD(t, ps);
        assert.ok(Math.abs(d0 - d1) < deviation);
    });

    QUnit.test("bn cubic", (assert) =>
    {
        // 测试线性Bézier曲线
        var t = Math.random();
        var ps = [Math.random(), Math.random(), Math.random(), Math.random()];
        var v0 = bezierCurve.cubic(t, ps[0], ps[1], ps[2], ps[3]);
        var v1 = bezierCurve.bn(t, ps);


        assert.ok(Math.abs(v0 - v1) < deviation);

        var v2 = bezierCurve.curve2(t, ps);
        assert.ok(Math.abs(v0 - v2) < deviation);
    });


});