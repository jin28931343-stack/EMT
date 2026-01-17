import React, { useState, useMemo, useEffect } from 'react';
import Icon from './components/Icon';
import GuidelineCard from './components/GuidelineCard';
import { FontSizeControl, ScrollToTop, InstallPWA } from './components/Helpers';
import { PrefaceModal, AuthorModal } from './components/Modals';
import { guidelinesData } from './data/guidelinesData';

const StarOfLifeBackground = () => (
    <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center opacity-20 overflow-hidden">
        <img src="./PIC/EMT.png" alt="背景圖" className="w-auto h-auto object-contain" />
    </div>
);

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [showPreface, setShowPreface] = useState(false);
    const [showAuthors, setShowAuthors] = useState(false);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
    const [totalMatches, setTotalMatches] = useState(0);
    const [fontScale, setFontScale] = useState(1);

    // 禁用右鍵
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, []);

    // 字體縮放控制
    const handleFontScaleChange = (scale) => {
        setFontScale(scale);
        document.documentElement.style.fontSize = `${100 * scale}%`;
    };

    // 搜尋結果計算
    useEffect(() => {
        setCurrentMatchIndex(-1);
        setTotalMatches(0);
        if (searchTerm) {
            const timer = setTimeout(() => {
                const matches = document.querySelectorAll('.search-match');
                setTotalMatches(matches.length);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [searchTerm]);

    // 搜尋跳轉
    const scrollToMatch = (direction) => {
        const matches = document.querySelectorAll('.search-match');
        if (matches.length === 0) return;
        let newIndex;
        if (direction === 'next') {
            newIndex = currentMatchIndex + 1;
            if (newIndex >= matches.length) newIndex = 0;
        } else {
            newIndex = currentMatchIndex - 1;
            if (newIndex < 0) newIndex = matches.length - 1;
        }
        setCurrentMatchIndex(newIndex);
        matches.forEach(m => m.style.outline = 'none');
        const target = matches[newIndex];
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const filteredData = useMemo(() => {
        if (!searchTerm) return guidelinesData;
        const lowerTerm = searchTerm.toLowerCase();
        return guidelinesData.filter(item =>
            item.title.toLowerCase().includes(lowerTerm) ||
            item.code.toLowerCase().includes(lowerTerm) ||
            item.keywords.some(k => k.toLowerCase().includes(lowerTerm)) ||
            (item.content && item.content.some(c => c.toLowerCase().includes(lowerTerm))) ||
            (item.subItems && item.subItems.some(sub =>
                sub.title.toLowerCase().includes(lowerTerm) ||
                (sub.content && sub.content.some(c => c.toLowerCase().includes(lowerTerm))) ||
                (sub.grandChildItems && sub.grandChildItems.some(gc => 
                    gc.title.toLowerCase().includes(lowerTerm) || 
                    (gc.code && gc.code.toLowerCase().includes(lowerTerm)) || 
                    gc.content.some(c => c.toLowerCase().includes(lowerTerm))
                ))
            ))
        );
    }, [searchTerm]);

    const handleToggle = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-gray-900 selection:bg-blue-200">
            <StarOfLifeBackground />
            <PrefaceModal isOpen={showPreface} onClose={() => setShowPreface(false)} />
            <AuthorModal isOpen={showAuthors} onClose={() => setShowAuthors(false)} />
            
            <FontSizeControl onScaleChange={handleFontScaleChange} />
            <ScrollToTop />
            <InstallPWA />

            <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
                <div className="mx-auto max-w-4xl px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
                        {/* Logo */}
                        <div className="flex items-center gap-3 shrink-0 order-1">
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-900 shadow-md border-2 border-blue-200 overflow-hidden">
                                <img src="./PIC/119.png" alt="Logo" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-wide leading-none">臺南市政府消防局</h1>
                                <p className="text-xs text-blue-200 font-medium tracking-wider">緊急救護指引 (114年版)</p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0 order-2 md:order-3 ml-auto md:ml-0">
                            <button onClick={() => setShowPreface(true)} className="flex items-center gap-1.5 rounded-lg bg-blue-700/50 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600/80 transition-all border border-blue-400/30 backdrop-blur-sm">
                                <Icon name="book-open" size={14} /><span>書序</span>
                            </button>
                            <button onClick={() => setShowAuthors(true)} className="flex items-center gap-1.5 rounded-lg bg-blue-700/50 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600/80 transition-all border border-blue-400/30 backdrop-blur-sm">
                                <Icon name="users" size={14} /><span>作者群</span>
                            </button>
                        </div>

                        {/* Search Bar (Modified Area) */}
                        <div className="relative flex-1 min-w-[100%] md:min-w-[260px] order-3 md:order-2">
                            <input 
                                type="text" 
                                placeholder="搜尋代碼 (C1, M7...), 症狀或關鍵字..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                // Padding-right set to pr-44 to accommodate larger buttons
                                className="w-full rounded-xl border-none bg-blue-950/40 py-2.5 pl-10 pr-44 text-white placeholder-blue-300/70 outline-none ring-1 ring-blue-400/30 backdrop-blur-sm focus:bg-blue-950/60 focus:ring-2 focus:ring-blue-300/50 transition-all shadow-inner text-sm" 
                            />
                            <Icon name="search" className="absolute left-3 top-2.5 h-5 w-5 text-blue-300" />
                            
                            <div className="absolute right-2 top-1.5 flex items-center gap-1">
                                {searchTerm && (
                                    <>
                                        <span className="text-[10px] font-mono text-blue-200 mr-1 min-w-[24px] text-center select-none">
                                            {totalMatches > 0 ? `${currentMatchIndex + 1}/${totalMatches}` : '0'}
                                        </span>
                                        <button 
                                            onClick={() => scrollToMatch('prev')}
                                            className="p-2 h-9 w-9 flex items-center justify-center rounded bg-blue-800/60 hover:bg-blue-600 text-blue-100 transition-colors border border-blue-700/50"
                                            title="上一個結果"
                                        >
                                            <Icon name="chevron-up" size={20} />
                                        </button>
                                        <button 
                                            onClick={() => scrollToMatch('next')}
                                            className="p-2 h-9 w-9 flex items-center justify-center rounded bg-blue-800/60 hover:bg-blue-600 text-blue-100 transition-colors border border-blue-700/50"
                                            title="下一個結果"
                                        >
                                            <Icon name="chevron-down" size={20} />
                                        </button>
                                        <button 
                                            onClick={() => setSearchTerm('')} 
                                            className="p-1 rounded-full hover:bg-red-500/20 text-blue-300 hover:text-red-200 ml-1 transition-colors"
                                            title="清除搜尋"
                                        >
                                            <Icon name="x" size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative mx-auto max-w-3xl px-4 py-6 pb-24">
                <div className="mb-4 flex items-center justify-between px-1 text-sm text-gray-500 font-medium">
                    <span>指引總數: {guidelinesData.length}</span>
                    {searchTerm && <span className="text-blue-600">搜尋結果: {filteredData.length} 筆</span>}
                </div>
                <div className="space-y-3">
                    {filteredData.length > 0 ? (
                        filteredData.map(item => (
                            <GuidelineCard
                                key={item.id}
                                item={item}
                                isExpanded={searchTerm ? true : expandedId === item.id}
                                toggleExpand={() => handleToggle(item.id)}
                                searchTerm={searchTerm}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                            <div className="rounded-full bg-gray-200 p-4 mb-3"><Icon name="search" size={32} className="text-gray-400" /></div>
                            <p className="text-lg font-medium text-gray-600">找不到符合的指引</p>
                            <p className="text-sm mb-4">請嘗試搜尋 "CPR", "骨折", "M7" 等關鍵字</p>
                            <button onClick={() => setSearchTerm('')} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm">清除搜尋</button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;