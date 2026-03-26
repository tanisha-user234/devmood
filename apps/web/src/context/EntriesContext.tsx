'use client'

import { entriesApi } from '@/lib/api'
import{createContext, useContext,useState,useCallback,ReactNode} from 'react'
import { Entry } from 'shared'

interface EntriesContextType{
    entries: Entry[]
    loading:boolean
    fetchEntries:()=> Promise<void>
    addEntry:(data:{
        mood:number
        energy:number
        sessionHours:number
        workedOn: string
        wins?:string
        blocker?:string
        tags:string[]
    })=>Promise<void>
    removeEntry:(id:string) =>Promise<void>
}

const EntriesContext= createContext<EntriesContextType| undefined>(undefined)

export function EntriesProvider({children}:{children:ReactNode}){
    const [entries,setEntries]=useState<Entry[]>([])
    const [loading, setLoading]=useState(false)

    const fetchEntries = useCallback(async ()=>{
        setLoading(true)
        try {
            const {entries:data}=await entriesApi.getAll()
            setEntries(data)
            
        } catch (error) {
            console.log('Failed to fetch Entries:',error)
            
        }finally{
            setLoading(false)
        }
    },[])

    const addEntry = async (data:Parameters<typeof entriesApi.create>[0])=>{
        const { entry }= await entriesApi.create(data) as any;
        //append the newEntry at top
        setEntries(prev=>[entry,...prev]);
    }

    const removeEntry = async (id:string)=>{
        await entriesApi.delete(id)
        //now we have to remove it from our entries array
        setEntries(prev => prev.filter(e=>e.id !== id))
    }

    return(
        <EntriesContext.Provider
          value={{entries,loading,fetchEntries,addEntry,removeEntry}}
        >
            {children}
        </EntriesContext.Provider>
    );
}

export function useEntries(){
    const context = useContext(EntriesContext)
    if(!context) throw new Error('useEntries must be saved within EntriesProvider')
    return context
}