const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
    },
};

export default class ExternalServices {
    Constructor() {

    }
    async fetchDataAuth() {
        await fetch("https://api.themoviedb.org/3/authentication", options)
            .then((res) => res.json())
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
    }
}

