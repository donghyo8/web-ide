import React from 'react'
import PropTypes from 'prop-types'
import './Button.scss'

const STYLES = [
    'btn--primary',
    'btn--warning',
    'btn--danger',
    'btn--sucess',
    'btn--primary-outline',
    'btn--waring-outline',
    'btn--danger-outline',
    'btn--sucess-outline'
]

const SIZES = ['small','medium']
function Button({
    children,
    onClick,
    className,
    size
}) {
    const checkButtonStyle = STYLES.includes(className) ? className : STYLES[0];
    const checkButtonSize = SIZES.includes(size) ? size : SIZES[0];
    return (
        <button
        className={`btn ${checkButtonStyle} ${checkButtonSize}`}
        onClick = {onClick}
        >
        {children}
        </button>
    )
}

Button.propTypes = {

}

export default Button

