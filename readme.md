### JS原生日期组件构建

这是ES5写的一个日期‘显示/选择’模块，采用数据和视图分离模式，在CSS上面较好的遵循了Material Design设计要求。

>因为本模块使用了HTMML5中一些新的API，没做低版本兼容处理，请使用较新版本的浏览器打开。

.static 目录 静态HTML文本构建

.datemodule 模块主目录

[在线演示](https://jacecao.github.io/js-date-module/)


* #### render-v1

在render-v1文件中主要重新调整了日期更新后渲染方式，尽可能减少不必要的HTML结构渲染，相比v0文件做了一些优化。

由于在Safari浏览器中对于伪类元素在触发事件处理机制上的一些问题，对点击动画都采用JS添加类的方式来触发，这样以达到效果的统一，为此在CSS文件中也做了相应的改变。
在使用v0这个文件时，需要将CSS文件中注释掉的代码释放出来。
