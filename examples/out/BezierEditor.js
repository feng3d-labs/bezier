"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Common_1 = require("./common/Common");
var __1 = require("../..");
(function () {
    // 创建画布
    var canvas = (0, Common_1.createCanvas)(0, 60, window.innerWidth, window.innerHeight - 60);
    // window.addEventListener("click", onMouseClick)
    window.addEventListener('mousedown', onMouseDown);
    var xs = [Math.random() * canvas.width, Math.random() * canvas.width, Math.random() * canvas.width];
    var ys = [Math.random() * canvas.height, Math.random() * canvas.height, Math.random() * canvas.height];
    var editIndex = -1;
    var editing = false;
    var mousedownxy = { x: -1, y: -1 };
    function onMouseDown(ev) {
        var rect = canvas.getBoundingClientRect();
        if (!(rect.left < ev.clientX && ev.clientX < rect.right && rect.top < ev.clientY && ev.clientY < rect.bottom)) {
            return;
        }
        var x = ev.clientX - rect.left;
        var y = ev.clientY - rect.top;
        mousedownxy.x = x;
        mousedownxy.y = y;
        editIndex = findPoint(x, y);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }
    function onMouseMove(ev) {
        if (editIndex === -1) {
            return;
        }
        editing = true;
        var rect = canvas.getBoundingClientRect();
        if (!(rect.left < ev.clientX && ev.clientX < rect.right && rect.top < ev.clientY && ev.clientY < rect.bottom)) {
            return;
        }
        var x = ev.clientX - rect.left;
        var y = ev.clientY - rect.top;
        xs[editIndex] = x;
        ys[editIndex] = y;
    }
    function onMouseUp(ev) {
        if (editing) {
            editing = false;
            editIndex = -1;
            return;
        }
        var rect = canvas.getBoundingClientRect();
        if (!(rect.left < ev.clientX && ev.clientX < rect.right && rect.top < ev.clientY && ev.clientY < rect.bottom)) {
            return;
        }
        var x = ev.clientX - rect.left;
        var y = ev.clientY - rect.top;
        if (Math.abs(mousedownxy.x - x) > 5 || Math.abs(mousedownxy.y - y) > 5) {
            // 有移动鼠标，无效点击
            return;
        }
        var index = findPoint(x, y);
        if (index !== -1) {
            deletePoint(index);
        }
        else {
            addPoint(x, y);
        }
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }
    function findPoint(x, y) {
        for (var i = 0; i < xs.length; i++) {
            if (Math.abs(xs[i] - x) < 5 && Math.abs(ys[i] - y) < 20) {
                return i;
            }
        }
        return -1;
    }
    function deletePoint(index) {
        xs.splice(index, 1);
        ys.splice(index, 1);
    }
    function addPoint(x, y) {
        xs.push(x);
        ys.push(y);
    }
    requestAnimationFrame(draw);
    function draw() {
        (0, Common_1.clearCanvas)(canvas);
        if (xs.length > 0) {
            // 使用 bezierCurve 进行采样曲线点
            var xSamples = __1.bezier.getSamples(xs);
            var ySamples = __1.bezier.getSamples(ys);
            // 绘制曲线
            (0, Common_1.drawPointsCurve)(canvas, xSamples, ySamples, 'white', 3);
            // 绘制起点
            (0, Common_1.drawPoints)(canvas, xs.slice(0, 1), ys.slice(0, 1), 'red', 16);
            // 绘制控制点
            if (xs.length > 2) {
                (0, Common_1.drawPoints)(canvas, xs.slice(1, xs.length - 1), ys.slice(1, ys.length - 1), 'blue', 16);
            }
            // 绘制终点
            if (xs.length > 1) {
                (0, Common_1.drawPoints)(canvas, xs.slice(xs.length - 1, xs.length), ys.slice(ys.length - 1, ys.length), 'green', 16);
            }
            // 绘制控制点之间的连线
            if (xs.length > 2) {
                (0, Common_1.drawPointsCurve)(canvas, xs, ys, 'yellow', 1);
            }
        }
        //
        requestAnimationFrame(draw);
    }
})();
//# sourceMappingURL=BezierEditor.js.map