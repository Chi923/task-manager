const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const path = require('path')
const app = express()

// 解析json
app.use(express.json())

// 静态资源
app.use(express.static(path.join(__dirname)))

// 根路由返回页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// 初始化supabase
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('缺少Supabase环境变量！')
}
const supabase = createClient(supabaseUrl, supabaseKey)

// 👉 这里放你自己的业务接口（增删改查）

// 不要写 app.listen！！Vercel @vercel/node 不需要监听端口
module.exports = app
