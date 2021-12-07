"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../..");
var Common_1 = require("./common/Common");
(function () {
    var input = document.getElementById('input');
    var button = document.getElementById('button');
    var stopBtn = document.getElementById('stopBtn');
    // 创建画布
    var canvas = (0, Common_1.createCanvas)(0, 60, window.innerWidth, window.innerHeight - 60);
    input.value = "" + 64;
    var requestid;
    var isStop = false;
    draw();
    button.onclick = function () {
        if (requestid) {
            cancelAnimationFrame(requestid);
        }
        draw();
    };
    stopBtn.onclick = function () {
        isStop = !isStop;
        if (isStop) {
            stopBtn.value = '播放';
        }
        else {
            stopBtn.value = '停止';
        }
    };
    function draw() {
        var numPoints = Number(input.value) + 1;
        if (isNaN(numPoints)) {
            numPoints = 2;
        }
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
            var x = __1.bezier.bn(i / num, xs, processsx);
            var y = __1.bezier.bn(i / num, ys, processsy);
            animations[i] = { x: x, y: y, processsx: processsx, processsy: processsy };
        }
        var t = 0;
        var dir = 1;
        requestid = requestAnimationFrame(animation);
        requestAnimationFrame;
        var usecolors = (0, Common_1.getColors)(xs.length);
        function animation() {
            //
            if (!isStop) {
                t += dir;
            }
            if (t > 100) {
                t = 100;
                dir = -1;
            }
            else if (t < 0) {
                t = 0;
                dir = 1;
            }
            (0, Common_1.clearCanvas)(canvas);
            // 绘制插值过程
            var processsx = animations[t].processsx;
            var processsy = animations[t].processsy;
            for (var i = 0; i < processsx.length; i++) {
                (0, Common_1.drawPointsCurve)(canvas, processsx[i], processsy[i], usecolors[i], 1);
            }
            requestid = requestAnimationFrame(animation);
            // 绘制整条曲线
            var xSamples = animations.map(function (i) { return i.x; });
            var ySamples = animations.map(function (i) { return i.y; });
            (0, Common_1.drawPointsCurve)(canvas, xSamples, ySamples, 'green', 5);
            // 绘制曲线动画
            var txs = animations.map(function (i) { return i.x; }).splice(0, t);
            var tys = animations.map(function (i) { return i.y; }).splice(0, t);
            (0, Common_1.drawPointsCurve)(canvas, txs, tys, 'red', 3);
        }
    }
})();
//# sourceMappingURL=BezierCurveAnimation.js.map