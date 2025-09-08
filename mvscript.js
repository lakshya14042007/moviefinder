const params = new URLSearchParams(window.location.search);
const id = params.get("mid");
const result = document.getElementById("res");

if (id) {
  movinfor(id);
}

async function movinfor(id) {
  try {
    result.innerHTML = "<p>Loading...</p>";
    const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=acdfa985`);
    if (!response.ok) throw new Error("Network problem!");
    const data = await response.json();
    if (data.Response === "True") {
      setTimeout(() => moviess(data), 300);
    } else {
      result.innerHTML = "<p>No results found</p>";
    }
  } catch (error) {
    console.error(error);
    result.innerHTML = "<h1>Error fetching data</h1>";
  }
}

async function fetchTrailer(movieTitle) {
  const apiKey = "AIzaSyD37zbwagzhRcPDeOWj9bAocxZHEnOTx4w"; 
  const query = encodeURIComponent(movieTitle + " official trailer");
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${query}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].id.videoId; // video ka unique ID
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error fetching trailer:", err);
    return null;
  }
}



async function moviess(data) {
  const videoId = await fetchTrailer(data.Title);

  result.innerHTML = `
    <div class="movie-header">
      <div class="poster">
        <img src="${data.Poster}" alt="${data.Title} Poster">
      </div>
      <div class="details">
        <h1>${data.Title} (${data.Year})</h1>
        <div class="meta">
          <span>Rated: ${data.Rated}</span> | 
          <span>${data.Runtime}</span> | 
          <span>${data.Genre}</span>
        </div>
        <p class="plot">${data.Plot}</p>
        <div class="ratings">
          ${data.Ratings.map(r => `
            <div class="rating">
              <span>${r.Source}</span> ${r.Value}
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="extra">
      <p><strong>Director:</strong> ${data.Director}</p>
      <p><strong>Actors:</strong> ${data.Actors}</p>
      <p><strong>Language:</strong> ${data.Language}</p>
      <p><strong>Country:</strong> ${data.Country}</p>
      <p><strong>Awards:</strong> ${data.Awards}</p>
      <p><strong>imdbID:</strong> ${data.imdbID}</p>
    </div>

    <div class="trailer">
      <h2>Trailer</h2>
      ${
        videoId
          ? `<iframe width="100%" height="400"
                src="https://www.youtube.com/embed/${videoId}"
                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>`
          : `<p style="color:#ff4444;">Trailer not found</p>`
      }
    </div>
  `;
}



