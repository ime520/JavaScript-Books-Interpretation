书上的示例：

```JS
(function(){
    function draw(timestamp){
        // 计算两次重绘的时间间隔
        var drawStart = (timestamp || Date.now());
        // 使用diff确定下一次的绘制时间
        var diff = drawStart - startTime;
        // 把startTime重写为这一次的绘制时间
        startTime = drawStart;

        requestAnimationFrame(draw);

    }

    var requestAnimationFrame = window.requestAnimationFrame ||
                                window.mosRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame ||
                                window.msRequestAnimationFrame;

    var startTime = window.mosAnimationStartTime || Date.now();

    requestAnimationFrame(draw);

})();
```

- timstamp 传入回调函数的时间码
- mosAnimationStartTime 得到上一次重绘的时间码
- drawStart 当前重绘的时间：传入的 timestamp 或者 Date.now()
