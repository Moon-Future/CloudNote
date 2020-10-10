---
title: vue + koa2 实现 session、token 登陆状态验证
date: 2019-08-24 01:30
tags: [vue, koa, session, token]
---

# Session 登陆与 Token 登陆的区别
1、Session 登陆是在服务器端生成用户相关 session 数据，发给客户端 session_id 存放到 cookie 中，这样在客户端请求时带上 session_id 就可以验证服务器端是否存在 session 数据，以此完成用户认证。这种认证方式，可以更好的在服务端对会话进行控制，安全性比较高(session_id 随机），但是服务端需要存储 session 数据(如内存或数据库），这样无疑增加维护成本和减弱可扩展性(多台服务器)。 CSRF 攻击一般基于 cookie。另外，如果是原生 app 使用这种服务接口，因为没有浏览器 cookie 功能，所以接入会相对麻烦。  
2、基于 token 的用户认证是一种服务端无状态的认证方式，服务端不用存放 token 数据。用户验证后,服务端生成一个 token(hash 或 encrypt)发给客户端，客户端可以放到 cookie 或 localStorage 中，每次请求时在 Header 中带上 token，服务端收到 token，通过验证后即可确认用户身份。这种方式相对 cookie 的认证方式就简单一些，服务端不用存储认证数据，易维护扩展性强，token 存在 localStorage 可避免 CSRF，web 和 app 应用都比较简单。不过这种方式在加密或解密的时候会有一些性能开销(好像也不是很大)，有些对称加密存在安全隐患(aes cbc 字节翻转攻击)。

# koa + session 登陆验证
## 1、首先要安装 koa-sisson 包  
```cmd
npm install koa-session -S
```
koa-session 实际上是通过 cookie 来保存信息的。koa-session 在服务器上生成一个信息，通过加密后，以 cookie 的形式发送到用户的浏览器，在用户浏览器上可以看到是一个加密的 cookie 字段，然后在服务端路由中通过 ctx.session.xx 来获取 xx 这个信息。而当每次当用户发送请求时候，就可以获取到这个 cookie，koa-sesscion 会内部会帮我们解密为最初的存储的信息，于是我们可以通过判断这个 cookie 是存在来校验用户是否已经登录了。  
## 2、app.js 中初始化  
```js
const Koa = require('koa')
const app = new Koa()
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const router = new Router()

const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) cookie 的Name */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000, /** cookie 的过期时间 */
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
}
app.keys = ['login secret'] // 加密密钥
app.use(session(CONFIG, app));

app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())
```
## 3、登陆路由  
```js
router.post('/login', async (ctx) => {
  try {
    const data = ctx.request.body.data
    const { username, password } = data
    if (true) {
      // 保存登录状态，这句代码会在浏览器中生成一个以 "koa:sess" 为 Name 的 cookie
      ctx.session.userInfo = {username: '', userID: ''}
      ctx.body = {code: 1, message: '登陆成功'}
    } else {
      ctx.body = {code: 0, message: '账号或密码错误'}
    }
  } catch(err) {
    throw new Error(err)
  }
})

// 前端
axios.post('/login', {username: '', password: ''}).then(res => {})
```
## 4、校验是否已登陆
```js
router.get('/getSession', async (ctx) => {
  try {
    if (ctx.session.userInfo) {
      ctx.body = {code: 1, message: '已登陆'}
    } else {
      ctx.body = {code: 0, message: '未登陆'}
      // 跳转到登录页
      // ctx.response.redirect('/login') 
    }
  } catch(err) {
    throw new Error(err)
  }
})

// 前端
axios.get('/getSession').then(res => {})
```
## 5、退出登陆
```js
router.post('/logout', async (ctx) => {
  try {
    // 将登录信息清空
    ctx.session = null
    // 跳转到登录页或网站首页
    ctx.response.redirect('/')
  } catch(err) {
    throw new Error(err)
  }
})

// 前端
axios.post('/logout').then(res => {})
```

# koa + token 登陆验证
## 1、安装 jsonwebtoken 包
```cmd
npm install jsonwebtoken -S
```
## 2、app.js 初始化
```js
const Koa = require('koa')
const app = new Koa()
const jwt = require('jsonwebtoken')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const router = new Router()
const tokenConfig = {privateKey: 'xxxxxxxxxxxx'} // 加密密钥

app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())
```
## 3、登陆路由
```js
router.post('/login', async (ctx) => {
  try {
    const data = ctx.request.body.data
    const { username, password } = data
    if (true) {
      const userInfo = {username: '', userID: ''}
      const token = jwt.sign(userInfo, tokenConfig.privateKey, {expiresIn: '7d'}) // 签发 token， 7天有效期
      ctx.body = {code: 1, message: '登陆成功', data: {token: 'Bearer ' + token}}
    } else {
      ctx.body = {code: 0, message: '账号或密码错误'}
    }
  } catch(err) {
    throw new Error(err)
  }
})
```
前端登陆  
```js
axios.post('/login', {username: '', password: ''}).then(res => {
  if (res.data.code === 1) {
    localStorage.setItem('token', res.data.data.token)
    // vuex 存储 userInfo 和登陆状态
    store.commit('SET_USERINFO', {userInfo: res.data.data.userInfo, status: true})
  }
})
```
## 4、校验是否已登陆
```js
router.get('/getUserInfo', async (ctx) => {
  try {
    const token = ctx.get('Authorization') // 获取请求 Header 中 Authorization 值
    let userInfo = {}
    if (token === '') {
      ctx.body = {code: 0, message: '未登陆'}
    } else {
      try {
        userInfo = jwt.verify(token.split(' ')[1], tokenConfig.privateKey) // 验证 token
        ctx.body = {code: 1, message: '已登陆', data: {userInfo: userInfo: loginStatus: true}}
      } catch(err) {
        // token 过期或无效
        ctx.body = {code: 0, message: '未登陆', data: {userInfo: {}: loginStatus: false}}}
      }
    }
  } catch(err) {
    throw new Error(err)
  }
})
```
要每次的请求中都带上 token 信息，要给 axios 设置请求拦截
```js
// 请求拦截，在每次请求中的 header 中带上 token
axios.interceptors.request.use(config => {
  let token = localStorage.getItem('token')
  if (token) {
    config.headers.common.Authorization = token
  }
  return config
}, error => {
  return Promise.reject(error);
})
```
每次进入页面之前要判断下是否已登陆，是否有权限进入该页面，之前我是在每个页面的 created 钩子函数中去请求 '/getUserInfo' 判断是否以登陆，这样做繁琐，并且页面会先呈现一下，然后一闪而过（验证不过的情况下），在路由钩子函数中可全局配置
```js
// 路由守卫， 在跳转之前执行
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  let requireAuth = to.meta.requireAuth // VueRouter 里配置页面是否需要登陆进入
  let root = to.meta.root // VueRouter 里配置页面是否需要登陆且管理员权限进入
  if (!token) {
    // vuex 清除 userInfo 和登陆状态
    store.commit('SET_USERINFO', {userInfo: {}, status: false})
    requireAuth ? next({path: '/'}) : next()
  } else {
    axios.get(API.getUserInfo).then(res => {
      // vuex 存储 userInfo 和登陆状态
      store.commit('SET_USERINFO', {userInfo: res.data.userInfo, status: res.data.loginStatus})
      if (requireAuth) {
        if (!res.data.loginStatus || (root && !res.data.userInfo.root)) {
          next({path: '/'})
        } else {
          next()
        }
      } else {
        next()
      }
    })
  }
})

/** VueRouter
{
  path: '/admin',
  name: 'admin',
  meta: {
    requireAuth: true,
    root: true
  },
}
*/
```
## 5、退出登陆
因为服务器端并没有存储用户登陆相关信息，只与前端是否存在 token 或是否能验证通过有关，所以退出登陆就将 token 清除即可
```js
methods: {
  logout() {
    localStorage.removeItem('token')
    // vuex 清除登陆信息
    store.commit('SET_USERINFO', {userInfo: {}, status: false})
    if (this.$route.path !== '/') {
      this.$router.push({path: '/'})
    }
  }
}
```
