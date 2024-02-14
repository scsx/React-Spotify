import { MdArrowOutward } from 'react-icons/md'

const Welcome = (): JSX.Element => {
  return (
    <>
      <h1 className='text-6xl lg:text-9xl bg-gradient-to-l from-primary to-black dark:to-white inline-block lg:w-1/2 text-transparent bg-clip-text'>
        Welcome.
      </h1>
      <hr />
      <p className='text-2xl pt-4'  style={{ boxShadow: 'rgb(0 0 0 / 11%) 0px -13px 14px -10px' }}>
        Please authenticate, over there{' '}
        <MdArrowOutward className='inline text-4xl animate-pulse' />
      </p>
    </>
  )
}

export default Welcome
