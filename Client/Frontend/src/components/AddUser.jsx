import React from 'react'

const AddnewUser = () => {
  return (
    <div className='font-poppings text-sm space-y-2'>
        <div className=" flex flex-col">
            <label htmlFor="location" className='text-blue-600'>Name:</label>
            <input type="text" className='p-2 rounded-lg w-3/4 ring-1 ring-blue-900' />
        </div>
        <div className="flex flex-col">
            <label htmlFor="location" className='text-blue-600'>Email:</label>
            <input type="email" className='p-2 rounded-lg w-3/4 ring-1 ring-blue-900' />
        </div>
        <div className="col-span-1 flex flex-col">
                <label htmlFor="camera-number" className='text-blue-600'>Designation:</label>
                <select id="camera-number" className='p-2 rounded-lg w-3/4 ring-1 ring-blue-900'>{/**Add more option */}
                <option value="4">Guard</option>
                <option value="3">Operator</option>
                </select>
        </div>

        <button className='w-1/5 bg-NavyBlue text-white rounded-lg p-2'>Submit</button>
    </div>
  )
}

export default AddnewUser