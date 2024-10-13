import React from 'react'

const ManageData = () => {
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

        <div className="col-span-1 flex flex-col">
            <label for="fromData">From:</label>
            <input type="date" value="" />
        </div>

        <div className="col-span-1 flex flex-col">
            <label for="toData">Till:</label>
            <input type="date" value="" />
        </div>

    </div>

        <div class="">
            <button className='text-left bg-red-800'>Clean Data</button>
        </div>
    
</div>
  )
}

export default ManageData