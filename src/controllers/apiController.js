const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../../data/data.json');
const dataDir = path.dirname(dataPath);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory:', dataDir);
}
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
  console.log('Created data file:', dataPath);
}

const loadData = () => {
  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Failed to read/parse data.json:', err);

    return [];
  }
};

const saveData = (data) => {
  try {

    const tmpPath = dataPath + '.tmp';
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
    fs.renameSync(tmpPath, dataPath);
  } catch (err) {
    console.error('Failed to write data.json:', err);
    throw err;
  }
};

exports.getTodos = (req, res) => {
  try {
    const todos = loadData();
    return res.json(todos);
  } catch (err) {
    console.error('getTodos error:', err);
    return res.status(500).json({ error: 'Failed to load todos' });
  }
};

exports.addTodo = (req, res) => {
  try {
    const text = (req.body && req.body.text) ? String(req.body.text).trim() : '';
    if (!text) {
      return res.status(302).redirect('/form.html?error=empty');
    }

    const todos = loadData();
    const newTodo = {
      id: Date.now(),
      text,
      completed: false
    };
    todos.push(newTodo);
    saveData(todos);
    return res.status(302).redirect('/todos.html');
  } catch (err) {
    console.error('addTodo error:', err);
    return res.status(500).send('Internal Server Error');
  }
};

exports.toggleTodo = (req, res) => {
  try {
    const todos = loadData();
    const id = parseInt(req.params.id, 10);
    const todo = todos.find(t => t.id === id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    todo.completed = !todo.completed;
    saveData(todos);
    return res.json({ success: true });
  } catch (err) {
    console.error('toggleTodo error:', err);
    return res.status(500).json({ error: 'Failed to toggle todo' });
  }
};

exports.deleteTodo = (req, res) => {
  try {
    const todos = loadData();
    const id = parseInt(req.params.id, 10);
    const initialLength = todos.length;
    const filtered = todos.filter(t => t.id !== id);
    if (filtered.length === initialLength) return res.status(404).json({ error: 'Todo not found' });

    saveData(filtered);
    return res.json({ success: true });
  } catch (err) {
    console.error('deleteTodo error:', err);
    return res.status(500).json({ error: 'Failed to delete todo' });
  }
};
