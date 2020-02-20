const elasticserach = require('elasticsearch');
const fs = require('fs');

const client = elasticserach.Client({
    host:'127.0.0.1:9200',
    log: 'error'
});

client.ping({ requestTimeout: 30000},(error)=>{
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('Everything is ok');
    }
});

//example : bulkIndex('pokemon','pokemons',one pokemon data);
/*
    index: database
    type: table
*/
const bulkIndex = (index,type,data)=>{
    let bulkBody =[];
    data.forEach(item => {
        bulkBody.push({
            index: {
                _index: index,
                _type: type,
                _id: item.id
            }
        });       
        bulkBody.push(item);
    });
    client.bulk({body:bulkBody }).then((response)=>{
        let errorCount = 0;
        response.items.forEach(item=>{
            if(item.index && item.index.error){
                console.log(++errorCount, item.index.error);
            }
        });
        console.log(
            `Successfully indexed ${data.length - errorCount}
             out of ${data.length} items`
          );
    }).catch(error=>{
        console.log(error);
    })    
};

const search = function search(index, body) {
    return client.search({index: index, body: body});
};

module.exports = ()=>{
    return {
        indexData : async () =>{
            const data = await fs.readFileSync('./app/data/seed.json');
            const tData = JSON.parse(data);
            console.log(`${tData.length} items parsed from data file`);
            bulkIndex('pokemon','pokemons',tData);
        },
        indices: async ()=> {
            return await client.cat.indices({v:true});
        },
        searchAll: async (size,from)=>{
            let body = {
                size: size,
                from: from,
                query: {
                  match_all: {}
                }
            };
            return await search('pokemon', body);
        },
        searchOne: async (size,from,query)=>{
            let body = {
                size: 4,
                from: 0,
                query: query
            };
          
            console.log(`retrieving documents whose journal matches '${body.query}' (displaying ${body.size} items at a time)...`);
            return await search('pokemon', body);
        }
    }
} 