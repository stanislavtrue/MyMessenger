import { useState } from "react";

export const useSidebarResize = ( sidebarWidth, setSidebarWidth ) => {
    const [isResizing, setIsResizing] = useState(false);

    const handleMouseDown = (e) => {
        e.preventDefault();

        setIsResizing(true);
        
        const startX = e.clientX;
        const startWidth = sidebarWidth;

        const handleMouseMove = (e) => {
            const delta = e.clientX - startX;
            
            const newWidth = startWidth + (delta / window.innerWidth) * 100;

            if (newWidth >= 13 && newWidth <= 33) {
                setSidebarWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return { handleMouseDown, isResizing };
}
