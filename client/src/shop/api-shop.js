const create = (params, credentials, shop) => {
    return fetch('/api/shops/by/'+params.userId,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+credentials.t
        },
        body: shop
    })
        .then((response) => {
            return response.json()
        }).catch((err) => console.log(err))
}

const list = async (signal) => {
    try{
        let response = await fetch('/api/shops',{
            method: 'GET',
            signal: signal
        })
        return response.json()
    }catch (err) {
        console.log(err)

    }
}
const listByOwner = async (params, credentials, signal) => {
    try{
        let response = await fetch('/api/shops/by/'+params.userId,{
            method: 'GET',
        headers:{
                'Accept': 'application/json',
                'Authorization': 'Bearer '+credentials.t
        },
            signal: signal
        })
        return response.json()

    }catch (err) {
        console.log(err)

    }
}
const remove = async (params, credentials) => {
    try {
        let response = await fetch('/api/shops/' + params.shopId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        return response.json()
    } catch(err) {
        console.log(err)
    }
}
const read = async(params, signal) => {
    try{
        let response = await fetch('/api/shops/' + params.shopId, {
            method: 'GET',
            signal: signal
        })
        return await response.json()
    }catch (err) {
        console.log(err)

    }
}
const update = async (params, credentials, shop) => {
    try {
        let response = await fetch('/api/shops/' + params.shopId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: shop
        })
        return response.json()
    } catch(err) {
        console.log(err)
    }
}
export {create, list, listByOwner, remove, read, update}