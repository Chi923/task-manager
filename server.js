const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('.'));

// 优先读取Vercel环境变量，本地兜底
const supabaseUrl = process.env.SUPABASE_URL || "https://prllhhmnirmnhmtojiob.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "sb_publishable_t9WG0KX63N99pqV7iRPZzw_Z3aa8uaz";
const supabase = createClient(supabaseUrl, supabaseKey);

// 获取任务，支持优先级筛选，创建时间倒序
app.get('/api/tasks', async (req, res) => {
  const { filter } = req.query;
  let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (filter && filter !== '全部') {
    query = query.eq('priority', filter);
  }
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 添加任务
app.post('/api/tasks', async (req, res) => {
  const { title, priority } = req.body;
  if (!title || !priority) return res.status(400).json({ error: '任务标题和优先级不能为空' });
  const { data, error } = await supabase.from('tasks').insert([{ title, priority, is_done: false }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// 切换完成状态
app.patch('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { is_done } = req.body;
  const { data, error } = await supabase.from('tasks').update({ is_done }).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// 删除任务
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`服务启动：http://localhost:${port}`);
});
