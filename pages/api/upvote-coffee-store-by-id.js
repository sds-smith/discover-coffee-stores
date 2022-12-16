import { findCoffeeStoreRecords } from "../../utils/index.utils";
import { table } from "../../lib/airtable";

const upvoteCoffeeStoreById = async (req, res) => {
    if (req.method === 'PUT') {
        try {
            const {id} = req.body;

            if (id) {
                const records = await findCoffeeStoreRecords(id)
                if (records.length) {
                    const record = records[0]
                    const calculateVoting = parseInt(record.voting) + parseInt(1)

                    const updateRecord = await table.update([
                        {
                            id: record.recordId,
                            fields: {
                                voting: calculateVoting
                            }
                        }
                    ])
                    if (updateRecord) {
                        return res.json(updateRecord)
                    }
                } else {
                    return res.json({message: "Coffee store iid does not exist", id})
                }
            } else {
                return res.status(400).json({message: "Missing required store id."})
            }
        } catch (err) {
            return res.status(500).json({message: "Error upvoting coffee store", err})
        }
    }
}

export default upvoteCoffeeStoreById