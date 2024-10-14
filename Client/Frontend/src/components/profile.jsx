import React from 'react';
import profileImage from '../assets/react.svg';

const ProfilePage = () => {
    return (
        <div className="profilePage flex flex-col min-h-screen">
            {/* Top Navigation Bar */}
            <header className="navBar bg-BG text-white p-6 flex justify-between items-center">
                {/* Centered Company Name */}
                <h1 className="companyName text-3xl font-bold text-ButtonsBlue mx-auto">panoraGuard</h1>
                <button className="homeButton bg-white text-blue-600 font-semibold py-2 px-4 rounded">Home</button>
            </header>

            {/* Main Content Area */}
            <div className="mainContent flex flex-1 p-4">
                {/* User Information Section */}
                <div className="userInfoSection flex-1 flex bg-white rounded-lg mx-10 mt-4 relative">
                    {/* Left Side - Blue Part of User Info */}
                    <div className="blueSection w-1/4 bg-NavyBlue p-2 flex flex-col justify-center items-start relative"> 
                        <div className="profilePicture w-48 h-48 bg-gray-300 rounded-full overflow-hidden absolute top-1/2 transform -translate-y-1/2"> 
                            <img 
                                src={profileImage} 
                                alt="Profile" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    </div>

                    {/* Right Side - White Part of User Info */}
                    <div className="whiteSection w-3/4 bg-LightGray p-6 flex flex-col relative">
                        {/* Greeting and Name Section */}
                        <div className="greeting absolute top-6 left-6">
                            <h2 className="text-3xl font-bold text-blue-600">Hello John,</h2>
                            <p className="text-lg text-gray-500">Name: John Dee</p>
                        </div>

                        {/* Description Section */}
                        <div className="description flex-1 flex items-start justify-start mt-24"> {/* Adjusted margin-top for better spacing */}
                            <div className="max-w-md w-full">
                                <p className="text-gray-700">
                                    About: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam molestie, justo nec auctor facilisis, lectus metus venenatis nulla, dignissim aliquam turpis odio tempus ante.
                                    Phasellus ultricies aliquet risus eget fringilla. Duis iaculis lobortis nulla vel vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras a massa enim. Mauris ut justo dolor.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Change Password Section */}
                <div className="changePasswordSection w-1/3 bg-BG rounded-lg p-6 mx-10 mt-4">
                    <h2 className="text-lg font-semibold">Change Password</h2>
                    <div className="mt-2">
                        <label className="block text-gray-700">New Password</label>
                        <input type="password" className="passwordInput border border-gray-300 rounded-lg p-2 w-full mt-1" placeholder="Enter new password" />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Repeat Password</label>
                        <input type="password" className="passwordInput border border-gray-300 rounded-lg p-2 w-full mt-1" placeholder="Repeat new password" />
                    </div>
                    <button className="submitButton mt-4 bg-blue-600 text-white rounded-lg p-2 w-full">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
