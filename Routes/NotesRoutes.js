const express = require("express");
const notesRouter = express.Router();
const Notes = require("../Models/NotesModel");
const auth = require("../Middlewares/auth.middleware");

notesRouter.use(auth);
notesRouter.get("/", async (req, res) => {
    try {
        const notes = await Notes.find();
        res.status(200).send(notes);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

notesRouter.post("/add", async (req, res) => {
    try {
        const note = new Notes(req.body);
        await note.save();
        res.status(200).send(note);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

notesRouter.patch("/update/:id", async (req, res) => {
    try {
        const note = await Notes.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(note);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

notesRouter.delete("/delete/:id", async (req, res) => {
    try {
        const note = await Notes.findByIdAndDelete(req.params.id);
        res.status(200).send(note);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

module.exports = notesRouter