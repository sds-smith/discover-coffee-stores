import { table } from '../../lib/airtable'
import { findCoffeeStoreRecords } from '../../utils/index.utils';

const createCoffeeStore = async (req, res) => {

    if (req.method === 'POST') {
        const {id, name, neighborhood, address, imgUrl, voting} = req.body;

        try {
            if (id) {
                const coffeeStoreRecords = await findCoffeeStoreRecords(id)
            
                if (coffeeStoreRecords.length) {
                    res.json(coffeeStoreRecords);
                } else {
                    //create a record
                    if (name) {
                        const createRecords = await table.create([
                            {
                                fields: {
                                    id,
                                    name,
                                    address,
                                    neighborhood,
                                    voting,
                                    imgUrl
                                }
                            }
                        ])
                        res.json({createRecords})
                    } else {
                        res.status(400).json({message: 'Missing required store name'})
                    }
                }
            } else {
                res.status(400).json({message: 'Missing required store id'})
            }

        } catch (err) {
            console.error('Error creating or finding store ', err)
            res.status(500).json({message: 'Error creating or finding store ', err})
        }

    }
}

export default createCoffeeStore
