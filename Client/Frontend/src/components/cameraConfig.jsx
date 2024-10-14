import React from 'react'

const CameraConfig = () => {
  return (
    <div className='font-poppings text-sm'>
        {/** */}
         <div className="grid grid-cols-2 gap-8">

            <div className="col-span-1 flex flex-col">
                <label htmlFor="location" className='text-blue-600'>Location:</label>
                <select id="location" className='p-2 rounded-lg w-3/4 ring-1 ring-blue-900'>
                    <option value="convention-center">Convention Center</option>
                </select>
            </div>

            <div className="col-span-1 flex flex-col">
                <label htmlFor="camera-number" className='text-blue-600'>Camera Number:</label>
                <select id="camera-number" className='p-2 rounded-lg w-3/4 ring-1 ring-blue-900'>
                    <option value="4">4</option>
                </select>
            </div>


            <div className="pt-4 col-span-1 flex flex-col space-y-10">
                <label htmlFor="confidence-level" >Change the confidence level:</label>
                <input type="range" id="confidence-level" min="0" max="100" className=' w-3/4'/>
                <button className='w-1/5 bg-NavyBlue text-white rounded-lg p-2'>Update</button>
            </div>
            
            <div className="pt-4 col-span-1 flex flex-col space-y-10">
                <label htmlFor="brightness-level" >Change the brightness level:</label>
                <input type="range" id="brightness-level" min="0" max="100" className=' w-3/4'/>
                <button className='w-1/5 bg-NavyBlue text-white rounded-lg p-2'>Update</button>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-10">
              <h2 className='pt-12 font-bold col-span-2 text-left'>Schedule Cameras</h2>
            <div className="col-span-1 flex flex-col space-y-4">
                <label htmlFor="start-time">Start Date:</label>
                <input type="date" id="start-time" placeholder="2024-12-12T12:00:00 " className='p-2 rounded-lg w-3/4 ring-1 ring-blue-900'/>
                <label htmlFor="start-time">Start Time:</label>
                <input type="time" id="start-time" className='p-2 rounded-lg w-3/4 ring-1 ring-blue-900'/>
            </div>
            <div className="col-span-1 flex flex-col space-y-4">
                <label htmlFor="end-time">End date:</label>
                <input type="date" id="end-time" placeholder="2024-12-14T08:00:00" className='p-2 rounded-lg w-3/4 ring-1 ring-blue-900'/>
                <label htmlFor="end-time">End Time:</label>
                <input type="time" id="end-time" className='p-2 rounded-lg w-3/4 ring-1 ring-blue-900'/>
            </div>
            <button className='w-1/5 bg-NavyBlue text-white rounded-lg p-2'>Apply</button>
        </div>
        
    </div>

  )
}

export default CameraConfig