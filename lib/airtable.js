const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY})
    .base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_KEY);

const table = base('coffee-stores');

const mapRecords = (recordsArray) => {
    return recordsArray.map((record) => ({
        recordId: record.id,
        ...record.fields
    }))
}

export {
    table,
    mapRecords
}