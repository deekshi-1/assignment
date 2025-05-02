import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const states = [
  "Assam",
  "Mizoram",
  "Meghalaya",
  "Manipur",
  "Nagaland",
  "Tripura",
  "Sikkim",
];

function App() {
  const key = import.meta.env.VITE_API_KEY;
  const [selectedState, setSelectedState] = useState("");
  const [districtCount, setDistrictCount] = useState(null);
  const [pincodeCount, setPincodeCount] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchData();
  }, [selectedState]);

  const fetchData = async () => {
    if (!selectedState) return;
    setLoading(true);
    setDistrictCount(null);
    setPincodeCount(null);

    try {
      const response = await axios.get(
        `https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd?api-key=${key}&format=json&limit=all&filters%5Bstatename%5D=${selectedState}`
      );
      const records = response.data.records;
      if (records && records.length > 0) {
        const districts = new Set(
          records.map((item) => item.district.trim().toUpperCase())
        );
        const pincodes = new Set(records.map((item) => item.pincode));

        setDistrictCount(districts.size);
        setPincodeCount(pincodes.size);

        console.log("District Count:", districts.size);
        console.log("Pincode Count:", pincodes.size);
      } else {
        console.warn("No records found for the selected state.");
        setDistrictCount(0);
        setPincodeCount(0);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setDistrictCount("Error");
      setPincodeCount("Error");
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>State District & PIN Codes</h1>
      <select
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
        className="select-box"
      >
        <option value="">-- Select a State --</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
      <div className="heightfix">{loading ? "Loading..." : ""}</div>

      {districtCount !== null && (
        <div className="info-box">
          <p className="box">
            <strong>Districts</strong>
            <div className="result">{districtCount}</div>
          </p>
          <p className="box"> 
            <strong>PIN Codes</strong>
            <div className="result">{pincodeCount} </div>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
