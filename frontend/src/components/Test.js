import { useState, useEffect } from "react";

const BASE_URL = 'http://127.0.0.1:5000/';

function Test(props) {
  const [data, setData] = useState("");

  const handleFetch = async () => {
    try {
      const res = await fetch(BASE_URL + "test");
      if (!res.ok) {
        // Handle error response
        console.error("Fetch error:", res.status, res.statusText);
        // You can return a specific error object or null here if needed
        return null;
      } else {
        const payload = await res.json();
        return payload;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      // Return null or specific error object in case of a network error
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const resp = await handleFetch();
      if (resp) {
        setData(resp); // Set state only if the response is not null
      }
    };

    fetchData(); // Call the async function within useEffect
  }, []); // Empty dependency array means this effect will run once after the initial render

  return (
    <div>
        
      test - {data.data}
    </div>
  );
}

export default Test;