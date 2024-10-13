import React from 'react'

const CameraConfig = () => {
  return (
    <div className='p-6'>
        {/** */}
         <div className="grid grid-cols-2 gap-10">
            <div className="col-span-1 flex flex-col">
                <label for="location">Location:</label>
                <select id="location">
                    <option value="convention-center">Convention Center</option>
                </select>
            </div>

            <div className="col-span-1 flex flex-col">
                <label for="camera-number">Camera Number:</label>
                <select id="camera-number">
                    <option value="4">4</option>
                </select>
            </div>


            <div class="col-span-1 flex flex-col">
                <label for="confidence-level">Change the confidence level:</label>
                <input type="range" id="confidence-level" min="0" max="100"/>
                <button className='text-left'>Update</button>
            </div>
            <div class="col-span-1 flex flex-col">
                <label for="brightness-level">Change the brightness level:</label>
                <input type="range" id="brightness-level" min="0" max="100"/>
                <button className='text-left'>Update</button>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-10">
              <h2 className='col-span-2 text-left'>Schedule Cameras</h2>
            <div class="col-span-1 flex flex-col">
                <label for="start-time">Start Date:</label>
                <input type="datetime-local" id="start-time" value="2024-12-12T12:00:00 "/>
                <label for="start-time">Start Time:</label>
                <input type="time" id="start-time"/>
            </div>
            <div className="col-span-1 flex flex-col">
                <label for="end-time">End date:</label>
                <input type="datetime-local" id="end-time" value="2024-12-14T08:00:00"/>
                <label for="end-time">End Time:</label>
                <input type="time" id="end-time"/>
            </div>
            <button className='col-span-2 text-left'>Apply</button>
        </div>
        
    </div>

  )
}

export default CameraConfig