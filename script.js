const center = [8.33482, 124.74044];

const map = L.map("map").setView(center, 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
  maxZoom: 19,
}).addTo(map);

const locations = [
  {
    name: "Poblacion Barangay Hall",
    lat: 8.33763,
    lng: 124.73584,
    description: "Local government office of Barangay Poblacion.",
  },
  {
    name: "Libona Central Elementary School",
    lat: 8.33482,
    lng: 124.74044,
    description: "Elementary education facility serving the community.",
  },
  {
    name: "Libona Municipal Hall",
    lat: 8.33295,
    lng: 124.74855,
    description: "Municipal government office of Libona.",
  },
];

locations.forEach(function (place) {
  const marker = L.marker([place.lat, place.lng]).addTo(map);

  marker.bindPopup(
    "<b>" +
      place.name +
      "</b>" +
      "<p>" +
      place.description +
      "</p>" +
      "<p>Latitude: " +
      place.lat +
      "<br>Longitude: " +
      place.lng +
      "</p>",
  );
});

L.circle(center, {
  color: "blue",
  fillColor: "#30a3ec",
  fillOpacity: 0.3,
  radius: 1000,
}).addTo(map);


map.on("click", function (event) {
  const lat = event.latlng.lat;
  const lng = event.latlng.lng;

  document.getElementById("coordinates").innerHTML =
    "<b>Latitude:</b> " +
    lat.toFixed(5) +
    "<br><b>Longitude:</b> " +
    lng.toFixed(5);

  L.popup()
    .setLatLng(event.latlng)
    .setContent(
      "<b>Selected Location</b><br>" +
        "Latitude: " +
        lat.toFixed(5) +
        "<br>Longitude: " +
        lng.toFixed(5),
    )
    .openOn(map);
});


let searchMarker = null;


async function searchPlace() {
  const searchInput = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");

  const place = searchInput.value.trim();

  if (place === "") {
    results.textContent = "Please enter a place to search.";
    return;
  }

  results.textContent = "Searching...";

  try {
    const url =
      "https://nominatim.openstreetmap.org/search?format=jsonv2&q=" +
      encodeURIComponent(place) +
      "&limit=5";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Search service unavailable.");
    }

    const data = await response.json();

    if (data.length === 0) {
      results.textContent = "No places found. Try another search.";

      return;
    }

    results.replaceChildren();

    data.forEach(function (location) {
      const button = document.createElement("button");

      button.textContent = location.display_name;

      button.style.display = "block";
      button.style.width = "100%";
      button.style.padding = "10px";
      button.style.marginBottom = "5px";
      button.style.textAlign = "left";
      button.style.cursor = "pointer";

      button.addEventListener("click", function () {
        const lat = Number(location.lat);
        const lng = Number(location.lon);

     
        map.setView([lat, lng], 17);

     
        if (searchMarker) {
          map.removeLayer(searchMarker);
        }

      
        searchMarker = L.marker([lat, lng])
          .addTo(map)
          .bindPopup("<b>Search Result</b><br>" + location.display_name)
          .openPopup();

      
        document.getElementById("coordinates").innerHTML =
          "<b>Latitude:</b> " +
          lat.toFixed(5) +
          "<br><b>Longitude:</b> " +
          lng.toFixed(5);
       
        results.replaceChildren();
      });

      results.appendChild(button);
    });
  } catch (error) {
    results.textContent =
      "Unable to search. Please check your internet connection.";
  }
}

document
  .getElementById("searchInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchPlace();
    }
  });