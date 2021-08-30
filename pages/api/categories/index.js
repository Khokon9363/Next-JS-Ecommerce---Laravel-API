async function get(req, res) {
    try {
        return await fetch(`${process.env.API_URL}/categories`).then(res => res.json()).catch(err => err)
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
            res.status(200).json(await get())
            break;
        default:
            res.status(500).json({
                success: false,
                data: 'Server Error !'
            })
            break;
    }
}