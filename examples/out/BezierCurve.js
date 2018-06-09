(function () {
    // 创建画布
    var canvas = createCanvas(0, 60, window.innerWidth, window.innerHeight - 60);
    var button = document.getElementById("button");
    draw();
    button.onclick = function () {
        draw();
    };
    function draw() {
        clearCanvas(canvas);
        // 随机生成4个点坐标
        var ys = [Math.random(), Math.random(), Math.random(), Math.random()].map(function (i) { return (1 - i) * canvas.height; });
        // 使用 bezierCurve 进行采样曲线点
        var ySamples = bezier.getSamples(ys);
        var xSamples = [];
        for (var i = 0, n = ySamples.length - 1; i <= n; i++) {
            xSamples[i] = canvas.width * i / n;
        }
        drawPointsCurve(canvas, xSamples, ySamples, "green", 5);
        drawPoints(canvas, xSamples, ySamples);
    }
})();
//# sourceMappingURL=BezierCurve.js.map