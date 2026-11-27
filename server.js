const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('.'));

// 直接写在这里，不需要.env
const supabaseUrl = "https://prllhhmnirmnhmtojiob.supabase.co";
const supabaseKey = "sb_publishable_t9WG0KX63N99pqV7iRPZzw_Z3aa8uaz";
const supabase = createClient(supabaseUrl, supabaseKey);

// 获取任务列表，支持筛选
app.get('/api/tasks', async (req, res) => {
  const filter = req.query.filter || '全部';
  let query = supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  if (filter !== '全部') {
    query = query.eq('priority', filter);
  }
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 新增任务
app.post('/api/tasks', async (req, res) => {
  const { title, priority } = req.body;
  const { data, error } = await supabase.from('tasks').insert([{ title, priority }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// 修改完成状态
app.patch('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const { data, error } = await supabase.from('tasks').update({ completed }).eq('id', id).select();
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
  console.log(`✅ 服务启动：http://localhost:${port}`);
});
