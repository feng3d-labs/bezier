"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Common_1 = require("./common/Common");
var TimeLineCubicBezierSequence_1 = require("./common/TimeLineCubicBezierSequence");
(function () {
    // 基于时间的连续三阶Bézier曲线编辑，意味着一个x对应唯一的y
    // 创建画布
    var canvas = (0, Common_1.createCanvas)(0, 60, window.innerWidth, window.innerHeight - 60);
    var canvaswidth = canvas.width;
    var canvasheight = canvas.height;
    // window.addEventListener("click", onMouseClick)
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('dblclick', ondblclick);
    var timeline = new TimeLineCubicBezierSequence_1.TimeLineCubicBezierSequence();
    /**
     * 点绘制尺寸
     */
    var pointSize = 16;
    /**
     * 控制柄长度
     */
    var controllerLength = 100;
    //
    timeline.addKey({ t: Math.random(), y: Math.random(), tan: 0 });
    var editKey;
    var controlkey;
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
        editKey = timeline.findKey(x / canvaswidth, y / canvasheight, pointSize / canvasheight / 2);
        if (editKey === null) {
            controlkey = findControlPoint(x, y);
        }
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }
    function onMouseMove(ev) {
        if (editKey === null && controlkey === null) {
            return;
        }
        editing = true;
        var rect = canvas.getBoundingClientRect();
        if (!(rect.left < ev.clientX && ev.clientX < rect.right && rect.top < ev.clientY && ev.clientY < rect.bottom)) {
            return;
        }
        var x = ev.clientX - rect.left;
        var y = ev.clientY - rect.top;
        if (editKey) {
            editKey.t = x / canvaswidth;
            editKey.y = y / canvasheight;
            timeline.sort();
        }
        else if (controlkey) {
            var index = timeline.indexOfKeys(controlkey);
            if (index === 0 && x / canvaswidth < controlkey.t) {
                controlkey.tan = y / canvasheight > controlkey.y ? Infinity : -Infinity;
                return;
            }
            if (index === timeline.numKeys - 1 && x / canvaswidth > controlkey.t) {
                controlkey.tan = y / canvasheight > controlkey.y ? -Infinity : Infinity;
                return;
            }
            controlkey.tan = (y / canvasheight - controlkey.y) / (x / canvaswidth - controlkey.t);
        }
    }
    function onMouseUp(_ev) {
        editing = false;
        editKey = null;
        controlkey = null;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }
    function findControlPoint(x, y) {
        for (var i = 0; i < timeline.numKeys; i++) {
            var key = timeline.getKey(i);
            var currentx = key.t * canvaswidth;
            var currenty = key.y * canvasheight;
            var currenttan = key.tan * canvasheight / canvaswidth;
            var lcp = { x: currentx - controllerLength * Math.cos(Math.atan(currenttan)), y: currenty - controllerLength * Math.sin(Math.atan(currenttan)) };
            if (Math.abs(lcp.x - x) < pointSize / 2 && Math.abs(lcp.y - y) < pointSize / 2) {
                return key;
            }
            var rcp = { x: currentx + controllerLength * Math.cos(Math.atan(currenttan)), y: currenty + controllerLength * Math.sin(Math.atan(currenttan)) };
            if (Math.abs(rcp.x - x) < pointSize / 2 && Math.abs(rcp.y - y) < pointSize / 2) {
                return key;
            }
        }
        return null;
    }
    function ondblclick(ev) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        editing = false;
        editKey = null;
        controlkey = null;
        var rect = canvas.getBoundingClientRect();
        if (!(rect.left < ev.clientX && ev.clientX < rect.right && rect.top < ev.clientY && ev.clientY < rect.bottom)) {
            return;
        }
        var x = ev.clientX - rect.left;
        var y = ev.clientY - rect.top;
        var selectedKey = timeline.findKey(x / canvaswidth, y / canvasheight, pointSize / canvasheight / 2);
        if (selectedKey !== null) {
            timeline.deleteKey(selectedKey);
        }
        else {
            // 没有选中关键与控制点时，检查是否点击到曲线
            timeline.addKeyAtCurve(x / canvaswidth, y / canvasheight, pointSize / canvasheight / 2);
        }
    }
    requestAnimationFrame(draw);
    function draw() {
        (0, Common_1.clearCanvas)(canvas);
        if (timeline.numKeys > 0) {
            var sameples_1 = timeline.getSamples(canvaswidth);
            var xSamples = sameples_1.map(function (value, i) { return canvaswidth * i / (sameples_1.length - 1); });
            var ySamples = sameples_1.map(function (value) { return canvasheight * value; });
            // 绘制曲线
            (0, Common_1.drawPointsCurve)(canvas, xSamples, ySamples, 'white', 3);
        }
        for (var i = 0, n = timeline.numKeys; i < n; i++) {
            var key = timeline.getKey(i);
            var currentx = key.t * canvaswidth;
            var currenty = key.y * canvasheight;
            var currenttan = key.tan * canvasheight / canvaswidth;
            // 绘制曲线端点
            (0, Common_1.drawPoints)(canvas, [currentx], [currenty], 'red', pointSize);
            // 绘制控制点
            if (i > 0) {
                // 左边控制点
                var lcp = { x: currentx - controllerLength * Math.cos(Math.atan(currenttan)), y: currenty - controllerLength * Math.sin(Math.atan(currenttan)) };
                (0, Common_1.drawPoints)(canvas, [lcp.x], [lcp.y], 'blue', pointSize);
            }
            if (i < n - 1) {
                var rcp = { x: currentx + controllerLength * Math.cos(Math.atan(currenttan)), y: currenty + controllerLength * Math.sin(Math.atan(currenttan)) };
                (0, Common_1.drawPoints)(canvas, [rcp.x], [rcp.y], 'blue', pointSize);
            }
            // 绘制控制点
            if (i > 0) {
                // 左边控制点
                var lcp = { x: currentx - controllerLength * Math.cos(Math.atan(currenttan)), y: currenty - controllerLength * Math.sin(Math.atan(currenttan)) };
                (0, Common_1.drawPointsCurve)(canvas, [currentx, lcp.x], [currenty, lcp.y], 'yellow', 1);
            }
            if (i < n - 1) {
                var rcp = { x: currentx + controllerLength * Math.cos(Math.atan(currenttan)), y: currenty + controllerLength * Math.sin(Math.atan(currenttan)) };
                (0, Common_1.drawPointsCurve)(canvas, [currentx, rcp.x], [currenty, rcp.y], 'yellow', 1);
            }
        }
        //
        requestAnimationFrame(draw);
    }
})();
//# sourceMappingURL=TimeLineCubicBezierSequenceEditor.js.map