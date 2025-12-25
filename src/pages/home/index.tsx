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
            <Helmet>
                <title>С Новым Годом, Любовь моя 🌟</title>
                <meta name="description" content="Особенное новогоднее поздравление — только для тебя" />
                <meta name="color-scheme" content="light dark" />
                <style>
                    {`
            @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Manrope:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
          `}
                </style>
            </Helmet>

            {/* Современный снег (SVG-символы) */}
            <div ref={snowflakesRef} className="snowflakes"></div>

            {/* Фоновый градиент */}
            <div className="gradient-bg"></div>

            <div className="new-year-container">
                {/* Заголовок */}
                <header className="hero">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            С Новым Годом, Любимая моя
                        </h1>
                        <p className="hero-subtitle">
                            25 декабря 2025 — и вся Вселенная шепчет: «Ты самая»
                        </p>
                        <div className="ornament">✦</div>
                    </div>
                </header>

                {/* Основной текст */}
                <section className="letter fade-in">
                    <p>
                        Сегодня за окном — тишина и снег. А у меня в груди —
                        <span className="accent">лёгкое, тёплое волнение</span>.
                        Потому что я пишу это тебе.
                    </p>
                    <p>
                        Ты — не просто человек в моей жизни. Ты —
                        <span className="accent">то, ради чего стоит вставать по утрам</span>,
                        смотреть вперёд, верить в лучшее. С тобой даже самые обычные дни становятся
                        <span className="accent italic">немного волшебными</span>.
                    </p>
                    <p className="quote">
                        «Любовь — это когда чужая душа становится твоим домом».
                        <br />
                        <span className="quote-author">— И ты сделала меня счастливым.</span>
                    </p>
                </section>

                {/* Карточки */}
                <section className="cards-section fade-in">
                    <h2 className="section-title">Наши моменты</h2>
                    <div className="cards-grid">
                        {cards.map((card, idx) => (
                            <div className="flip-card" key={idx}>
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <img src={card.front} alt={`Момент ${idx + 1}`} />
                                    </div>
                                    <div className="flip-card-back">
                                        <p>{card.back}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Пожелания */}
                <section className="wishes fade-in">
                    <div className="wish">
                        <div className="wish-icon">✨</div>
                        <div>
                            <h3>В 2026 году я хочу</h3>
                            <p>Просыпаться и видеть твоё милое и недовольное(сонное) лицо</p>
                        </div>
                    </div>
                    <div className="wish">
                        <div className="wish-icon">🕯️</div>
                        <div>
                            <h3>Хочу</h3>
                            <p>Чаще готовить ужин вдвоём — даже если подгорит</p>
                        </div>
                    </div>
                    <div className="wish">
                        <div className="wish-icon">🌌</div>
                        <div>
                            <h3>Мечтаю</h3>
                            <p>Чтобы ты знала: ты — мой самый ценный подарок. Всегда.</p>
                        </div>
                    </div>
                </section>

                {/* Подпись */}
                <footer className="signature fade-in">
                    <p>С любовью,</p>
                    <p className="signature-name">Твой Тимурчик</p>
                    <p className="date">31 декабря 2025</p>
                    <div className="signature-ornament">❦</div>
                </footer>

                {/* Автокарусель внизу */}
                <section className="auto-carousel-section fade-in">
                    <h2 className="section-title">Мгновения, которые я храню в сердце</h2>
                    <div className="auto-carousel" onMouseEnter={pause} onMouseLeave={resume} onTouchStart={pause} onTouchEnd={resume}>
                        <div className="auto-carousel-track" ref={carouselRef}>
                            {/* Дублируем фото 2 раза для бесконечной прокрутки */}
                            {Array.from({ length: 58 }, (_, i) => {
                                const idx = (i % 29) + 1;
                                return (
                                    <div className="auto-carousel-slide" key={i}>
                                        <img
                                            src={`img/img-${idx}.jpg`}
                                            alt={`Наше фото ${idx}`}
                                            loading="lazy"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default NewYearLovePage;