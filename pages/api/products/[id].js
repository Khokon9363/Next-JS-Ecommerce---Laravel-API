async function find(params, req, res) {
    try {
        return await fetch(`${process.env.API_URL}/products/category/${params.id}?page=1`).then(res => res.json()).catch(err => err)
    } catch (err) {
        return {
            success: false,
            err
        }
    }
}

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            res.status(200).json(await find(req.query))
            break;
        default:
            res.status(500).json({
                success: false,
                data: 'Server Error !'
            })
            break;
    }
}