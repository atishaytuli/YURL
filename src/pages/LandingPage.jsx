import { Button } from '@/components/ui/button'
import {Input} from '../components/ui/input'
const LandingPage = () => {
  return (
    <div className='flex flex-col items-center'>
      <h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-black text-center text-balance font-bold">
        The only URL Shortner <br /> you&rsquo;ll ever need !
      </h2>

      <form className='sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2'>
        <Input />
        <Button> Shorten </Button>
      </form>

      <img src="/banner.jpeg" alt="banner" className='w-full my-11 md:px-11'/>
    </div>
  )
}

export default LandingPage