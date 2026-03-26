'use client'
import { useEntries } from "@/context/EntriesContext";
import { useEffect } from "react";
import EntryCard from "./EntryCard";
import { LayoutList } from "lucide-react";

export default function EntryList(){
    const {entries,loading,fetchEntries} =useEntries()

    useEffect(()=>{
        fetchEntries()
    },[fetchEntries])

    if(loading){
        return(
            <div className="space-y-4">
                {[1,2,3].map(i=>(
                    <div
                    key={i}
                    className="bg-gray-900/40 backdrop-blur-sm rounded-3xl p-6 border border-gray-800/60 animate-pulse h-36"
                    />
                ))}
            </div>
        )
    }
    if(entries.length === 0){
        return (
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-3xl p-10 border border-gray-800/60 flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-gray-800/40 rounded-full text-indigo-400 mb-4 inline-flex">
                    <LayoutList size={32} />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No sessions logged yet</h3>
                <p className="text-gray-400 text-sm">Start tracking to generate insights and build streaks!</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800/40">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                    {entries.length} Session{entries.length !== 1 ? 's' : ''} Logged
                </h3>
            </div>
            <div className="space-y-4">
                {entries.map(entry=>(
                    <EntryCard key={entry.id} entry={entry}/>
                ))}
            </div>
        </div>
    )
}