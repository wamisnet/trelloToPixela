import fetch, {RequestInit} from "node-fetch"
export const api = <T>(url: string,config?: RequestInit): Promise<T> => {
    return fetch(url,config)
        .then(async response => {
            if (!response.ok) {
                throw new Error(`${response.statusText}  ${JSON.stringify(await response.json())}`);
            }
            return response.json().then(data => data as T);
        })
}