import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Recipe() {
  const { id } = useParams(); 
  console.log(id);
   
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMealDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching details for meal ID:");
        
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await res.json();
        setMeal(data.meals ? data.meals[0] : null);
      } catch (err) {
        console.error("Error fetching meal details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMealDetails();
  }, [id]);

  // Extract ingredients
  const extractIngredients = (meal) => {
    if (!meal) return [];
    const list = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing && ing.trim()) {
        list.push(`${measure} ${ing}`);
      }
    }
    return list;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-orange-200 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg">
        <button
          onClick={() => navigate(-1)} // go back
          className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
        >
          ← Back
        </button>

        {loading ? (
          <p className="text-center text-lg text-orange-700">Loading recipe...</p>
        ) : meal ? (
          <>
            <h2 className="text-3xl font-bold text-orange-800 mb-4 text-center">
              {meal.strMeal}
            </h2>
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="w-full h-72 object-cover rounded-lg mb-4"
            />
            <p className="text-center italic text-gray-600 mb-4">
              {meal.strCategory} • {meal.strArea}
            </p>

            {/* Ingredients */}
            <h3 className="text-xl font-semibold mb-2">🛒 Ingredients</h3>
            <ul className="list-disc pl-6 mb-6">
              {extractIngredients(meal).map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>

            {/* Instructions */}
            <h3 className="text-xl font-semibold mb-2">📖 Instructions</h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-6">
              {meal.strInstructions}
            </p>

            {/* YouTube Link */}
            {meal.strYoutube && (
              <div className="text-center">
                <a
                  href={meal.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
                >
                  ▶ Watch on YouTube
                </a>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-lg text-red-600">Recipe not found.</p>
        )}
      </div>
    </div>
  );
}
