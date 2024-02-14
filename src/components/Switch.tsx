import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeProvider'
import './Switch.css'

interface SwitchProps {
  text: string
  classes?: string
  isOn?: boolean
  handleToggle?: () => void
  onColor?: string
}

const Switch: React.FC<SwitchProps> = ({
  text,
  classes = '',
  isOn = true,
  onColor
}) => {
  const { theme , setTheme } = useTheme()
  const [darkMode, setDarkMode] = useState(theme === 'dark' ? true : false)

  const changeTheme = () => {
    if(darkMode) {
      setTheme('light')
    } else {
      setTheme('dark')
    }
    setDarkMode((darkMode) => !darkMode)
  }

  return (
    <div className={classes}>
      <span className='react-switch-text mt-0.5 mr-4'>{text}</span>
      <input
        checked={darkMode}
        onChange={changeTheme}
        className='react-switch-checkbox'
        id={`react-switch-new`}
        type='checkbox'
      />
      <label
        style={{ backgroundColor: isOn ? onColor : '' }}
        className='react-switch-label'
        htmlFor={`react-switch-new`}>
        <span className={`react-switch-button`} />
      </label>
    </div>
  )
}

export default Switch
