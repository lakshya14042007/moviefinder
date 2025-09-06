const btn = document.getElementById("btun");
const bar = document.getElementById("searchbar");
const result = document.getElementById("results");
const boxdiv = document.getElementById("box");

const dropdown = document.getElementById("genreDropdown");
const dropbtn = document.getElementById("dropbtn");
const links = dropdown.querySelectorAll(".dropdown-content a");

let gen = ""; 


btn.addEventListener("click", () => {
    let query = bar.value.trim();
    if(!query) query = "a"; 
    boxdiv.classList.add("up");
    moviesearch(query);
});


dropbtn.addEventListener("click", () => {
    dropdown.classList.toggle("show");
});


links.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const txt = link.textContent.trim();
        dropbtn.textContent = txt;
        gen = (txt.toLowerCase() === "all") ? "" : txt;
        dropdown.classList.remove("show");
    });
});


window.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target !== dropbtn) {
        dropdown.classList.remove("show");
    }
});


async function moviesearch(query){
    try {
        result.innerHTML = "<p>Loading...</p>";
        result.classList.add("show");

        const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=acdfa985`);
        if(!response.ok) throw new Error("Network problem!");
        const data = await response.json();

        if(data.Response === "True"){
            let movies = data.Search;


            if(gen === ""){
                movinfo(movies);
                return;
            }

          
            const detailPromises = movies.map(m => 
                fetch(`https://www.omdbapi.com/?i=${m.imdbID}&apikey=acdfa985`)
                  .then(r => r.json())
                  .catch(() => null)
            );
            const detailsArr = await Promise.all(detailPromises);

            const gLower = gen.toLowerCase();
            const filtered = movies.filter((m, i) => {
                const d = detailsArr[i];
                if(!d || !d.Genre) return false;
                const genres = d.Genre.toLowerCase().split(",").map(s => s.trim());
                return genres.includes(gLower);
            });

            if(filtered.length > 0){
                movinfo(filtered);
            } else {
                result.innerHTML = `<p>No ${gen} results found for "${query}".</p>`;
            }
        } else {
            result.innerHTML = "<p>No results found</p>";
        }
    } catch(error) {
        console.error(error);
        result.innerHTML = "<p>Error fetching data</p>";
        result.classList.add("show");
    }
}


function movinfo(movies){
    result.innerHTML = "";
    movies.forEach((movie, index) => {
        const moviediv = document.createElement("div");
        moviediv.classList.add("movie");
        moviediv.style.animationDelay = `${index * 0.15}s`; // stagger animation
        moviediv.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200"}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button onclick="newpg('${movie.imdbID}')">More Info</button>
        `;
        result.appendChild(moviediv);
    });
    result.classList.add("show");
}



function newpg(movieid){
    window.location.href = `movie.html?mid=${movieid}`;
}
