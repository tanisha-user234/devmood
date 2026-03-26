import {z} from 'zod'
import { prisma } from '../lib/prisma';
import { Request,Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const createEntrySchema = z.object({
    mood: z
    .number({error : 'Mood must be a number'})
    .int()
    .min(1,"Mood must be atleast 1")
    .max(10, "Mood must be at most 10"),
    sessionHours:z
    .number()
    .positive('Session hour must be positive')
    .max(24, 'Session cannot exceed 24 hours'),
    energy:z
    .number()
    .int()
    .min(1)
    .max(10),
    workedOn:z.string().min(1,'Please describe what you worked on').max(1000),
    wins:z.string().max(500).optional(),
    blockers:z.string().max(500).optional(),
    tags: z.array(z.string().min(1).max(40))
    .max(10,'Max 10 tags per entry')
    .default([])
})

export const getEntries = async (req:AuthRequest, res:Response) =>{
    try {
        const entries = await prisma.entry.findMany({
            where:{
                userId: req.user?.id
            },
            include:{
                tags:true
            },
            orderBy:{
                createdAt: 'desc'
            }
        })
        res.json({entries})
    } catch (error) {
        console.error('Get entries error:',error)
        res.status(500).json({message:'Failed to fetch entries'})
    }
}

export const createEntry = async (req: AuthRequest,res:Response)=>{
    try {
        const {mood,energy,sessionHours, workedOn,wins, blocker,tags}=req.body
        console.log("USER ID:", req.user?.id);
        const entry = await prisma.entry.create({
            data:{
                  user: {
    connect: { id: req.user?.id }
  },
                mood,
                energy,
                sessionHours,
                workedOn,
                wins,
                blocker,
                tags:{
                    //connectOrCreate : if the tag exist map the entry to that tag 
                    //if that tag does not exist then create it
                    connectOrCreate:tags.map((label:string)=>({
                        where:{label:label.toLowerCase().trim()},
                        create:{label:label.toLowerCase().trim()}
                    }))
                }
            },
            include:{
                tags:true
            }
        })
        res.status(201).json({entry})
        
    } catch (error) {
        console.error("Error in creating Entry",error)
        res.status(500).json({message:"Failed to create an entry"})
    }
}

export const deleteEntry = async(req:AuthRequest,res:Response)=>{
    try {
            const id = req.params.id as string
    //first we need to check if the  entry exixts and belong to this user
    if (!req.user?.id) {
  return res.status(401).json({ message: "Unauthorized" });
}
    const entry=await prisma.entry.findFirst({
        where:{
            id,
            userId:req.user?.id
        }
    })
    if(!entry){
        res.status(404).json({message : 'Entry not found'})
        return
    }

    await prisma.entry.delete({
        where:{id}
    })

    res.json({message : 'Entry deleted sucessfully'})
    } catch (error) {
        console.error("Delete entry error: ",error)
        res.status(500).json({message:'Failed to delete entry'})
    }

}
