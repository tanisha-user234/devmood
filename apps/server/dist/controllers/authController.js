"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be of atleast two character"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be of minimum 6 length")
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(1, "Password is required")
});
const generateToken = (id, email) => {
    return jsonwebtoken_1.default.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '17d' });
};
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //check if the user already exist?
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }
        const hashPassword = await bcryptjs_1.default.hash(password, 12);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword
            }
        });
        const token = generateToken(user.id, user.email);
        return res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    }
    catch (error) {
        console.error("Register error", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(401).json({
                message: "User not registered"
            });
            return;
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user?.password);
        if (!isPasswordValid) {
            res.status(401).json({
                message: "Invalid username and password"
            });
            return;
        }
        //if everything is fine
        const token = generateToken(user.id, user.email);
        res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    }
    catch (error) {
        console.error("Login Error", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user?.id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });
        if (!user) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getMe = getMe;
