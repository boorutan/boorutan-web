import { useState, useEffect } from 'react';

const easeOutQuint = (x: number): number => {
    return 1 - Math.pow(1 - x, 5);
}

const easeOutSine = (x: number): number => {
    return Math.sin((x * Math.PI) / 2);
}

const useScrollDirection = (): Boolean => {
    const [direction, setDirection] = useState<Boolean>(false);
    useEffect(() => {
        let position = 0
        const updateScrollDirection = (e: any): void => {
            setDirection(window.pageYOffset < position)
            position = window.pageYOffset
        };
        window.addEventListener("scroll", updateScrollDirection);
        return () => window.removeEventListener("scroll", updateScrollDirection);
    }, []);
    return direction;
};
export default useScrollDirection