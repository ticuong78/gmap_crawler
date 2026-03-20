import { useState } from "react";

export default function App() {
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <div>
      <button onClick={() => window.gmapAPI.openGMap()}>Open Google Map</button>
      <br />
      <form>
        <label htmlFor="search-keyword">Nhập vào từ khóa bạn muốn tìm</label>
        <input
          id="search-keyword"
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button onClick={() => window.gmapAPI.searchGMap(searchKeyword)}>
          Start Searching
        </button>
      </form>
    </div>
  );
}
