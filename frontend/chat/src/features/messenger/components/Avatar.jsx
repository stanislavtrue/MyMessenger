const gradients = [
    "from-purple-500 to-purple-600",
    "from-cyan-500 to-cyan-600",
    "from-green-500 to-green-600",
    "from-orange-500 to-orange-600",
    "from-indigo-400 to-indigo-500",
    "from-blue-400 to-blue-500",
];

const getGradient = (name) => {
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
};

export const Avatar = ({ name, avatar, size = "size-14"}) => {
    if (avatar) {
        return (
            <img 
                src={avatar}
                alt={name}
                className={`${size} rounded-full aspect-square shrink-0 object-cover`}
            />
        );
    }

    return (
        <div 
            className={`
                ${size}
                rounded-full
                flex items-center justify-center
                text-white text-2xl! text-semibold!
                bg-linear-to-b
                ${getGradient(name)}
            `}
        >
            {name[0].toUpperCase()}
        </div>
    );
};
