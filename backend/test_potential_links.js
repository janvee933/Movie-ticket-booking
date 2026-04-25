// import fetch from 'node-fetch'; // fetch is native in Node 18+

const candidates = {
    "Ek Tha Tiger": [
        "https://upload.wikimedia.org/wikipedia/en/2/22/Ek_Tha_Tiger_theatrical_poster.jpg",
        "https://m.media-amazon.com/images/M/MV5BMTYxMjcwMzQ4MF5BMl5BanBnXkFtZTcwMzY2MzE0Nw@@._V1_.jpg"
    ],
    "Stree 2": [
        "https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/Stree_2_poster.jpg/220px-Stree_2_poster.jpg",
        "https://m.media-amazon.com/images/M/MV5BMTAxN2FlMzgtNDYyOC00MzdhLTgwNzgtZJjYmVjOTAyY2EzXkEyXkFqcGc@._V1_.jpg", // Sample IMDb style
        "https://upload.wikimedia.org/wikipedia/en/1/1a/Stree_2_poster.jpg" // Original broken one to check
    ],
    "Aashiqui 2": [
        "https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Aashiqui_2_poster.jpg/220px-Aashiqui_2_poster.jpg",
        "https://m.media-amazon.com/images/M/MV5BMjMzNzE2NDAxMl5BMl5BanBnXkFtZTcwMjgwMzI4OQ@@._V1_.jpg"
    ]
};

async function testLinks() {
    console.log("Testing replacement candidates...");
    for (const [movie, urls] of Object.entries(candidates)) {
        console.log(`\nMovie: ${movie}`);
        for (const url of urls) {
            try {
                const res = await fetch(url, { method: 'HEAD' });
                if (res.ok) {
                    console.log(`[OK] ${url}`);
                } else {
                    console.log(`[FAIL ${res.status}] ${url}`);
                }
            } catch (e) {
                console.log(`[ERR] ${url} - ${e.message}`);
            }
        }
    }
}

testLinks();
