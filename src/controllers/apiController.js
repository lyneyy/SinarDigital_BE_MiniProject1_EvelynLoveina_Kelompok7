const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../../data/data.json');
const dataDir = path.dirname(dataPath);

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));

const loadData = () => {
    try { return JSON.parse(fs.readFileSync(dataPath, 'utf-8')); } 
    catch { return []; }
};
const saveData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

exports.getTodos = (req, res) => res.json(loadData());

exports.addTodo = (req, res) => {
    const todos = loadData();
    const newTodo = {
        id: Date.now(),
        text: req.body.text || 'No text',
        completed: false
    };
    todos.push(newTodo);
    saveData(todos);

    res.redirect('/todos.html');
};

exports.toggleTodo = (req, res) => {
    const todos = loadData();
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    todo.completed = !todo.completed;
    saveData(todos);
    res.json({ success: true });
};

exports.deleteTodo = (req, res) => {
    let todos = loadData();
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter(t => t.id !== id);
    if (todos.length === initialLength) return res.status(404).json({ error: 'Todo not found' });
    saveData(todos);
    res.json({ success: true });

};
