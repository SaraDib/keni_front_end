import React from 'react'

const ComposantRight = ({title ,title1, subtitle, image }) =>{
  return (
    <div>
      <div className="bg-white flex gap-10 justify-between max-sm:flex-col">
      <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
        <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">{title}</h1>
        <h1 className="text-2xl text-customGreen mt-6 font-dmsans max-sm:text-2xl">{title1}</h1>

        <h2 className="text-gray-700 text-1.5xl tex text- font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
        {subtitle}
        </h2>
        </div>
        <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-6 ">
          <img src={image} alt="souf" className="h-full w-full max-sm:h-auto" />
        </div>
    </div>

    </div>
  )
}

export default ComposantRight   
