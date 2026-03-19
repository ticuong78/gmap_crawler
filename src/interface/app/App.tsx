export default function App() {
  function openGMap() {
    console.log("debugging mode");
    window.windowAPI.openGMap();
  }

  return <button onClick={() => openGMap()}>Open Google Map</button>;
}
