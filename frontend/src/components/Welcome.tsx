import { MdArrowOutward } from 'react-icons/md'

const Welcome = (): JSX.Element => {
  return (
    <div className="w-full md:w-2/3">
      <div className="block">
        <h1 className="inline-block text-6xl lg:text-9xl bg-gradient-to-l from-primary to-black dark:to-white text-transparent bg-clip-text">
          Welcome.
        </h1>
      </div>
      <hr />
      <p className="text-2xl pt-4" style={{ boxShadow: 'rgb(0 0 0 / 11%) 0px -13px 14px -10px' }}>
        Please authenticate, over there <MdArrowOutward className="inline text-4xl animate-pulse" />
      </p>
    </div>
  )
}

export default Welcome
