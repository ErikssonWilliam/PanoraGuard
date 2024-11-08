// eslint-disable-next-line no-unused-vars
import React from 'react'

const AddnewUser = () => {

  return (
    <div className='font-poppings text-sm space-y-2'>
        <div className=" flex flex-col">
            <label htmlFor="name" className='text-blue-600'>Name:</label>
            <input type="text" className='p-2 rounded-lg w-3/4 ring-1 ring-blue-900' />
        </div>
        <div className="flex flex-col">
            <label htmlFor="location" className='text-blue-600'>Email:</label>
            <input type="email" className='p-2 rounded-lg w-3/4 ring-1 ring-blue-900' />
        </div>
        <div className="flex flex-col">
            <label htmlFor="passwird" className='text-blue-600'>Password:</label>
            <input type="password" className='p-2 rounded-lg w-3/4 ring-1 ring-blue-900' />
        </div>
        <div className="col-span-1 flex flex-col">
                <label htmlFor="camera-number" className='text-blue-600'>Designation:</label>
                <select id="camera-number" className='p-2 rounded-lg w-3/4 ring-1 ring-blue-900'>{/**Add more option */}
                <option value="guard">Guard</option>
                <option value="operator">Operator</option>
                </select>
        </div>
        <button className='w-1/5 bg-NavyBlue text-white rounded-lg p-2'>Submit</button>
    </div>
  )
}

export default AddnewUser