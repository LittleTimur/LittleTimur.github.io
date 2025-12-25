// src/hooks/useScrollAnimation.ts
import { useEffect } from 'react';

const useScrollAnimation = (rootMargin = '0px 0px -50px 0px') => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('appear');
                    }
                    // Опционально: убрать класс при уходе (для повторного появления)
                    // else {
                    //   entry.target.classList.remove('appear');
                    // }
                });
            },
            { rootMargin }
        );

        const elements = document.querySelectorAll<HTMLElement>('.fade-in');
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
            observer.disconnect();
        };
    }, [rootMargin]);
};

export default useScrollAnimation;