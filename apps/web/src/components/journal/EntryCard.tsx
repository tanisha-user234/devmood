'use client'

import { useEntries } from "@/context/EntriesContext"
import { formatDate, getEnergyColor, getMoodEmoji } from "@/lib/utils"
import { useState } from "react"
import { Entry } from "shared"

interface EntryCardsProps{
    entry: Entry
}

export default function EntryCard({entry}:EntryCardsProps){
    const [deleting, setDeleting] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const {removeEntry}=useEntries()

    const handleDelete = async ()=>{
        if(!confirmDelete){
            setConfirmDelete(true)
            //Auto-cancel- conform after three seconds
            setTimeout(()=> setConfirmDelete(false),3000)
            return
        }

        setDeleting(true)
        try{
            await removeEntry(entry.id)
        }catch(error){
            console.error('Failed to delete entry:',error)
            setDeleting(false)
        }
    }
    return(
        <div className="bg-gray-900/40 backdrop-blur-sm rounded-3xl p-6 border border-gray-800/60 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
            {/* Header row */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    {/*Mood emoji */}
                    <div className="w-12 h-12 bg-gray-950/50 rounded-2xl flex items-center justify-center text-2xl border border-gray-800/50 shadow-inner group-hover:scale-110 group-hover:bg-indigo-500/10 transition-transform">
                        {getMoodEmoji(entry.mood)}
                    </div>
                  <div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-medium">
                            Mood {entry.mood}/10
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className={`text-sm font-medium ${getEnergyColor(entry.energy)}`}>
                            Energy {entry.energy}/10
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">{formatDate(entry.createdAt)}</p>
                  </div>
                </div>
                {/*Right side: hours badge + delete */}
                <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <span className="opacity-70">⏱️</span> {entry.sessionHours}h
                    </span>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className={`text-xs px-3 py-1 rounded-full font-medium transition-all
                            ${confirmDelete
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
                            }`}
                    >
                        {deleting ? '...' : confirmDelete ? 'Confirm?' : 'Delete'}
                    </button>
                </div>
            </div>
            {/*What worked on */}
            <p className="text-sm text-gray-300 leading-relaxed mb-4 pl-1">{entry.workedOn}</p>

            {/*Wins and Blockers */}
            {(entry.wins || entry.blockers) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {entry.wins &&(
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
                            <p className="text-xs text-emerald-400 font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5">
                                <span>🏆</span> Win
                            </p>
                            <p className="text-sm text-gray-300">{entry.wins}</p>
                        </div>
                    )}
                    {entry.blockers && (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3">
                            <p className="text-xs text-red-400 font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5">
                                <span>🧱</span> Blocker
                            </p>
                            <p className="text-sm text-gray-300">{entry.blockers}</p>
                        </div>
                    )}
                </div>
            )}

            {/*Tags */}
            {entry.tags.length > 0 &&(
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-800/40">
                    {entry.tags.map(tag=>(
                        <span
                            key={tag.id}
                            className="text-xs font-medium text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2.5 py-1 rounded-full"
                        >
                            #{tag.label}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}