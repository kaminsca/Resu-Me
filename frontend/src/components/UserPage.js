import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import {LOCAL_URL} from '../constants';
// Example of a component that takes a parameterized route
function UserPage() {
    // Access route parameters using the useParams hook
    const params = useParams();
    // The params object will contain a property with the name of your route parameter
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Start by setting loading to true and clearing previous errors.
          setLoading(true);
          setError(null);
  
          // Make the GET request.
          const response = await fetch(`${LOCAL_URL}/user/${params.username}`);
          // Throw an error if the response is not ok.
          if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
          }
          const result = await response.json();
  
          // Save the result and indicate that you're no longer loading.
          setData(result);
          // var html_cleaned = result.data.html.replaceAll("```","")

          // setData({
          //       "html":html_cleaned,
          //       "css": result.data.css,
          // })
          // console.log(data.css)
          setLoading(false);
        } catch (error) {
          // In case of an error, save the error to state and indicate that you're no longer loading.
          setError(error);
          setLoading(false);
        }
      };
  
      // Invoke the async function.
      fetchData();
    }, []); // The empty array ensures this only runs once when the component mounts.
  
    // Render your component based on the data, loading, and error state.
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error.message}</div>;
    }
  
    if (!data) {
      return <div>No data found.</div>;
    }
    return (
        <div>
            {data.data.css === null? <></> : <style dangerouslySetInnerHTML={{ __html: data.data.css }} />}
            <div dangerouslySetInnerHTML={{ __html: data.data.html }} />
        </div>
    );
  }

  export default UserPage;