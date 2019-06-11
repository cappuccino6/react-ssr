# REACT-SSR

react 服务端渲染框架，客户端服务端同构

## 安装

```html
npm i
```

## 开发模式

```html
npm run build

npm run dev
```

访问 http://localhost:8987/ (ssr)
    http://localhost:8988/ (scr)

该项目启用了 server hot reload。
在 server 端代码出现编译错误时，server 会陷入一种 fail 状态，改正错误后可能需要在 dev 窗口按 `rs<enter>` 重启 server 以恢复。

## 生产模式

同开发模式

## TODO

接入 Context Api
