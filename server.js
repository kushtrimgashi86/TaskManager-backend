import express from "express";
import cors from "cors";
import { db } from "./database.js";
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/tasks", (req, res) => {
 const tasks = db.prepare("SELECT * FROM tasks").all();
 res.json(tasks);
});
// post
app.post("/api/tasks", (req, res) => {
    const title = req.body.title?.trim();

    if (!title) {
        return res.status(400).json({
            error: "Titulli kerkohet"
        });
    }

    const description = req.body.description ?? "";

    const result = db.prepare(
        "INSERT INTO tasks (title, description) VALUES (?, ?)"
    ).run(title, description);

    res.status(201).json({
        id: Number(result.lastInsertRowid),
        title,
        description,
        completed: 0
    });
});

// put
app.put("/api/tasks/:id", (req, res) => {
    const id = req.params.id;

    const title = req.body.title?.trim();
    const description = req.body.description ?? "";
    const completed = req.body.completed ? 1 : 0;

    if (!title) {
        return res.status(400).json({
            error: "Titulli kerkohet"
        });
    }

    const result = db.prepare(`
        UPDATE tasks
        SET title = ?, description = ?, completed = ?
        WHERE id = ?
    `).run(title, description, completed, id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: "Detyra nuk u gjet"
        });
    }

    const updatedTask = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(id);

    res.json(updatedTask);
});

// delete
app.delete("/api/tasks/:id", (req, res) => {
    const id = req.params.id;

    const result = db.prepare(
        "DELETE FROM tasks WHERE id = ?"
    ).run(id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: "Detyra nuk u gjet"
        });
    }

    res.status(204).send();
});


app.listen(5000, () => {
 console.log("API: http://localhost:5000");
});