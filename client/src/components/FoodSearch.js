import React, { useState, useEffect } from 'react';

const FoodSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchFoodData = async () => {
      if (query.length > 2) {
        try {
          const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
              'X-Api-Key': 'vKu/m4vOMPsNGv8lJHj/EQ==W2JzV2z7C4B7R2tU',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setResults(data.items || []);
        } catch (error) {
          console.error('Error fetching food data:', error);
        }
      } else {
        setResults([]);
      }
    };

    fetchFoodData();
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for food items"
      />
      {query.length > 2 && (
        <ul>
          {results.map(item => (
            <li key={item.name} onClick={() => onSelect(item)}>
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FoodSearch;
