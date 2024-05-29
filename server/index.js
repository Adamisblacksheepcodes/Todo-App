const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());

//Routes
app.post("/todos", async(req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);

        res.json(newTodo.rows[0]);

    } catch (err) {
        console.error(err.message)
    }
});

//get all todo
app.get("/todos", async(req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo")

        res.json(allTodos.rows);

    } catch (err) {
        console.error(err.message);
    }
});


//get a todo
app.get("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

        if (todo.rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }
        
        res.json(todo.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});


//update a todo
app.put("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *", 
        [description, id]);

        if (updateTodo.rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        //res.json("Todo was updated!");
        res.json(updateTodo.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});
           
//delete a todo
app.delete("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1 RETURNING *", [id]);

        if (deleteTodo.rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        //res.json("Todo was deleted!");
        res.json({ message: "Todo was deleted!" });
        
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(port, () => {
    console.log(`server has started on port ${port}`);
});