import React from "react";

type MarkerButtonProps = {
    onClick: () => void;
    label: string;
    style?: React.CSSProperties;
};

export const MarkerButton = ({ onClick, label, style }: MarkerButtonProps) => (
    <button onClick={onClick} className="remove-pin-button" style={style}>
        {label}
    </button>
);
