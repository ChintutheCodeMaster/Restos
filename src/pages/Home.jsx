import React, { useState, useEffect } from "react";
import image from "../assets/circularLogo.png";
import image2 from "../assets/pics.png";
import bgimage from '../assets/bg1.png'
import bgimage2 from '../assets/bg2.png'

import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Home = () => {
  const navigate = useNavigate();


  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showTop3, setShowTop3] = useState(false);

  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4; 
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/restaurants?page=${page}&limit=${limit}`);
      const data = await res.json();
      setRestaurants(data.restaurants);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  fetchRestaurants();
}, [page]);


  const filteredRestaurants = restaurants
    .filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.location.toLowerCase().includes(search.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === "name"
        ? a.name.localeCompare(b.name)
        : a.location.localeCompare(b.location)
    );


  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <div className="relative flex justify-between items-center px-27 py-20 bg-cover bg-center bg-no-repeat"
       style={{ backgroundImage: `url(${bgimage})` }}
      >
        <img
          src={image}
          alt="logo"
          className="absolute top-8 left-15 w-20 h-20"
        />
        <div className="item1 flex flex-col justify-evenly items-left gap-10">
          <p className="text-6xl max-w-md font-bold">
            We provide the best food for you!
          </p>
          <p className="text-sm text-gray-600 max-w-md text-left">
             We bring you the best restaurants and track their performance so you can enjoy top-notch food anytime.
          </p>
          <div className="flex items-center gap-8">
            <button
              className="text-white bg-gray-900 hover:bg-gray-500 cursor-pointer p-2 px-5 rounded"
            >
              Call us!
            </button>
           
          </div>
        </div>
        <img src={image2} alt="" className="w-120 h-120 mr-7 object-contain" />
      </div>

      {/* Restaurants Section */}
      <section className="flex flex-col justify-between items-center p-20 py-8 gap-6 bg-cover bg-center bg-no-repeat"
       style={{ backgroundImage: `url(${bgimage2})` }}
       >
        <p className="text-2xl font-bold">Our Restaurants</p>
        <p className="text-sm text-gray-500 max-w-md text-left">
          Browse and filter through our restaurant partners.
        </p>

        {/* Filters */}
        <div className="flex gap-4 my-4">
          <input
            type="text"
            placeholder="Search by name, location, cuisine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-72"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="name">Sort by Name</option>
            <option value="location">Sort by Location</option>
          </select>
        </div>

        {/* Loading / Data */}
        {loading ? (
          <p>Loading restaurants...</p>
        ) : (
          <div className="grid grid-cols-1 my-10 sm:grid-cols-2 md:grid-cols-4 gap-6 ">
            {filteredRestaurants.map((r) => (
              <div
                key={r.id}
                className="relative bg-white min-w-64 shadow-lg rounded-tl-2xl rounded-br-2xl mt-9 p-4 py-8 flex flex-col justify-end gap-1 items-center h-80 cursor-pointer hover:shadow-xl"
                onClick={() => navigate(`/restaurant/${r.id}`)}
              >
                <img
                  src={r.image}
                  alt={r.name}
                  className="absolute -top-16  w-45 h-45 object-cover rounded-full"
                />
                <h2 className="mt-4 text-lg font-bold">{r.name}</h2>
                <p className="text-gray-600 text-sm text-center">
                  {r.location}
                </p>
                 <p className="text-gray-600 text-sm text-center">
                  {r.description}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>

          <span className="px-4 py-2">{page} / {totalPages}</span>

          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>

      </section>
      <Footer />
    </>
  );
};

export default Home;
