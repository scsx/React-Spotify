import { MdArrowOutward } from 'react-icons/md'

const Welcome = (): JSX.Element => {
  return (
    <>
      <h1 className='text-6xl lg:text-9xl bg-gradient-to-l from-primary to-white inline-block lg:w-1/2 text-transparent bg-clip-text'>
        Welcome.
      </h1>
      <p className='text-2xl'>
        Please authenticate, over there{' '}
        <MdArrowOutward className='inline text-4xl animate-pulse' />
      </p>
    </>
  )
}

export default Welcome
{
  /* <div className='flex flex-col content-center'> */
}
/*  </div> */
