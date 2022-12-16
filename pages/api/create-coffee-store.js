import { table, mapRecords } from '../../lib/airtable'

const createCoffeeStore = async (req, res) => {

    if (req.method === 'POST') {
        const {id, name, neighborhood, address, imgUrl, voting} = req.body;

        try {
            if (id) {
                const findCoffeeStoreRecords = await table
                .select({
                    filterByFormula: `id="${id}"`,
                })
                .firstPage();
            
                if (findCoffeeStoreRecords.length) {
                    const records = mapRecords(findCoffeeStoreRecords)
                    res.json(records);
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
                        const records = mapRecords(createRecords)
                        res.json({records})
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
