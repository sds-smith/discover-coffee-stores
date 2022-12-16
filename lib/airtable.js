const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY})
    .base(process.env.AIRTABLE_BASE_KEY);

const table = base('coffee-stores');

const mapRecords = (data) => {
    return data.map((record) => ({
        ...record.fields
    }))
}

export {
    table,
    mapRecords
}