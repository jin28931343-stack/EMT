import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import ZoomableImage from './ZoomableImage';

// 高亮文字組件
const HighlightText = ({ text, highlight }) => {
    if (!highlight || !text) return <>{text}</>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <span key={i} className="search-match bg-yellow-300 text-black font-bold px-0.5 rounded-sm shadow-sm decoration-clone">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </>
    );
};

// 標籤樣式輔助
const getTagColor = (code) => {
    if (code === 'Law') return 'bg-amber-100 text-amber-800 border-amber-200';
    if (code === 'Procedure') return 'bg-orange-100 text-orange-800 border-orange-200';
    if (code.startsWith('C')) return 'bg-gray-100 text-gray-700 border-gray-200';
    if (code.startsWith('M')) return 'bg-green-50 text-green-700 border-green-200';
    if (code.startsWith('T')) return 'bg-red-50 text-red-700 border-red-200';
    if (code.startsWith('S')) return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
};

const getIcon = (code) => {
    if (code === 'Law') return 'gavel';
    if (code === 'Procedure') return 'file-text';
    if (code.startsWith('C') || code.startsWith('S')) return 'shield';
    if (code.startsWith('M')) return 'stethoscope';
    if (code.startsWith('T')) return 'alert-circle';
    return 'activity';
};

// 文字縮排邏輯
const getContentClass = (text) => {
    const listPattern = /^[\s　]*([0-9A-Za-z]+[\.\)．]|[\(（][0-9A-Za-z一二三四五六七八九十０-９]+[\)）]|註[0-9]+[：:]|[一二三四五六七八九十壹貳參肆伍陸柒捌玖拾]+[、\.．])/;
    const match = text.match(listPattern);
    let className = "block text-justify leading-relaxed ";
    if (text.startsWith('　')) className += "text-gray-700 ";
    else className += "text-gray-900 ";

    if (match) {
        const marker = match[0];
        let width = 0;
        for (let i = 0; i < marker.length; i++) {
            width += marker.charCodeAt(i) > 127 ? 1.0 : 0.55;
        }
        const emValue = width.toFixed(2);
        className += `pl-[${emValue}em] indent-[-${emValue}em]`;
    } else if (text.startsWith('　')) {
        className += "pl-[2em] indent-0";
    }
    return className;
};

const ContentRenderer = ({ content, searchTerm }) => {
    return content.map((para, idx) => {
        if (para.startsWith('IMAGE:')) {
            const imgSrc = para.replace('IMAGE:', '');
            const isQRCode = imgSrc.includes('QRcode.png');
            return (
                <div key={idx} className="w-full flex justify-center my-3">
                    <ZoomableImage
                        src={imgSrc}
                        alt="示意圖"
                        className={`${isQRCode ? 'max-w-[150px]' : 'max-w-full'} h-auto object-contain border border-gray-200 rounded`}
                    />
                </div>
            );
        }
        if (para.trim().match(/^【.+】$/)) {
            return (
                <div key={idx} className="mt-4 mb-2">
                    <span className="inline-block bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded border-l-4 border-blue-600 text-base shadow-sm">
                        <HighlightText text={para} highlight={searchTerm} />
                    </span>
                </div>
            );
        }
        if (para.trim() === '') return <div key={idx} className="h-3"></div>;

        const extraClass = para.includes('[P]') ? "text-gray-900" : "";
        const segments = para.split(/(\[P\]|\*)/g);

        const BadgeP = () => (
             <span className="inline-flex items-center justify-center bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded mx-1 border border-purple-200 align-middle">EMT-P</span>
        );
        const BadgeOrder = () => (
             <span className="inline-flex items-center justify-center bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded mx-1 border border-red-200 align-middle">線上醫囑</span>
        );

        return (
            <div key={idx} className={`${getContentClass(para)} ${extraClass} relative`}>
                {segments.map((segment, segIdx) => {
                    if (segment === '[P]') return <BadgeP key={segIdx} />;
                    if (segment === '*') return <BadgeOrder key={segIdx} />;
                    return segment.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                        part.match(/^https?:\/\//) ? (
                            <a key={`${segIdx}-${i}`} href={part} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800 break-all" onClick={e => e.stopPropagation()}>
                                {part}
                            </a>
                        ) : (
                            <HighlightText key={`${segIdx}-${i}`} text={part} highlight={searchTerm} />
                        )
                    );
                })}
            </div>
        );
    });
};


const GuidelineCard = ({ item, isExpanded, toggleExpand, searchTerm }) => {
    const [expandedSubItems, setExpandedSubItems] = useState({});
    const [expandedGrandChildItems, setExpandedGrandChildItems] = useState({});

    // 搜尋自動展開邏輯
    useEffect(() => {
        if (searchTerm && item.subItems) {
            const newExpandedSub = {};
            const newExpandedGrand = {};
            const lowerTerm = searchTerm.toLowerCase();

            item.subItems.forEach(sub => {
                let subMatch = false;
                if (sub.title.toLowerCase().includes(lowerTerm)) subMatch = true;
                if (sub.content && sub.content.some(c => c.toLowerCase().includes(lowerTerm))) subMatch = true;

                if (sub.grandChildItems) {
                    sub.grandChildItems.forEach(gc => {
                        let gcMatch = false;
                        if (gc.title.toLowerCase().includes(lowerTerm)) gcMatch = true;
                        if (gc.code && gc.code.toLowerCase().includes(lowerTerm)) gcMatch = true;
                        if (gc.content.some(c => c.toLowerCase().includes(lowerTerm))) gcMatch = true;
                        if (gcMatch) {
                            newExpandedGrand[gc.id] = true;
                            subMatch = true;
                        }
                    });
                }
                if (subMatch) newExpandedSub[sub.id] = true;
            });
            setExpandedSubItems(newExpandedSub);
            setExpandedGrandChildItems(newExpandedGrand);
        } else if (!searchTerm) {
             setExpandedSubItems({});
             setExpandedGrandChildItems({});
        }
    }, [searchTerm, item]);

    const toggleSubItem = (subId, e) => {
        e.stopPropagation();
        setExpandedSubItems(prev => (prev[subId] ? {} : { [subId]: true }));
    };

    const toggleGrandChildItem = (grandChildId, e) => {
        e.stopPropagation();
        setExpandedGrandChildItems(prev => (prev[grandChildId] ? {} : { [grandChildId]: true }));
    };

    if (item.isParent) {
        return (
            <div className={`relative z-10 mb-3 overflow-hidden rounded-xl border transition-all duration-300 ${isExpanded ? 'border-orange-400 shadow-md bg-white ring-1 ring-orange-100' : 'border-slate-200 bg-white/95 hover:bg-white shadow-sm'}`}>
                <button onClick={toggleExpand} className="flex w-full items-center justify-between p-4 text-left focus:outline-none">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isExpanded ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-600'}`}>
                            <Icon name={getIcon(item.code)} size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getTagColor(item.code)}`}>
                                    <HighlightText text={item.category.split('、')[0]} highlight={searchTerm} />
                                </span>
                                <span className="text-xs font-medium text-gray-500">
                                    <HighlightText text={item.category} highlight={searchTerm} />
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 leading-tight">
                                <HighlightText text={item.title} highlight={searchTerm} />
                            </h3>
                        </div>
                    </div>
                    {isExpanded ? <Icon name="chevron-up" className="text-orange-500 shrink-0 ml-2" /> : <Icon name="chevron-down" className="text-gray-400 shrink-0 ml-2" />}
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[30000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="border-t border-gray-100 bg-orange-50/30 p-2 md:p-4 space-y-2">
                        {item.subItems.map((subItem) => (
                            <div key={subItem.id} className="border border-orange-200 rounded-lg bg-white overflow-hidden">
                                <button onClick={(e) => toggleSubItem(subItem.id, e)} className="flex w-full items-center justify-between p-3 text-left hover:bg-orange-50/50 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0"></div>
                                        <span className="font-medium text-gray-700">
                                            <HighlightText text={subItem.title} highlight={searchTerm} />
                                        </span>
                                    </div>
                                    {expandedSubItems[subItem.id] ? <Icon name="minus" size={16} className="text-orange-400" /> : <Icon name="plus" size={16} className="text-gray-400" />}
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ${expandedSubItems[subItem.id] ? 'max-h-[20000px] opacity-100 border-t border-orange-100' : 'max-h-0 opacity-0'}`}>
                                    {((subItem.content && subItem.content.length > 0) || subItem.image) && (
                                        <div className={`p-4 bg-gray-50 text-base text-gray-800 ${subItem.alignment === 'center' ? 'text-center' : 'text-left'} ${subItem.scrollable ? 'max-h-64 overflow-y-auto custom-scrollbar' : ''}`}>
                                            {subItem.type === 'text' ? (
                                                <div className="space-y-4 leading-relaxed">
                                                    <ContentRenderer content={subItem.content} searchTerm={searchTerm} />
                                                </div>
                                            ) : (
                                                 <ol className="list-list-none ml-5 space-y-1">
                                                     {/* 簡化邏輯，若有需要請自行補上 list 模式的渲染 */}
                                                     {subItem.content.map((c, idx) => <li key={idx}><HighlightText text={c} highlight={searchTerm} /></li>)}
                                                 </ol>
                                            )}
                                            {subItem.image && <div className="mt-4 w-full"><ZoomableImage src={subItem.image} alt="illustration" className="w-full h-auto object-contain border border-gray-200 rounded bg-white" /></div>}
                                            {subItem.bottomImage && <div className="mt-4 w-full flex justify-center"><ZoomableImage src={subItem.bottomImage} alt="illustration" className="max-w-full h-auto object-contain border border-gray-200 rounded bg-white" /></div>}
                                            {subItem.bottomImage2 && <div className="mt-4 w-full flex justify-center"><ZoomableImage src={subItem.bottomImage2} alt="illustration" className="max-w-full h-auto object-contain border border-gray-200 rounded bg-white" /></div>}
                                            {subItem.note && <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">註: {subItem.note}</div>}
                                        </div>
                                    )}

                                    {/* GrandChild Items */}
                                    {subItem.grandChildItems && (
                                        <div className="p-2 bg-gray-50 space-y-2 border-t border-gray-100">
                                            {subItem.grandChildItems.map((grandChild) => (
                                                <div key={grandChild.id} className="border border-gray-200 rounded bg-white">
                                                    <button onClick={(e) => toggleGrandChildItem(grandChild.id, e)} className="flex w-full items-center justify-between p-3 text-left hover:bg-blue-50 transition-colors">
                                                        <div className="flex items-center gap-2">
                                                            <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded border border-gray-200 font-mono">{grandChild.code}</span>
                                                            <span className="text-sm font-medium text-gray-800"><HighlightText text={grandChild.title} highlight={searchTerm} /></span>
                                                        </div>
                                                        {expandedGrandChildItems[grandChild.id] ? <Icon name="chevron-up" size={14} className="text-blue-500" /> : <Icon name="chevron-down" size={14} className="text-gray-400" />}
                                                    </button>
                                                    <div className={`overflow-hidden transition-all duration-300 ${expandedGrandChildItems[grandChild.id] ? 'max-h-[10000px] opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'}`}>
                                                        <div className="p-3 bg-slate-50 text-sm text-gray-600">
                                                            {grandChild.image && <div className="mb-4 w-full"><ZoomableImage src={grandChild.image} alt={grandChild.title} className="w-full h-auto object-contain border border-gray-200 rounded" /></div>}
                                                            {grandChild.image2 && <div className="mb-4 w-full"><ZoomableImage src={grandChild.image2} alt={grandChild.title} className="w-full h-auto object-contain border border-gray-200 rounded" /></div>}
                                                            
                                                            <div className="space-y-2 text-justify">
                                                                <ContentRenderer content={grandChild.content} searchTerm={searchTerm} />
                                                            </div>

                                                            {grandChild.note && <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-100 flex gap-1"> <Icon name="info" size={14} className="shrink-0 mt-0.5" /><div><span className="font-bold">注意：</span><HighlightText text={grandChild.note} highlight={searchTerm} /></div></div>}
                                                            {grandChild.bottomImage && <div className="mt-4 w-full flex justify-center"><ZoomableImage src={grandChild.bottomImage} alt={grandChild.title} className="max-w-full h-auto object-contain border border-gray-200 rounded" /></div>}
                                                            {grandChild.bottomImage2 && <div className="mt-4 w-full flex justify-center"><ZoomableImage src={grandChild.bottomImage2} alt={grandChild.title} className="max-w-full h-auto object-contain border border-gray-200 rounded" /></div>}
                                                            
                                                            <button onClick={(e) => toggleGrandChildItem(grandChild.id, e)} className="w-full mt-3 flex items-center justify-center gap-2 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 text-xs font-medium transition-colors rounded-lg">
                                                                <Icon name="chevron-up" size={12} /><span>收起「{grandChild.title}」</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <button onClick={(e) => toggleSubItem(subItem.id, e)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 border-t border-gray-100 text-gray-500 hover:text-gray-700 text-xs font-medium transition-colors">
                                        <Icon name="chevron-up" size={14} /><span>收起「{subItem.title}」</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                         <button onClick={(e) => { e.stopPropagation(); toggleExpand(); }} className="w-full mt-2 flex items-center justify-center gap-2 py-3 text-sm font-medium text-orange-700 bg-orange-50/50 hover:bg-orange-100 rounded-lg border border-dashed border-orange-300 transition-all">
                            <Icon name="chevron-up" size={16} /><span>收起「{item.category.split('、')[0]}」目錄</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Standard Item render (Law etc.)
    return (
         <div className={`relative z-10 mb-3 overflow-hidden rounded-xl border transition-all duration-300 ${isExpanded ? 'border-blue-500 shadow-md bg-white ring-1 ring-blue-200' : 'border-slate-200 bg-white/95 hover:bg-white shadow-sm'}`}>
             <button onClick={toggleExpand} className="flex w-full items-center justify-between p-4 text-left focus:outline-none">
                 <div className="flex items-center gap-3">
                     <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isExpanded ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                         <Icon name={getIcon(item.code)} size={20} />
                     </div>
                     <div>
                         <div className="flex items-center gap-2 mb-1">
                             <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getTagColor(item.code)}`}><HighlightText text={item.code === 'Law' ? '壹、依據' : item.code} highlight={searchTerm} /></span>
                             <span className="text-xs font-medium text-gray-500"><HighlightText text={item.category} highlight={searchTerm} /></span>
                         </div>
                         <h3 className="text-lg font-bold text-gray-800 leading-tight"><HighlightText text={item.title} highlight={searchTerm} /></h3>
                     </div>
                 </div>
                 {isExpanded ? <Icon name="chevron-up" className="text-blue-500 shrink-0 ml-2" /> : <Icon name="chevron-down" className="text-gray-400 shrink-0 ml-2" />}
             </button>
             <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="border-t border-gray-100 bg-slate-50/80 p-4">
                    {item.code === 'Law' ? (
                        <div className="space-y-4 text-gray-700 leading-relaxed text-justify px-2">
                            {item.content.map((para, idx) => <p key={idx} className="indent-8 font-serif text-lg"><HighlightText text={para} highlight={searchTerm} /></p>)}
                        </div>
                    ) : (
                         <ol className="ml-5 list-decimal space-y-3 text-gray-700">
                             {item.content.length > 0 ? item.content.map((step, idx) => <li key={idx} className="pl-1 leading-relaxed"><HighlightText text={step} highlight={searchTerm} /></li>) : <li className="pl-1 leading-relaxed text-gray-400 italic">內容待補</li>}
                         </ol>
                    )}
                    {item.note && <div className="mt-4 flex gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 border border-amber-200"><Icon name="info" size={18} className="shrink-0 mt-0.5 text-amber-600" /><div><strong className="block mb-1 text-amber-900">注意事項：</strong><HighlightText text={item.note} highlight={searchTerm} /></div></div>}
                    <button onClick={(e) => { e.stopPropagation(); toggleExpand(); }} className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm font-medium text-blue-600 bg-blue-50/50 hover:bg-blue-100 rounded-lg border border-dashed border-blue-200 transition-all"><Icon name="chevron-up" size={16} /><span>收起</span></button>
                </div>
             </div>
         </div>
    );
};

export default GuidelineCard;