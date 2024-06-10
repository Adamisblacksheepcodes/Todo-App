const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
});

const Todo = sequelize.define('Todo', {
  todo_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  description: {
      type: DataTypes.STRING,
      allowNull: false
  }
}, {
  tableName: 'todo',
  timestamps: false
});

sequelize.sync().then(() => {
  console.log("Database connected and models synchronized");
}).catch((err) => {
  console.log(err);
});

//middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES//

app.get('/', (req, res) => {
  res.send('Welcome to the Todo App!');
});

//create a todo

async function addNewTodo() {
  try {
      const newTodo = await Todo.create({
          description: 'taekwondo training tomorrow'
      });
      console.log('New todo added:', newTodo);
  } catch (error) {
       console.error('Error adding todo:', error);
  }
}

addNewTodo();

app.post("/todos", async (req, res) => {
  try {
      const { description } = req.body;
      const newTodo = await Todo.create({ description });
      res.json(newTodo);
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
  }
});

// Get all todos
app.get("/todos", async (req, res) => {
  try {
      const allTodos = await Todo.findAll();
      res.json(allTodos);
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
  }
});

// Get a todo
app.get("/todos/:id", async (req, res) => {
  try {
      const todo = await Todo.findByPk(req.params.id);
      if (!todo) {
          return res.status(404).send("Todo not found");
      }
      res.json(todo);
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
  }
});

// Update a todo 
app.put("/todos/:id", async (req, res) => {
  try {
      const { description } = req.body;
      const todo = await Todo.update({ description }, {
          where: {
              todo_id: req.params.id
          }
      });
      if (todo[0] === 0) { // check affected rows
          return res.status(404).send("Todo not found");
      }
      res.send("Todo was updated!");
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
  }
});

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
      const result = await Todo.destroy({
          where: {
              todo_id: req.params.id
          }
      });
      if (result === 0) {
          return res.status(404).send("Todo not found");
      }
      res.send("Todo was deleted!");
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});