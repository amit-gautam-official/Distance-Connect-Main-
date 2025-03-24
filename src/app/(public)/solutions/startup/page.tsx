import React from 'react'
import Hero from '../_components/Hero'
import LogoStrip from '@/app/_components/LogoStrip'
import AltHero from '../_components/AltHero'
const page = () => {
  return (
    <div className='min-h-screen'>
      <div className='pt-[170px]'>
        <Hero title='startup' />
        <div className='h-[140px]' ></div>
        <LogoStrip/>
      </div>

      <AltHero title='startup'/>
      <Hero title='startup' />
      <AltHero title='startup'/>
   

    </div>
  )
}

export default page