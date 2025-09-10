import React, { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { FunnelIcon, XMarkIcon, HomeIcon } from "@heroicons/react/24/outline";

const MealsPage = () => {
  const navigate = useNavigate();
 

  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [meals, setMeals] = useState([]);
  const [ingredient, setIngredient] = useState("");
  const [selectedCategory, setSelectedCategory] = useState( "");
  const [selectedArea, setSelectedArea] = useState( "");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Initial load
  useEffect(() => {
    fetchCategories();
    fetchAreas();
      fetchMeals("Chicken"); // default meals only if not coming back
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch areas
  const fetchAreas = async () => {
    try {
      const res = await fetch(
        "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
      );
      const data = await res.json();
      setAreas(data.meals || []);
    } catch (err) {
      console.error("Error fetching areas:", err);
    }
  };

  // Fetch meals by filters
  const fetchMeals = async (category = "Chicken", area = "") => {
    try {
      setLoading(true);
      let url = "";
      let data = { meals: [] };

      if (category && area && category !== "Miscellaneous") {
        // Normal case: filter by category first, then by area
        const resCategory = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
        );
        const dataCategory = await resCategory.json();

        const filteredMeals = [];
        for (let meal of dataCategory.meals || []) {
          const resDetails = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
          );
          const details = await resDetails.json();
          if (details.meals && details.meals[0].strArea === area) {
            filteredMeals.push(meal);
          }
        }
        data.meals = filteredMeals;
      } else if (area) {
        // Special case: category is "Miscellaneous" or only area selected
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;
        const res = await fetch(url);
        data = await res.json();
      } else if (category) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
        const res = await fetch(url);
        data = await res.json();
      } else {
        url = "https://www.themealdb.com/api/json/v1/1/search.php?f=c"; // default some meals
        const res = await fetch(url);
        data = await res.json();
      }

      setMeals(data.meals || []);
    } catch (err) {
      console.error("Error fetching meals:", err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    fetchMeals(selectedCategory, selectedArea);
    setShowFilters(false); // close sidebar on mobile after applying
  };

  // Search by ingredient
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ingredient) return;
    try {
      setLoading(true);
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
      );
      const data = await res.json();
      setMeals(data.meals || []);
    } catch (err) {
      console.error("Error searching meals:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch random meal
  const fetchRandomMeal = async () => {
    try {
      const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
      const data = await res.json();
      const meal = data.meals[0];
      navigate(`/recipies/${meal.idMeal}`);
    } catch (err) {
      console.error("Error fetching random meal:", err);
    }
  };

  const viewRecipe = (id) => {
    navigate(`/recipies/${id}`, {
      state: { selectedArea, selectedCategory, meals },
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar Filters (desktop + mobile overlay) */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-3/4 md:w-1/4 bg-white p-4 shadow-md transform transition-transform duration-300 z-50
        ${showFilters ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={() => setShowFilters(false)}>
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <h2 className="hidden md:block text-xl font-bold mb-4">Filters</h2>

        {/* Categories */}
        <h3 className="font-semibold mb-2">Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3 mb-4">
          {categories.map((cat) => (
            <button
              key={cat.idCategory}
              onClick={() => setSelectedCategory(cat.strCategory)}
              className={`flex items-center space-x-2 p-2 rounded-lg border transition ${
                selectedCategory === cat.strCategory
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white border-gray-200 hover:bg-orange-100"
              }`}
            >
              <img
                src={cat.strCategoryThumb}
                alt={cat.strCategory}
                className="w-8 h-8 rounded"
              />
              <span className="text-sm font-medium">{cat.strCategory}</span>
            </button>
          ))}
        </div>

        {/* Areas */}
        <h3 className="font-semibold mb-2">Area</h3>
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
        >
          <option value="">All Areas</option>
          {areas.map((a, idx) => (
            <option key={idx} value={a.strArea}>
              {a.strArea}
            </option>
          ))}
        </select>

        <button
          onClick={applyFilters}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          Apply Filters
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Top bar: Home icon + Search + Random + Mobile filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            {/* Home Icon */}
            <button
              onClick={() => navigate("/")} // landing page path
              className="bg-gray-200 p-2 rounded-lg shadow hover:bg-gray-300 transition"
            >
              <HomeIcon className="w-6 h-6 text-gray-700" />
            </button>

            {/* Mobile filter button */}
            <button
              onClick={() => setShowFilters(true)}
              className="md:hidden bg-gray-200 p-2 rounded-lg shadow hover:bg-gray-300 transition"
            >
              <FunnelIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex w-full md:w-1/2 bg-white shadow rounded-lg overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search by ingredient..."
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              className="flex-1 px-4 py-2 outline-none"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 hover:bg-orange-600"
            >
              Search
            </button>
          </form>

          <button
            onClick={fetchRandomMeal}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
          >
            🎲 Random Recipe
          </button>
        </div>

        {/* Meals Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
          </div>
        ) : meals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <div
                key={meal.idMeal}
                className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden"
              >
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate">
                    {meal.strMeal}
                  </h3>
                  <button
                    onClick={() => viewRecipe(meal.idMeal)}
                    className="mt-2 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No meals found.</p>
        )}
      </main>
    </div>
  );
};

export default MealsPage;
