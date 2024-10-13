import React from 'react'

const SpeakerConfig = () => {
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
                <label for="speaker-number">Speaker Number:</label>
                <select id="speaker-number">
                    <option value="4">4</option>
                </select>
            </div>

        </div>
        <div class="flex flex-col w-1/2 space-y-10">
                <label for="confidence-level">Change the volume:</label>
                <input type="range" id="confidence-level" min="0" max="100"/>
                <button className='text-left'>Update</button>
            </div>
            <div class="flex flex-row space-x-14">
                <button className='text-left'>Apply</button>
                <button className='text-left bg-red-800'>Deactive Speaker</button>
            </div>
        
    </div>
  )
}

export default SpeakerConfig