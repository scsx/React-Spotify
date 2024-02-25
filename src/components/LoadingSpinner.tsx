import { RiLoader4Line } from 'react-icons/ri'

const LoadingSpinner = () => {
  return (
    <div className='relative w-24 h-24'>
      <div className='absolute inset-0 flex items-center justify-center'>
        <RiLoader4Line  className='absolute text-6xl animate-spin-slow opacity-50' />
      </div>
    </div>
  )
}

export default LoadingSpinner
