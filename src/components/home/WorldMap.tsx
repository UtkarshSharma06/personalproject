import React, { memo } from 'react';

const WorldMap: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <img
            src="/world_map.svg"
            alt="World Map"
            className={`object-contain w-full h-full ${className}`}
            loading="lazy"
        />
    );
};

export default memo(WorldMap);
