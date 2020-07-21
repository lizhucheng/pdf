## 这是一个用户尝试pdf相关工具的项目。

## 环境准备
1. 安装java环境：根据官网安装说明安装java jdk, 并设置java 环境变量 JAVA_HOME 指向jdk所在目录， 并添加java jdk bin 目录到path, 方便执行java程序。(pdf 文件操作工具会使用 pdfbox 基于java；具体例子代码可以参考 mergepdf.bat 里面的脚本)
注释：pdfbox-app-2.0.20.jar 就是pdfbox的jar包

2. 安装node， 安装 npm; （会使用pdf 相关的 npm包）

3. 安装http-server, 方便启动本地服务器。具体使用方式可以安装后 http-server.cmd -? 查看文档； 可通过 npm i -g http-server 命令安装。

4. npm i 安装依赖的npm包。（主要依赖 puppeteer 渲染页面并导出对应的pdf文件， 可以参考 src/test1.js）

5. 去掉生成的pdf中带的白色背景；（目前使用的浏览器端的包，使用不方便，看找找有没有服务端的工具）



