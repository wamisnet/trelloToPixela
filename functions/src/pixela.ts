import {api} from "./api";
import {Headers} from "node-fetch";
interface PixelaResponse {
    message: string
    isSuccess: boolean
}

export default class Pixela {
    private userId: string;
    private graphId: string;
    private token: string;
    constructor(userId:string,graphId:string,token:string) {
        this.userId = userId;
        this.graphId = graphId;
        this.token = token;

    }

    get userPageUrl(){
        return `https://pixe.la/@${this.userId}`
    }

    get graphDetailUrl(){
        return `https://pixe.la/v1/users/${this.userId}/graphs/${this.graphId}.html`
    }

    get graphImageUrl(){
        return `https://pixe.la/v1/users/${this.userId}/graphs/${this.graphId}`
    }

    async createUser(): Promise<boolean>{
        const data = await api<PixelaResponse>(`https://pixe.la/v1/users`,{
            body:JSON.stringify({
                token: this.token,
                username:this.userId,
                agreeTermsOfService:'yes',
                notMinor:'yes',
            }),
            method:"POST",
        });
        return data.isSuccess;
    }

    async createGraph(graphName:string,unit:string,type:"int"|"float",color:"shibafu"|"momiji"|"sora"|"ichou"|"ajisai"|"kuro",timezone:"Asia/Tokyo"|"UTC"): Promise<boolean>{
        const data = await api<PixelaResponse>(`https://pixe.la/v1/users/${this.userId}/graphs`,{
            body:JSON.stringify({
                id: this.graphId,
                name:graphName,
                unit,
                type,
                color,
                timezone,
            }),
            headers:{
                "X-USER-TOKEN":this.token,
            },
            method:"POST",
        });
        return data.isSuccess;
    }

    async incrementGraph(): Promise<boolean>{
        const headers:Headers = new Headers();
        headers.set("X-USER-TOKEN",this.token);
        headers.set("Content-Length","0");
        const data = await api<PixelaResponse>(`https://pixe.la/v1/users/${this.userId}/graphs/${this.graphId}/increment`,{
            headers:headers,
            method:"PUT",
        });
        return data.isSuccess;
    }

    async postGraph(setDate:Date,quantity:string,optionalData:string = ""): Promise<boolean>{
        const data = await api<PixelaResponse>(`https://pixe.la/v1/users/${this.userId}/graphs/${this.graphId}`,{
            body:JSON.stringify({
                date:`${setDate.getFullYear()}${('00'+(setDate.getMonth()+1)).slice(-2)}${('00'+setDate.getDate()).slice(-2)}`,
                quantity,
                optionalData,
            }),
            headers:{
                "X-USER-TOKEN":this.token,
            },
            method:"POST",
        });
        return data.isSuccess;
    }
}