const HeadingOne: React.FC<{ text: string }> = ({ text }) => {
  return <h1 className='text-3xl md:text-5xl font-semibold mb-6 tracking-wide'>{text}</h1>
}

export default HeadingOne
