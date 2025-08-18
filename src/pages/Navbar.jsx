import React from 'react'

const Navbar = () => {
  return (

    <nav className="bg-white-600 text-black p-8 px-20 flex justify-between items-center">
      <h1 className="font-bold text-2xl">Restos</h1>
      <div className="flex justify-between items-center gap-5">
        <button className="hover:bg-gray-500 cursor-pointer p-2 rounded">Contact Us</button>
        <button className="hover:bg-gray-500 cursor-pointer p-2 rounded">Menu</button>
        <button className="hover:bg-gray-500 cursor-pointer p-2 rounded">Home</button>
        <button className="hover:bg-gray-500 cursor-pointer p-2 rounded">About Us</button>
      </div>
      <div className="space-x-4">
        <button className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-tl-lg rounded-br-lg cursor-pointer text-white">Call us!</button>
      </div>
    </nav>
  )
}

export default Navbar