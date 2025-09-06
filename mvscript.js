const params = new URLSearchParams(window.location.search);
const id = params.get("mid");
const result = document.getElementById("res");

if (id) {
  movinfor(id);
}

async function movinfor(id) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=acdfa985`);
    if (!response.ok) throw new Error("Network problem!");
    const data = await response.json();
    if (data.Response === "True") {
      setTimeout(() => moviess(data), 300); // smooth load
    } else {
      result.innerHTML = "<p>No results found</p>";
    }
  } catch (error) {
    console.error(error);
    result.innerHTML = "<h1>Error fetching data</h1>";
  }
}

function moviess(data) {
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
  `;
}


