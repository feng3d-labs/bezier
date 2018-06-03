(function () {
    var input = document.getElementById("input");
    var button = document.getElementById("button");
    // 创建画布
    var canvas = createCanvas(0, 60, window.innerWidth, window.innerHeight - 60);
    input.value = "" + 200;
    var requestid;
    draw();
    button.onclick = function () {
        if (requestid)
            cancelAnimationFrame(requestid);
        draw();
    };
    function draw() {
        var numPoints = Number(input.value) + 1;
        if (isNaN(numPoints))
            numPoints = 2;
        numPoints = Math.max(1, Math.min(500, numPoints));
        var xs = [];
        var ys = [];
        for (var i = 0; i < numPoints; i++) {
            xs[i] = Math.random();
            ys[i] = Math.random();
        }
        // 映射到画布坐标
        xs = xs.map(function (i) { return i * canvas.width; });
        ys = ys.map(function (i) { return (1 - i) * canvas.height; });
        var animations = [];
        // 收集动画数据
        var num = 100;
        for (var i = 0; i <= num; i++) {
            var processsx = [];
            var processsy = [];
            var x = bezier.bn(i / num, xs, processsx);
            var y = bezier.bn(i / num, ys, processsy);
            animations[i] = { x: x, y: y, processsx: processsx, processsy: processsy };
        }
        var t = 0;
        requestid = requestAnimationFrame(animation);
        requestAnimationFrame;
        var usecolors = getColors(xs.length);
        function animation() {
            clearCanvas(canvas);
            // 绘制整条曲线
            var xSamples = animations.map(function (i) { return i.x; });
            var ySamples = animations.map(function (i) { return i.y; });
            drawPointsCurve(canvas, xSamples, ySamples, "green", 5);
            // 绘制曲线动画
            var txs = animations.map(function (i) { return i.x; }).splice(0, t);
            var tys = animations.map(function (i) { return i.y; }).splice(0, t);
            drawPointsCurve(canvas, txs, tys, "red", 3);
            // 绘制插值过程
            var processsx = animations[t].processsx;
            var processsy = animations[t].processsy;
            for (var i = 0; i < processsx.length; i++) {
                drawPointsCurve(canvas, processsx[i], processsy[i], usecolors[i], 1);
            }
            //
            t = (t + 1) % (num + 1);
            requestid = requestAnimationFrame(animation);
        }
    }
})();
//# sourceMappingURL=BezierCurveAnimation.js.map