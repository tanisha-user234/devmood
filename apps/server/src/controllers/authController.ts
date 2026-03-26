import {z} from 'zod';
import jwt from 'jsonwebtoken';
import { Request,Response } from 'express';
import { prisma } from '../lib/prisma';
import bycrpt from 'bcryptjs'
import { createDeflate } from 'zlib';
import { use } from 'react';
import { AuthRequest } from '../middleware/auth';

export const registerSchema=z.object({
    name:z.string().min(2,"Name must be of atleast two character"),
    email:z.string().email("Invalid email address"),
    password:z.string().min(6,"Password must be of minimum 6 length")
});

export const loginSchema=z.object({
    email:z.string().email("Invalid email address"),
    password:z.string().min(1,"Password is required")
});

const generateToken = (id:string,email:string):string=>{
    return jwt.sign(
        {id,email},
        process.env.JWT_SECRET!,
        {expiresIn:'17d'}
    )
}

export const register= async (req:AuthRequest,res:Response)=>{
    try {
        const {name,email,password}=req.body;

        //check if the user already exist?
        const existingUser= await prisma.user.findUnique({
            where:{email}
        })

        if(existingUser){
         return res.status(409).json({
                message:"Email already registered"
            });
        }

        const hashPassword = await bycrpt.hash(password,12);

        const user= await prisma.user.create({
            data:{
                name,
                email,
                password:hashPassword
            }
        });

        const token=generateToken(user.id,user.email);

        return res.status(200).json({
            token,
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                createdAt:user.createdAt
            }
        })

    } catch (error) {
        console.error("Register error",error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const login= async (req:AuthRequest,res:Response)=>{
    try {
        const {email,password}=req.body;

        const user= await prisma.user.findUnique({
            where:{email}
        });

        if(!user){
            res.status(401).json({
                message:"User not registered"
            })
            return;
        }

        const isPasswordValid= await bycrpt.compare(password,user?.password);

        if(!isPasswordValid){
            res.status(401).json({
                message:"Invalid username and password"
            })
            return;
        }

        //if everything is fine

        const token=generateToken(user.id,user.email);

        res.status(200).json({
            token,
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                createdAt:user.createdAt
            }
        })

        
    } catch (error) {
        console.error("Login Error",error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const getMe = async(req:AuthRequest,res:Response)=>{
    try {
        const user= await prisma.user.findUnique({
            where:{id:req.user?.id},
            select:{
                id:true,
                name:true,
                email:true,
                createdAt:true
            }
        });

        if(!user){
            res.status(404).json({
                message:"User not found"
            })
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}