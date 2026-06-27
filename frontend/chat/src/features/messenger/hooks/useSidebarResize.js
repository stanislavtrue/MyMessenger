export const useSidebarResize = ( sidebarWidth, setSidebarWidth ) => {
    const handleMouseDown = (e) => {
        e.preventDefault();
        
        const startX = e.clientX;
        const startWidth = sidebarWidth;

        const handleMouseMove = (e) => {
            const delta = e.clientX - startX;
            
            const newWidth = startWidth + (delta / window.innerWidth) * 100;

            if (newWidth >= 18 && newWidth <= 26) {
                setSidebarWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return { handleMouseDown };
}
