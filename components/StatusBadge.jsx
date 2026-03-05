import React from 'react';
import PropTypes from 'prop-types';

/**
 * StatusBadge component displays the stock status of a product.
 * @param {Object} props - Component props
 * @param {number} props.stock - The current stock level of the product
 * @returns {JSX.Element} Rendered StatusBadge component
 */
const StatusBadge = ({ stock }) => {
    let status;
    let style;

    // Determine status and style based on stock level
    if (stock > 10) {
        status = 'In Stock';
        style = { backgroundColor: 'green', color: 'white' };
    } else if (stock > 0) {
        status = 'Low Stock';
        style = { backgroundColor: 'yellow', color: 'black' };
    } else {
        status = 'Out of Stock';
        style = { backgroundColor: 'red', color: 'white' };
    }

    return (
        <span style={{ padding: '5px 10px', borderRadius: '5px', ...style }}>
            {status}
        </span>
    );
};

StatusBadge.propTypes = {
    stock: PropTypes.number.isRequired,
};

export default StatusBadge;