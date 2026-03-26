"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEntry = exports.createEntry = exports.getEntries = exports.createEntrySchema = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
exports.createEntrySchema = zod_1.z.object({
    mood: zod_1.z
        .number({ error: 'Mood must be a number' })
        .int()
        .min(1, "Mood must be atleast 1")
        .max(10, "Mood must be at most 10"),
    sessionHours: zod_1.z
        .number()
        .positive('Session hour must be positive')
        .max(24, 'Session cannot exceed 24 hours'),
    energy: zod_1.z
        .number()
        .int()
        .min(1)
        .max(10),
    workedOn: zod_1.z.string().min(1, 'Please describe what you worked on').max(1000),
    wins: zod_1.z.string().max(500).optional(),
    blockers: zod_1.z.string().max(500).optional(),
    tags: zod_1.z.array(zod_1.z.string().min(1).max(40))
        .max(10, 'Max 10 tags per entry')
        .default([])
});
const getEntries = async (req, res) => {
    try {
        const entries = await prisma_1.prisma.entry.findMany({
            where: {
                userId: req.user?.id
            },
            include: {
                tags: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json({ entries });
    }
    catch (error) {
        console.error('Get entries error:', error);
        res.status(500).json({ message: 'Failed to fetch entries' });
    }
};
exports.getEntries = getEntries;
const createEntry = async (req, res) => {
    try {
        const { mood, energy, sessionHours, workedOn, wins, blocker, tags } = req.body;
        console.log("USER ID:", req.user?.id);
        const entry = await prisma_1.prisma.entry.create({
            data: {
                user: {
                    connect: { id: req.user?.id }
                },
                mood,
                energy,
                sessionHours,
                workedOn,
                wins,
                blocker,
                tags: {
                    //connectOrCreate : if the tag exist map the entry to that tag 
                    //if that tag does not exist then create it
                    connectOrCreate: tags.map((label) => ({
                        where: { label: label.toLowerCase().trim() },
                        create: { label: label.toLowerCase().trim() }
                    }))
                }
            },
            include: {
                tags: true
            }
        });
        res.status(201).json({ entry });
    }
    catch (error) {
        console.error("Error in creating Entry", error);
        res.status(500).json({ message: "Failed to create an entry" });
    }
};
exports.createEntry = createEntry;
const deleteEntry = async (req, res) => {
    try {
        const id = req.params.id;
        //first we need to check if the  entry exixts and belong to this user
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const entry = await prisma_1.prisma.entry.findFirst({
            where: {
                id,
                userId: req.user?.id
            }
        });
        if (!entry) {
            res.status(404).json({ message: 'Entry not found' });
            return;
        }
        await prisma_1.prisma.entry.delete({
            where: { id }
        });
        res.json({ message: 'Entry deleted sucessfully' });
    }
    catch (error) {
        console.error("Delete entry error: ", error);
        res.status(500).json({ message: 'Failed to delete entry' });
    }
};
exports.deleteEntry = deleteEntry;
