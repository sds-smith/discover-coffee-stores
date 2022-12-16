import { findCoffeeStoreRecords } from "../../utils/index.utils";

const getCoffeeStoreById = async (req, res) => {
    const {id} = req.query;

    try {
        if (id) {
            const coffeeStoreRecords = await findCoffeeStoreRecords(id)
            
            if (coffeeStoreRecords.length) {
                res.json(coffeeStoreRecords);
            } else {
                res.json({message: `id could not be found`})
            }
        } else {
            res.status(400).json({ message: 'Missing required ID'})
        }
    } catch (err) {
        res.status(500).json({message: "something went wrong", err})
    }
}

export default getCoffeeStoreById