import { BrowserRouter } from 'react-router-dom'

import { render } from '@testing-library/react'

import App from '../App'
import { TokenProvider } from '../contexts/TokenContext'

test('renders the app without errors', () => {
  render(
    <TokenProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TokenProvider>
  )
})
