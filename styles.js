// styles.js

// Design Tokens
const colors = {
    primary: '#3498db',
    secondary: '#2ecc71',
    danger: '#e74c3c',
    warning: '#f1c40f',
};

const spacing = {
    small: '8px',
    medium: '16px',
    large: '24px',
};

// Reusable Style Objects
const buttonStyles = {
    padding: `${spacing.medium} ${spacing.large}`,
    borderRadius: '4px',
    color: colors.primary,
    backgroundColor: colors.secondary,
    border: 'none',
    cursor: 'pointer',
};

export { colors, spacing, buttonStyles };