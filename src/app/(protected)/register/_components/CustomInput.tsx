import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import React from 'react'

export const CustomInput = ({labelText, placeholder, fields} : {labelText : string, placeholder : string, fields : any}) => {
  return (
    <div className="flex flex-col  relative">
    <Label htmlFor="companyName" className="top-[-10px] text-[#8A8A8A] font-inter text-[14px] font-normal leading-[16px]
left-[10px] peer-focus:text-black bg-white  absolute ">
      {labelText}
    </Label>
    <Input placeholder={placeholder} type="text" id="companyName" className="floating-input peer w-[300px]" required />
  </div>
  )
}

