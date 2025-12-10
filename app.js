const express = require('express')
const path = require('path')
const db = require('./db')

const app = express()

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.get('/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json(result.rows[0]);
    } catch (err) {
        console.log(err)
        res.status(500).send('Database connection error');
    }
});

app.post('/todos', async (req, res) => {
    try {
        const { id, task, task_completed } = req.body;
        const newTodo = await db.query(
            'INSERT INTO todos (id,task,task_completed) VALUES ($1, $2, $3 ) RETURNING *', [id, task, task_completed]
        );
        res.json(newTodo.rows[0])
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Database connection error')
    }
})

app.get('/todos', async (req, res) => {
    try {
        const allTodos = await db.query('SELECT * FROM todos');
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { task } = req.body;

        const updateTodo = await db.query('UPDATE todos SET task = $1 WHERE id = $2', [task, id]);

        res.json('Todo was updated!')
    } catch (err) {
        console.error(err.message)
    }
})

app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await db.query('DELETE FROM todos where id = $1', [id]);
        res.json('Todo was deleted!')
    } catch (err) {
        console.error(err);
    }
})

app.all('/*splat', (req, res) => {
    res.status(401).send('<h1>Page Not Found!</h1>')
})

app.listen(5000, () => {
    console.log('Server listening at PORT : 5000')
})