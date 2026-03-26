import { Entry } from "shared";

export interface InsightsSummary {
  moodTrend: { date: string; avgMood: number }[];
  energyByDay: { dayOfWeek: string; avgEnergy: number }[];
  tagStats: { tag: string; avgMood: number; count: number }[];
  peakHour: { hour: string; avgMood: number } | null;
  burnoutRisk: number;
  currentStreak: number;
}

const BASE_URL= 'http://localhost:5000/api';

//generic function wrapper 
async function fetchApi<T>(
    endpoint:string,
    options:RequestInit ={}
):Promise<T> {
const token= await localStorage.getItem('devmood_token');
console.log("TOKEN:", token)
    const config:RequestInit={
        headers:{
            'Content-Type':'application/json',
           ...( token && {Authorization : `Bearer ${token}`}),
           ...options.headers
        },
        ...options
    }
    const response = await fetch(`${BASE_URL}/${endpoint}`,config);

    if(!response.ok){
        const error=await response.json();
        throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
}

//auth api

export const authApi={
    register:(data: {name:string;email:string;password:string})=>{
        return fetchApi<{token:string,user:any}>('auth/register',{
            method:'POST',
            body:JSON.stringify(data)
        })
    },

    login:(data:{email:string;password:string})=>{
        return fetchApi<{token:string,user:any}>('auth/login',{
            method:'POST',
            body:JSON.stringify(data)
        })
    },

    getMe:()=> fetchApi<{user:any}>('auth/me')
}

export const entriesApi={
    getAll:()=>fetchApi<{entries:Entry[]}>('entries'),
    create:(data:{
        mood:number
        energy:number
        sessionHours: number
        workedOn: string
        wins?:string
        blocker?:string
        tags:string[]
    })=>fetchApi('entries',{
        method:'POST',
        body:JSON.stringify(data)
    }),
    delete:(id:string)=>fetchApi(`entries/${id}`,{
        method:'DELETE'
    })
}

export const insightsApi = {
    getSummary: () => fetchApi<InsightsSummary>('insights')
}
