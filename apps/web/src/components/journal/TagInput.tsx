'use client'
import {useState, KeyboardEvent} from 'react'

interface TagInputProps{
    value: string[]
    onChange:(tags:string[])=> void
}

const PRESET_TAGS=['debugging','feature','review','meetings','learning','refactor','testing','docs']

export default function TagInput({value,onChange}:TagInputProps){
    const [inputValue, setInputValue]=useState('')

    const addTag=(tag:string)=>{
        const cleaned = tag.toLowerCase().trim().replace(/,/g,'')
        if(!cleaned) return
        if(value.includes(cleaned)) return //no duplicates
        if(value.length >= 10) return // max 10 tags are allowed per entry
        onChange([...value, cleaned])
        setInputValue('')
    }

    const removeTag = (tag:string)=>{
        onChange(value.filter(t=>t !== tag))
    }
    const handleKeyDown = (e:KeyboardEvent<HTMLInputElement>)=>{
        if(e.key === 'Enter' || e.key === ','){
            e.preventDefault()
            addTag(inputValue)
        }
        // backspace on empty input removes last tag
        if(e.key === 'Backspace' && inputValue ==='' && value.length>0){
            removeTag(value[value.length-1])
        }
    }
    return(
        <div>
            {/*  Tag chips*/}
            {value.length >0 && (
                <div className='flex flex-wrap gap-2 mb-2'>
                    {value.map(tag=>(
                        <span
                        key={tag}
                        className='flex items-center gap-1 bg-indigo-600/20 text-indigo-300 *:
                        border border-indigo-500/30 text-xs px-2.5 py-1 rounded-full
                        '
                        >#{tag}
                        <button
                        type='button'
                        onClick={()=> removeTag(tag)}
                        className='hover:text-white transition-colors ml-1'
                        >
                            ×
                        </button>
                        </span>
                    ))}
                    </div>
                   )}
                    {/* INPUT */}
                    <input
                    type='text'
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Type a tag and press Enter...'
                    className='w-full bg-gray-800 border border-gray-700 text-white rounded-lg
                    px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors'
                    />


                    {/* Preset tag suggestion */}
                    <div className='flex flex-wrap gap-1.5 mt-2'>
                    {PRESET_TAGS.filter(t=> !value.includes(t)).map(tag =>(
                        <button
                        key={tag}
                        type='button'
                        onClick={()=>addTag(tag)}
                        // TO THIS — one single line, no line breaks inside the string
className="text-xs text-gray-500 hover:text-gray-300 border border-gray-700 hover:border-gray-500 px-2 py-0.5 rounded-full transition-colors">
                            +{tag}
                        </button>
                    ))}
                </div>
         
        </div>
    )
}