export interface TimeLineCubicBezierKey {
    /**
     * 时间轴的位置 [0,1]
     */
    t: number;
    /**
     * 值 [0,1]
     */
    y: number;
    /**
     * 斜率
     */
    tan: number;
}
/**
 * 基于时间轴的连续三阶Bézier曲线
 *
 * @author feng / http://feng3d.com 10/06/2018
 */
export declare class TimeLineCubicBezierSequence {
    /**
     * 最大tan值，超出该值后将会变成分段
     */
    maxtan: number;
    private keys;
    /**
     * 关键点数量
     */
    get numKeys(): number;
    /**
     * 添加关键点
     *
     * 添加关键点后将会执行按t进行排序
     *
     * @param key 关键点
     */
    addKey(key: TimeLineCubicBezierKey): void;
    /**
     * 关键点排序
     *
     * 当移动关键点或者新增关键点时需要再次排序
     */
    sort(): void;
    /**
     * 删除关键点
     * @param key 关键点
     */
    deleteKey(key: TimeLineCubicBezierKey): void;
    /**
     * 获取关键点
     * @param index 索引
     */
    getKey(index: number): TimeLineCubicBezierKey;
    /**
     * 获取关键点索引
     * @param key 关键点
     */
    indexOfKeys(key: TimeLineCubicBezierKey): number;
    /**
     * 获取曲线上点信息
     * @param t 时间轴的位置 [0,1]
     */
    getPoint(t: number): {
        t: number;
        y: number;
        tan: number;
    };
    /**
     * 获取值
     * @param t 时间轴的位置 [0,1]
     */
    getValue(t: number): number;
    /**
     * 查找关键点
     * @param t 时间轴的位置 [0,1]
     * @param y 值
     * @param precision 查找精度
     */
    findKey(t: number, y: number, precision: number): TimeLineCubicBezierKey;
    /**
     * 添加曲线上的关键点
     *
     * 如果该点在曲线上，则添加关键点
     *
     * @param t 时间轴的位置 [0,1]
     * @param y y坐标
     * @param precision 查找进度
     */
    addKeyAtCurve(t: number, y: number, precision: number): {
        t: number;
        y: number;
        tan: number;
    };
    /**
     * 获取曲线样本数据
     *
     * 这些点可用于连线来拟合曲线。
     *
     * @param num 采样次数 ，采样点分别为[0,1/num,2/num,....,(num-1)/num,1]
     */
    getSamples(num?: number): number[];
}
