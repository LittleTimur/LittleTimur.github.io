import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import useScrollAnimation from './useScrollAnimation';
import './style.css';

const NewYearLovePage: React.FC = () => {
    useScrollAnimation();
    const snowflakesRef = useRef<HTMLDivElement>(null);

    // Анимация снега + реакция на мышь
    useEffect(() => {
        if (!snowflakesRef.current) return;

        const container = snowflakesRef.current;
        const flakes: HTMLElement[] = [];

        const createFlake = () => {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            flake.style.left = `${Math.random() * 100}%`;
            flake.style.opacity = `${Math.random() * 0.7 + 0.3}`;
            flake.style.fontSize = `${Math.random() * 10 + 8}px`;
            flake.style.animationDuration = `${Math.random() * 5 + 5}s`;
            flake.style.animationDelay = `${Math.random() * 5}s`;
            flake.innerText = ['❄', '❅', '❆'][Math.floor(Math.random() * 3)];
            container.appendChild(flake);
            flakes.push(flake);

            // Удаляем через 10 сек
            setTimeout(() => {
                flake.remove();
                flakes.splice(flakes.indexOf(flake), 1);
            }, 10000);
        };

        const interval = setInterval(createFlake, 300);
        createFlake(); // сразу один

        // Реакция на движение мыши
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            document.documentElement.style.setProperty('--mouse-x', String(x * 0.1));
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            clearInterval(interval);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);
//img/banner-img-1.jpg
    const cards = [
        {
            front: 'img/img-1.jpg',
            back: 'Ты человек, с которым я хочу проводить все своё время',
        },
        {
            front: 'img/img-5.jpg',
            back: 'С которым хочу путешествовать',
        },
        {
            front: 'img/img-6.jpg',
            back: 'Ты всегда устраивала для меня какие-то подарки, и я хочу сделать для тебя то же самое',
        },
        {
            front: 'img/img-28.jpg',
            back: 'Я был очень счастил, когда переехал с тобой в наже гнёздышко',
        },
        {
            front: 'img/img-3.jpg',
            back: 'Я помню, как ты выпрашивала у меня эту гирлядку, надеюсь, настанет момент, когда этого делать больше не придётся и я научусь читать твои мысли',
        },
        {
            front: 'img/img.gif',
            back: 'А это — напоминание: с тобой даже обычный день превращается в маленькое и незабываемое волшебство 🌟',
        },
    ];

    // === Автокарусель ===
    const carouselRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);
    const [isPaused, setIsPaused] = React.useState(false);

    const pause = () => setIsPaused(true);
    const resume = () => setIsPaused(false);

    useEffect(() => {
        if (isPaused) return;

        const track = carouselRef.current;
        if (!track) return;

        const slideWidth = 220; // ширина слайда + отступ
        let position = 0;

        const animate = () => {
            position -= 1; // пиксель за кадр → ~60px/сек → плавно
            track.style.transform = `translateX(${position}px)`;

            // Сброс при достижении конца первого круга
            if (position <= -slideWidth * 29) {
                position = 0;
                track.style.transition = 'none';
                requestAnimationFrame(() => {
                    track.style.transform = `translateX(0)`;
                    setTimeout(() => {
                        track.style.transition = 'transform 0.4s ease';
                    }, 50);
                });
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPaused]);

    return (
        <>
            Hello
        </>
    );
};

export default NewYearLovePage;
