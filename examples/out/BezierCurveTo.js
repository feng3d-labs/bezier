"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Common_1 = require("./common/Common");
var __1 = require("../..");
(function () {
    // 创建画布
    var canvas = (0, Common_1.createCanvas)(0, 60, window.innerWidth, window.innerHeight - 60);
    var button = document.getElementById('button');
    draw();
    button.onclick = function () {
        draw();
    };
    function draw() {
        (0, Common_1.clearCanvas)(canvas);
        // 随机生成4个点坐标
        var xs = [Math.random(), Math.random(), Math.random(), Math.random()].map(function (i) { return i * canvas.width; });
        var ys = [Math.random(), Math.random(), Math.random(), Math.random()].map(function (i) { return (1 - i) * canvas.height; });
        // 使用 canvas提供的 bezierCurveTo,CanvasRenderingContext2D.bezierCurveTo,CanvasPathMethods.bezierCurveTo 进行绘制曲线
        (0, Common_1.drawBezierCurve)(canvas, xs, ys, 'red', 15);
        // 使用 bezierCurve 进行采样曲线点
        var xSamples = __1.bezier.getSamples(xs);
        var ySamples = __1.bezier.getSamples(ys);
        (0, Common_1.drawPointsCurve)(canvas, xSamples, ySamples, 'green', 5);
    }
})();
//# sourceMappingURL=BezierCurveTo.js.map