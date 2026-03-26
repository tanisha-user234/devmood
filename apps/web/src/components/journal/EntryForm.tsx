'use client'

import { useEntries } from "@/context/EntriesContext"
import { useState } from "react"
import MoodPicker from "./MoodPicker"
import EnergySlider from "./EnergySlider"
import TagInput from "./TagInput"
import { Save, CheckCircle2 } from "lucide-react"

interface EntryFormData{
    mood:number
    energy:number
    sessionHours:number
    workedOn: string
    wins: string
    blocker:string
    tags:string[]
}

const initialFormData: EntryFormData={
    mood:5,
    energy:5,
    sessionHours:1,
    workedOn: '',
    wins: '',
    blocker:'',
    tags: []
}  

export default function EntryForm(){
    const [formData,setFormData] = useState<EntryFormData>(initialFormData)
    const[loading, setLoading] = useState(false)
    const[error, setError]=useState('')
    const [success,setSuccess]=useState(false)
    const {addEntry}=useEntries()

    const updateField = <K extends keyof EntryFormData>(field:K,value:EntryFormData[K])=>{
        setFormData(prev=>({...prev,[field]:value}))
    }

    const handleSUbmit= async(e :React.FormEvent)=>{
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await addEntry({
                ...formData,
                wins:formData.wins || undefined,
                blocker: formData.blocker || undefined
            })
            setFormData(initialFormData)
            setSuccess(true)
            setTimeout(()=>setSuccess(false),3000)
        } catch (error:any) {
            setError(error.message || 'Failed to save Entry')
        }finally{
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSUbmit} className="bg-gray-900/40 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-gray-800/60 space-y-8 shadow-xl">
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Log Today's Session</h2>

            {error &&(
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            {success &&(
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 text-sm rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 size={18} />
                    <span>Session logged successfully!</span>
                </div>
            )}

            {/* Mood */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                    How's your mood? <span className="text-red-400">*</span>
                </label>
                <div className="bg-gray-950/50 p-3 rounded-2xl border border-gray-800/50">
                    <MoodPicker
                    value={formData.mood}
                    onChange={v => updateField('mood',v)}
                    />
                </div>
            </div>

            {/** Energy */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                    Energy Level <span className="text-red-400">*</span>
                </label>
                <div className="bg-gray-950/50 p-4 rounded-2xl border border-gray-800/50">
                    <EnergySlider
                    value={formData.energy}
                    onChange={v=>updateField('energy',v)}
                    />
                </div>
            </div>

             {/* Session Hours */}
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Session duration (hours) <span className="text-red-400">*</span>
                </label>
                <input
                type="number"
                min={0.5}
                max={24}
                step={0.5}
                value={formData.sessionHours}
                onChange={e=>updateField('sessionHours',Number(e.target.value))}
                className="w-full bg-gray-950/50 border border-gray-800/60 text-white rounded-xl px-4 py-3
                text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
             </div>

             {/* WHat you worked in */}
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    What did you work on? <span className="text-red-400">*</span>
                </label>
                <textarea
                value={formData.workedOn}
                onChange={e=>updateField('workedOn',e.target.value)}
                required
                rows={3}
                placeholder="Describe what you built, fixed, or learned..."
                className="w-full bg-gray-950/50 border border-gray-800/60 text-white rounded-xl px-4 py-3 
                text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder:text-gray-600"
                />
             </div>

             {/*Tags */}
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <TagInput
                value={formData.tags}
                onChange={tags => updateField('tags',tags)}
                />
             </div>

             {/* WIns */}
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    Wins 🏆 <span className="text-gray-500 font-normal text-xs">(optional)</span>
                </label>
                <textarea
                value={formData.wins}
                onChange={e=> updateField('wins',e.target.value)}
                rows={2}
                placeholder="What went well? Even small wins count."
                className="w-full bg-gray-950/50 border border-gray-800/60 text-white rounded-xl px-4 py-3 
                text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder:text-gray-600"
                />
             </div>

             {/* BLocker */}
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    Blockers 🧱 <span className="text-gray-500 font-normal text-xs">(optional)</span>
                </label>
                <textarea
                value={formData.blocker}
                onChange={e=> updateField('blocker',e.target.value)}
                rows={2}
                placeholder="What slowed you down or frustrated you?"
                className="w-full bg-gray-950/50 border border-gray-800/60 text-white rounded-xl text-sm px-4 py-3
                focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder:text-gray-600"
                />
             </div>

             <button
             type="submit"
             disabled={loading|| !formData.workedOn.trim()}
             className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/40
             disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-xl py-3.5 text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
             >
                {loading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                ) : (
                    <>
                        <Save size={18} />
                        Save Session
                    </>
                )}
             </button>
        </form>
    )
}
