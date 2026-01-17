import React, { useState, useEffect, useRef, useCallback } from 'react';
import Icon from './Icon';

export const FontSizeControl = ({ onScaleChange }) => {
    const [fontSize, setFontSize] = useState(16);
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef(null);

    // 同步到 App 層
    useEffect(() => {
        if(onScaleChange) onScaleChange(fontSize / 16);
    }, [fontSize, onScaleChange]);

    const resetTimer = useCallback(() => {
        setIsVisible(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsVisible(false), 3000);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', resetTimer);
        window.addEventListener('click', resetTimer);
        window.addEventListener('touchstart', resetTimer);
        resetTimer();
        return () => {
            window.removeEventListener('scroll', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('touchstart', resetTimer);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [resetTimer]);

    const handleIncrease = (e) => { e.stopPropagation(); resetTimer(); setFontSize(prev => Math.min(prev + 2, 24)); };
    const handleDecrease = (e) => { e.stopPropagation(); resetTimer(); setFontSize(prev => Math.max(prev - 2, 14)); };
    const handleReset = (e) => { e.stopPropagation(); resetTimer(); setFontSize(16); };

    return (
        <div className={`fixed right-2 bottom-12 z-40 flex flex-col gap-2 p-1 transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <button onClick={handleIncrease} className="w-6 h-6 rounded-full bg-black/20 backdrop-blur-[2px] text-white flex items-center justify-center shadow-sm active:bg-blue-600/60 transition-all"><Icon name="plus" size={14} /></button>
            <button onClick={handleReset} className="w-6 h-6 rounded-full bg-black/20 backdrop-blur-[2px] text-white flex flex-col items-center justify-center shadow-sm active:bg-blue-600/60 transition-all"><span className="text-[9px] font-bold text-white/90">{Math.round((fontSize / 16) * 100)}%</span></button>
            <button onClick={handleDecrease} className="w-6 h-6 rounded-full bg-black/20 backdrop-blur-[2px] text-white flex items-center justify-center shadow-sm active:bg-blue-600/60 transition-all"><Icon name="minus" size={14} /></button>
        </div>
    );
};

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const toggleVisibility = () => {
            const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300;
            setIsVisible(scrolledToBottom);
        };
        toggleVisibility();
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed right-3 bottom-40 z-40 w-10 h-10 rounded-full bg-blue-600/90 text-white shadow-lg backdrop-blur-[2px] flex items-center justify-center transition-all duration-300 transform hover:bg-blue-700 active:scale-95 border border-blue-400/30 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`} title="回到最頂端">
            <Icon name="arrow-up" size={24} />
        </button>
    );
};

export const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showBtn, setShowBtn] = useState(false);
    useEffect(() => {
        const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); setShowBtn(true); };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') console.log('User accepted');
        setDeferredPrompt(null);
        setShowBtn(false);
    };
    if (!showBtn) return null;
    return (
        <button onClick={handleInstallClick} className="fixed left-4 bottom-24 z-50 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 animate-fade-in-up border border-blue-400/30 backdrop-blur-sm">
            <Icon name="download" size={18} /><span className="text-sm font-bold tracking-wide">安裝 APP</span>
        </button>
    );
};