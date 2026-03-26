import { Router } from "express";
import { createEntry, createEntrySchema, deleteEntry, getEntries } from "../controllers/entriesController";
import { validate } from "../middleware/validate";

const entryRouter=Router();

entryRouter.get('/',getEntries);
entryRouter.post('/',validate(createEntrySchema),createEntry);
entryRouter.delete('/:id',deleteEntry);

export default entryRouter
