export interface User{
    id:string;
    name:string;
    email:string;
    password:string;
    createdAt:string;
}

export interface Tag{
    id:string;
    label:string;
}

export interface Entry{
    id:string;
    userId:string;
    mood:number;
    energy:number;
    sessionHours:number;
    wins?:string;
    workedOn?:string;
    blockers?:string;
    tags:Tag[],
    createdAt: string;
}

export interface CreateEntryInput{
    mood:number,
    energy:number,
    sessionHours:number;
    workedOn?:string;
    wins?:string;
    blockers?:string;
    tags:Tag[]

}

export interface AuthResponse{
    token:string;
    user:User
}

export interface ApiError{
    message:string;
    errors?:Record<string,string[]>
}

export interface MoodTrend{
    date:string;
    avgMood:number;
    avgEnergy:number;
}

export interface TagStat{
   label:string;
   avgMood:number;
   count:number;
}

export interface InsightsSummary{
    peakHour:number;
    bestTag:string;
    burnOutRisk:boolean;
    currentStreak:number;
    weeklyTrend:MoodTrend[];
    tagStats:TagStat[];
}