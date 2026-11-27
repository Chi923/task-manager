const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const app = express();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

// 首页，改用fs读取，避开__dirname坑
app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  res.send(html);
});

// 获取任务（倒序）
app.get('/api/tasks', async (req, res) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  res.json({ data, error });
});

// 添加任务
app.post('/api/tasks', async (req, res) => {
  const { title, priority } = req.body;
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ title, priority }])
    .select();
  res.json({ data, error });
});

// 切换完成状态
app.patch('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const { data, error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', id)
    .select();
  res.json({ data, error });
});

// 删除任务
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  res.json({ error });
});

// 导出，不要listen
module.exports = app;
