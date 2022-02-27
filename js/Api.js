const onResponse = (response) => {
    if (response.ok) {
        return response.json()
    }

    return Promise.reject({
                            message: 'Сервер не доступен',
                            error: response
                        })
}

class Api {
    constructor(config) {
        this._url = config.url;
        this._headers = config.headers;
    }

    getAllCats() {
        return fetch(`${this._url}/show`)
            .then(onResponse)
    }

    getCatById(id) {
        return fetch(`${this._url}/show/${id}`)
            .then(onResponse)
    }

    addCat(bodyData) {
        return fetch(`${this._url}/add`, {
                method: "POST",
                headers: this._headers,
                body: JSON.stringify(bodyData)
            })
            .then(onResponse)
    }

    updateCat(id, bodyData) {
        return fetch(`${this._url}/update/${id}`, {
                method: "PUT",
                headers: this._headers,
                body: JSON.stringify(bodyData)
            })
            .then(onResponse)
    }

    deleteCat(id) {
        return fetch(`${this._url}/delete/${id}`, {
                method: "DELETE",
                headers: this._headers,
            })
            .then(onResponse)
    }

}

const api = new Api({
    url: 'https://sb-cats.herokuapp.com/api',
    headers: {
        "Content-type": "application/json",
        "Accept": "application/json"
    }
})