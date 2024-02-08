import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Button from '../components/Button'

const handleClick = jest.fn()

test('renders a button with correct text', () => {
  render(<Button text='Read me' handleClick={handleClick} />)
  const buttonElement = screen.getByText('Read me')
  expect(buttonElement).toBeInTheDocument()
})

test('calls handleClick function when button is clicked', () => {
  render(<Button text='Click me' handleClick={handleClick} />)
  const buttonElement = screen.getByText('Click me')
  fireEvent.click(buttonElement)
  expect(handleClick).toHaveBeenCalledTimes(1)
})
