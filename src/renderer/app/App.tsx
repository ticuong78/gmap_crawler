import { useEffect, useState } from "react";

export default function App() {
  const [searchKeyword, setSearchKeyword] = useState("");

  const [gmapStatus, setGmapStatus] = useState<GmapStatus>("idle");
  const [gmapErrorMessage, setGmapErrorMessage] =
    useState<GmapErrorMessage>(null);

  useEffect(() => {
    const statusCleanUp = window.gmapAPI.onStatusChange(
      (status: GmapStatus) => {
        setGmapStatus(status);
      },
    );

    const errorMessageCleanUp = window.gmapAPI.onErrorMessage(
      (msg: GmapErrorMessage) => {
        setGmapErrorMessage(msg);
      },
    );

    return () => {
      statusCleanUp();
      errorMessageCleanUp();
    };
  }, []);

  function handleCrawl() {
    window.gmapAPI.crawl(searchKeyword);
  }

  function handleSearch() {
    window.gmapAPI.searchGmap(searchKeyword);
  }

  function openGmap() {
    window.gmapAPI.openGmap(); // sẽ ready state sau bước này
  }

  return (
    <div>
      <button onClick={() => openGmap()}>Open Google Map</button>
      <p>{gmapStatus}</p>
      <br />
      {gmapStatus === "error" && <p>{gmapErrorMessage}</p>}
      <br />
      <form>
        <label htmlFor="search-keyword">Nhập vào từ khóa bạn muốn tìm</label>
        <input
          id="search-keyword"
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button onClick={handleSearch}>Start Searching</button>
        <button onClick={handleCrawl}>Start Crawling</button>
      </form>
    </div>
  );
}
