import { useEffect } from "react";

const useEffectApi = (fn: ()=> any, arr: Array<any> = []) => {
    useEffect(()=> {(async ()=> {
		await fn();
	})()}, arr)
}
export {
    useEffectApi
};