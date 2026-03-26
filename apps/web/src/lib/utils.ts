export const MOOD_EMOJIS = [
  { value: 1,  emoji: '😭', label: 'Terrible' },
  { value: 2,  emoji: '😢', label: 'Bad' },
  { value: 3,  emoji: '😞', label: 'Poor' },
  { value: 4,  emoji: '😕', label: 'Meh' },
  { value: 5,  emoji: '😐', label: 'Okay' },
  { value: 6,  emoji: '🙂', label: 'Good' },
  { value: 7,  emoji: '😊', label: 'Pretty good' },
  { value: 8,  emoji: '😄', label: 'Great' },
  { value: 9,  emoji: '🤩', label: 'Amazing' },
  { value: 10, emoji: '🚀', label: 'Legendary' }
]

export const getMoodEmoji = (mood: number) =>
  MOOD_EMOJIS.find(m => m.value === mood)?.emoji ?? '😐'

export const getMoodLabel = (mood: number) =>
  MOOD_EMOJIS.find(m => m.value === mood)?.label ?? 'Okay'

export const getEnergyColor = (energy: number) => {
  if (energy <= 3) return 'text-red-400'
  if (energy <= 6) return 'text-yellow-400'
  return 'text-green-400'
}
export const getEnergyLabel=(value:number) => {
    if(value<=2) return 'Drained'
    if(value <=4) return 'Low'
    if(value <= 6) return 'Okay'
    if(value<= 8) return 'Energized'
    return 'On Fire'
}
export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}