import React from 'react'

interface ButtonProps {
  text: string
  handleClick: () => void
}

const Button: React.FC<ButtonProps> = ({ text, handleClick }) => {
  return <button onClick={handleClick}>{text}</button>
}

export default Button
