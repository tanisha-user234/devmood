'use client'
import { MOOD_EMOJIS } from "@/lib/utils"


interface MoodPickerProps{
    value:number
    onChange:(mood: number) => void
}



export default function MoodPicker({value,onChange}:MoodPickerProps){
    return(
        <div>
            <div className="flex gap-1 flex-wrap">
                {MOOD_EMOJIS.map(({value:v,emoji,label})=>(
                    <button
                    key={v}
                    type="button"
                    title={`${v} - ${label}`}
                    onClick={()=>onChange(v)}
                    className={value === v
  ? 'w-9 h-9 rounded-lg text-lg transition-all bg-indigo-600 scale-110 shadow-lg shadow-indigo-500/30'
  : 'w-9 h-9 rounded-lg text-lg transition-all bg-gray-800 hover:bg-gray-700 opacity-60 hover:opacity-100'
}
                        >
                            {emoji}
                        </button>
                ))}
            </div>
            {value > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                    {value}/10 - {MOOD_EMOJIS.find(m => m.value === value)?.label}
                </p>
            )}
        </div>
    )
}