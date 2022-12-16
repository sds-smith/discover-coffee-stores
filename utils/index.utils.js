import { table, mapRecords } from "../lib/airtable";

export const isEmpty = (obj) => {
    if (obj) {
        return Object.keys(obj).length === 0
    }
    return true
}

export const findCoffeeStoreRecords = async (id) => {
    const records = await table
    .select({
        filterByFormula: `id="${id}"`,
    })
    .firstPage();
    return mapRecords(records)
}

export const fetcher = (url) => fetch(url).then((res) => res.json());