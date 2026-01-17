import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';

const ZoomableImage = ({ src, alt, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef(null);

    const resetControlsTimer = useCallback(() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 3000);
    }, []);

    const handleOpen = (e) => {
        e.stopPropagation();
        setIsOpen(true);
        setZoomLevel(1);
        setShowControls(true);
        document.body.style.overflow = 'hidden';
    };

    const handleClose = (e) => {
        e.stopPropagation();
        setIsOpen(false);
        document.body.style.overflow = '';
    };

    const handleZoomIn = (e) => {
        e.stopPropagation();
        resetControlsTimer();
        setZoomLevel(prev => Math.min(prev + 0.5, 4));
    };

    const handleZoomOut = (e) => {
        e.stopPropagation();
        resetControlsTimer();
        setZoomLevel(prev => Math.max(prev - 0.5, 1));
    };

    const handleInteraction = () => {
        resetControlsTimer();
    };

    return (
        <>
            <img
                src={src}
                alt={alt}
                className={`${className} cursor-pointer hover:opacity-95 transition-opacity`}
                onClick={handleOpen}
            />
            {isOpen && createPortal(
                <div
                    className="fixed inset-0 z-[9999] bg-black/95 flex flex-col animate-fade-in-up"
                    onClick={handleClose}
                    onMouseMove={handleInteraction}
                    onTouchStart={handleInteraction}
                >
                    <div className={`absolute top-0 left-0 right-0 p-4 flex justify-end items-center z-50 pointer-events-none transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                        <button
                            onClick={handleClose}
                            className="pointer-events-auto bg-black/20 text-white/80 hover:text-white rounded-full p-2 backdrop-blur-[2px] transition-all"
                        >
                            <Icon name="x" size={32} />
                        </button>
                    </div>

                    <div className="flex-1 w-full h-full overflow-auto flex items-center justify-center p-2" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={src}
                            alt={alt}
                            style={{
                                width: zoomLevel === 1 ? 'auto' : `${zoomLevel * 100}%`,
                                maxWidth: zoomLevel === 1 ? '100%' : 'none',
                                maxHeight: zoomLevel === 1 ? '100%' : 'none',
                                transform: zoomLevel === 1 ? 'none' : 'scale(1)',
                            }}
                            className="object-contain transition-all duration-200 ease-out"
                        />
                    </div>

                    <div className={`absolute bottom-8 right-6 flex flex-col gap-2 z-50 pointer-events-auto items-center transition-opacity duration-500 ease-in-out ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <button onClick={handleZoomIn} className={`w-6 h-6 rounded-full bg-black/20 backdrop-blur-[2px] text-white flex items-center justify-center shadow-sm transition-all ${zoomLevel >= 4 ? 'opacity-30 cursor-not-allowed' : 'active:bg-blue-600/60'}`} disabled={zoomLevel >= 4}>
                            <Icon name="plus" size={14} />
                        </button>
                        <div className="flex items-center justify-center">
                            <span className="text-white/90 font-mono font-bold text-[9px] drop-shadow-md">{Math.round(zoomLevel * 100)}%</span>
                        </div>
                        <button onClick={handleZoomOut} className={`w-6 h-6 rounded-full bg-black/20 backdrop-blur-[2px] text-white flex items-center justify-center shadow-sm transition-all ${zoomLevel <= 1 ? 'opacity-30 cursor-not-allowed' : 'active:bg-blue-600/60'}`} disabled={zoomLevel <= 1}>
                            <Icon name="minus" size={14} />
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default ZoomableImage;