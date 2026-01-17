import React from 'react';
import Icon from './Icon';

export const PrefaceModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-blue-950/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 transition-colors"><Icon name="x" size={20} /></button>
                <div className="p-8 md:p-10">
                    <div className="mb-8 text-center border-b pb-4 border-gray-100">
                        <h2 className="text-3xl font-bold text-blue-900 tracking-wider">書序</h2>
                        <p className="text-sm text-gray-500 mt-2">Bureau Director's Preface</p>
                    </div>
                    <div className="space-y-6 text-gray-700 leading-relaxed text-justify text-lg font-serif">
                        <p className="indent-8">隨著時代進步與醫療科技的發展，緊急救護的標準與技術也不斷演進。院前緊急救護是守護市民生命安全的重要環節，臺南市政府消防局始終秉持「專業、精進、服務」的精神，持續提升救護品質，精進人員技能，以確保傷病患在黃金救命時間內獲得最適切的處置。</p>
                        <p className="indent-8">本局自推動高級救護技術以來，積極培訓專業人員，至今高級救護技術員 (EMT-P) 比例已由103年的15.6%提升至18.7%，確保各分隊皆有足夠高級救護人員執行高級救命術 (ALS)，大幅提升本市院前救護的整體水準。而為了使本局救護人員能夠與時俱進、精準執行救護技術，我們特別編纂本書《到院前各級救護技術員緊急救護操作指引》，作為第一線救護人員的實務參考。</p>
                        <p className="indent-8">本書內容由本局緊急救護教官群在醫療指導醫師的專業指導下共同編撰，依據最新的國際救護指引，結合本市救護經驗，詳盡整理各級救護技術員應具備的技能與標準操作程序，務求讓每一位救護人員皆能熟練應用，確保執勤時能提供最優質的院前急救服務。</p>
                        <p className="indent-8">救護工作是一場與時間競賽的使命，而專業的技術與標準化的作業流程，正是守護生命最堅實的後盾。期待本書能成為各級救護技術員的實務指南，進一步提升臺南市院前緊急救護的效能，為市民帶來更安全、更完善的緊急醫療服務。</p>
                    </div>
                    <div className="mt-12 flex flex-col items-end gap-2 text-right">
                        <p className="text-xl font-bold text-blue-900">臺南市政府消防局局長</p>
                        <div className="py-2">
                            <img src="/PIC/Director.png" alt="局長李明峯簽名" className="h-20 w-auto object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML += '<div class="text-3xl font-serif font-black tracking-widest text-gray-800 py-2 border-b-2 border-red-500">李明峯</div>'; }} />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">中華民國114年6月</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AuthorModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-blue-950/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 transition-colors"><Icon name="x" size={20} /></button>
                <div className="p-8">
                    <div className="mb-6 text-center border-b pb-4 border-gray-100">
                        <h2 className="text-2xl font-bold text-blue-900 tracking-wider">作者群</h2>
                        <p className="text-sm text-gray-500 mt-1">Editorial Committee</p>
                    </div>
                    <div className="space-y-6 text-gray-700">
                        <div><h3 className="text-lg font-bold text-gray-800 mb-2">臺南市政府消防局各級救護技術員到院前緊急救護作業參考指引</h3></div>
                        <div className="text-sm space-y-2">
                            <p><span className="font-bold">出版單位：</span>臺南市政府消防局</p>
                            <p><span className="font-bold">召集人：</span>李明峯</p>
                            <p><span className="font-bold">副召集人：</span>李政昌、楊宗林、丁春能</p>
                            <p><span className="font-bold">總編輯：</span>臺南市政府消防局緊急醫療指導醫師暨醫療顧問團</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <h4 className="font-bold text-blue-800 mb-2 border-b border-blue-200 pb-1">主編</h4>
                                <p className="text-gray-700 text-sm">林毅、陳冠傑、張鴻傑、蔡長志、顏維廷、蘇士雄</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <h4 className="font-bold text-blue-800 mb-2 border-b border-blue-200 pb-1">編輯</h4>
                                <div className="text-sm text-gray-700 leading-relaxed">王健宇、李鎮宇、李穎勳、李致穎、李俊信、邱建銘、吳青翰、吳晨瑋、沈宥延、邱柏惟、林弘瑋、林威廷、陳信義、陳鵬文、陳怡娟、陳怡婕、陳世欽、黃振彬、黃國典、黃冠庭、蔡承翰、蘇士哲</div>
                            </div>
                            <div className="text-sm space-y-1 mt-2">
                                <p><span className="font-bold">地址：</span>臺南市安平區永華路二段 898 號</p>
                                <p><span className="font-bold">電話：</span>(06)-297-5119</p>
                                <p><span className="font-bold">網址：</span>119.tainan.gov.tw</p>
                                <p><span className="font-bold">出版日期：</span>2025 年 月 日</p>
                            </div>
                            <div className="text-center text-xs text-gray-400 mt-4"><p>臺南市政府消防局 版權所有</p><p>Copyright © 2025 Tainan City Fire Bureau.</p></div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            );
};