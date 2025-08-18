import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import bgimage3 from '../assets/bg3.png'

const RestaurantPage = () => {
  const { id } = useParams();
  const restaurantId = parseInt(id, 10); // 👈 ensure it's a number
  const [showTop3, setShowTop3] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [top3Restaurants, setTop3Restaurants] = useState([]);
  const [loadingTop3, setLoadingTop3] = useState(false);
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });
  const [hourRange, setHourRange] = useState({ start: "", end: "" });


  useEffect(() => {
      const fetchRestaurants = async () => {
        try {
          const res = await fetch("http://localhost:8000/restaurants");
          const data = await res.json();
          console.log(data);
          setRestaurants(data.restaurants);
          
        } catch (error) {
          console.error("Error fetching restaurants:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchRestaurants();
    }, []);

  
  const [dateRange, setDateRange] = useState({
    start: "2025-06-20",
    end: "2025-06-27",
  });
  const [filters, setFilters] = useState({
    dailyOrders: true,
    dailyRevenue: true,
    avgOrderValue: false,
    peakHour: false,
  });
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);



  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
  if (showTop3) {
    setLoadingTop3(true);
    fetch(`http://localhost:8000/top3restaurants?start=${dateRange.start}&end=${dateRange.end}`)
      .then(res => res.json())
      .then(data => setTop3Restaurants(data))
      .catch(err => console.error(err))
      .finally(() => setLoadingTop3(false));
  }
}, [showTop3, dateRange]);

  useEffect(() => {
    if (!restaurantId) return; // avoid fetch if id is missing
    const fetchStats = async () => {
    
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/restaurant/${restaurantId}/stats?start=${dateRange.start}&end=${dateRange.end}`
        );
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [restaurantId, dateRange]);

  const totalStats = stats.reduce(
  (acc, curr) => {
    acc.orders += curr.orders;
    acc.revenue += curr.revenue;
    acc.values.push(...(curr.values || [])); // optional if you store individual order amounts
    return acc;
  },
  { orders: 0, revenue: 0, values: [] }
);

const filteredStats = stats.filter((s) => {
  
  const inAmountRange =
    (!amountRange.min || s.revenue >= parseInt(amountRange.min)) &&
    (!amountRange.max || s.revenue <= parseInt(amountRange.max));

 
  let inHourRange = true;
  if (hourRange.start || hourRange.end) {
    const peakHour = s.peakHour ? parseInt(s.peakHour.split(":")[0], 10) : null;
    if (peakHour !== null) {
      if (hourRange.start && peakHour < parseInt(hourRange.start)) inHourRange = false;
      if (hourRange.end && peakHour > parseInt(hourRange.end)) inHourRange = false;
    }
  }

  return inAmountRange && inHourRange;
});


const totalAvgOrder = totalStats.orders > 0 ? Math.round(totalStats.revenue / totalStats.orders) : 0;
const currentRestaurant = restaurants.find(r => r.id === restaurantId);

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Left Filters */}
      <div className="relative w-1/4 bg-gray-50 shadow-xl p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <button
          className="text-white bg-gray-500 shadow-md cursor-pointer p-2 rounded mb-4 w-full text-left font-bold"
          onClick={() => setShowTop3(prev => !prev)}
        >
          See top 3
        </button>
      

        <details className="mb-4 shadow-md rounded" open>
          <summary className="text-white cursor-pointer px-4 py-2 bg-gray-500 font-medium">
            Date Range
          </summary>
          <div className="p-4 space-y-2">
            <div>
              <label className="block text-sm">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="border px-2 py-1 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="border px-2 py-1 rounded w-full"
              />
            </div>
          </div>
        </details>
        
        

        {/* Main Filters Accordion */}
        <details className="shadow-md rounded mb-4" open>
          <summary className="text-white cursor-pointer px-4 py-2 bg-gray-500 font-medium">
            Main Filters
          </summary>
          <div className="p-4 space-y-2">
            {[
              { key: "dailyOrders", label: "Daily Orders" },
              { key: "dailyRevenue", label: "Daily Revenue" },
              { key: "avgOrderValue", label: "Avg Order Value" },
              { key: "peakHour", label: "Peak Hour" },
            ].map((f) => (
              <label key={f.key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters[f.key]}
                  onChange={() => toggleFilter(f.key)}
                />
                <span>{f.label}</span>
              </label>
            ))}
          </div>
        </details>

        <details className="mb-4 shadow-md rounded" open>
           <summary className="text-white cursor-pointer px-4 py-2 bg-gray-500 font-medium">
            Advanced Filters
          </summary>
          {/* Amount Range */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Total Revenue amount Range (₹)</h3>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={amountRange.min}
              onChange={(e) => setAmountRange({ ...amountRange, min: e.target.value })}
              className="border px-2 py-1 rounded w-1/2"
            />
            <input
              type="number"
              placeholder="Max"
              value={amountRange.max}
              onChange={(e) => setAmountRange({ ...amountRange, max: e.target.value })}
              className="border px-2 py-1 rounded w-1/2"
            />
          </div>
        </div>

        {/* Hour Range */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Peak Hour Range (0-23)</h3>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Start"
              value={hourRange.start}
              onChange={(e) => setHourRange({ ...hourRange, start: e.target.value })}
              className="border px-2 py-1 rounded w-1/2"
              min={0}
              max={23}
            />
            <input
              type="number"
              placeholder="End"
              value={hourRange.end}
              onChange={(e) => setHourRange({ ...hourRange, end: e.target.value })}
              className="border px-2 py-1 rounded w-1/2"
              min={0}
              max={23}
            />
          </div>
        </div>

        </details>

        
      </div>

      {/* Right Stats */}
      <div className="w-3/4 p-6 overflow-y-auto bg-cover bg-center bg-no-repeat"
      style={{backgroundImage: `url(${bgimage3})`}}
      >
        {/* {currentRestaurant ? currentRestaurant.name : ''} */}
        <h2 className="text-xl font-bold mb-4">Daily Stats for </h2>
        {/* Total Stats */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {filters.dailyOrders && (
              <div className="bg-white rounded-xl shadow p-4 border text-center">
                <h3 className="font-semibold text-lg">Total Orders</h3>
                <p className="text-xl font-bold">{totalStats.orders}</p>
              </div>
            )}
            {filters.dailyRevenue && (
              <div className="bg-white rounded-xl shadow p-4 border text-center">
                <h3 className="font-semibold text-lg">Total Revenue</h3>
                <p className="text-xl font-bold">₹{totalStats.revenue}</p>
              </div>
            )}
            {filters.avgOrderValue && (
              <div className="bg-white rounded-xl shadow p-4 border text-center">
                <h3 className="font-semibold text-lg">Avg Order Value</h3>
                <p className="text-xl font-bold">₹{totalAvgOrder}</p>
              </div>
            )}
          </div>
        )}


        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStats.map((s) => (
                  <div key={s.date} className="relative bg-white rounded-xl shadow p-4 border">
                    <h3 className="font-semibold text-lg mb-2">{s.date}</h3>
                    <img
                      className="absolute top-2 rounded right-2 w-23 h-23 align-center"
                      src={currentRestaurant.image}
                      alt="image"
                    />
                    <ul className="space-y-1 text-sm min-h-10">
                      {filters.dailyOrders && <li>1. Orders: {s.orders}</li>}
                      {filters.dailyRevenue && <li>2. Revenue: ₹{s.revenue}</li>}
                      {filters.avgOrderValue && <li>3. Avg Order: ₹{s.avgOrderValue}</li>}
                      {filters.peakHour && <li>4. Peak Hour: {s.peakHour ?? "N/A"}</li>}
                    </ul>
                  </div>
                ))}

          </div>
          <div>
            {showTop3 && !loading && (
              <section className="flex flex-col justify-between items-center p-20 py-8 gap-6">
                <p className="text-2xl font-bold">Top 3 Restaurants by Revenue</p>
                <p className="text-sm text-gray-500 max-w-md text-left">
                  Based on revenue performance in the selected date range.
                </p>
                <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 gap-12 w-full">
                  {top3Restaurants.map((r) => (
                    <div
                      key={r.id}
                      className="bg-white min-w-64 shadow-lg rounded-lg p-4 py-8 flex flex-col justify-between items-center cursor-pointer hover:shadow-xl"
                      onClick={() => navigate(`/restaurant/${r.id}`)}
                    >
                      <img
                        src={r.image}
                        alt={r.name}
                        className="w-32 h-32 object-cover rounded"
                      />
                      <h2 className="mt-4 text-lg font-bold">{r.name}</h2>
                      <p className="text-gray-600 text-sm text-center">
                        {r.location}
                      </p>
                      <p className="text-gray-600 text-sm text-center">
                        Revenue - {r.revenue}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          </>
        )}
      </div>
      
    </div>
  );
};

export default RestaurantPage;
