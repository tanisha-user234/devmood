'use client'
import { getEnergyColor,getEnergyLabel } from "@/lib/utils"

interface EnergySliderProps{
    value: number
    onChange:(energy : number)=>void
}

export default function EnergySlider ({value, onChange}:EnergySliderProps){
    return (
        <div>
            <div className="flex items-center gap-4">
                <input
                type="range"
                min={1}
                max={10}
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="w-full accent-indigo-500 h-2"
                />
                <span className={`text-lg font-bold w-6 text-right ${getEnergyColor(value)}`}>
                    {value}
                </span>
                <p className="text-xs text-gray-400 mt-1">{getEnergyLabel(value)}</p>
            </div>
        </div>
    )
}
