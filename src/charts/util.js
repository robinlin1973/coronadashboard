function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}


function findCountryData(data,country,date){
//    country = countryname(country);
    const groups = ['country', 'date'];
    var grouped = {};
    var result = {"confirmed":0,"recovered":0,"deaths":0,"active":0}

    data.forEach(function (a) {
        groups.reduce(function (o, g, i) {  // take existing object,
            o[a[g]] = o[a[g]] || (i + 1 === groups.length ? [] : {}); // or generate new obj, or
            return o[a[g]];                                           // at last, then an array
        }, grouped).push(a);
    });


    try{
        var countrydata=grouped[country][date];
        var confirmed=0,deaths=0,recovered=0;
        if(!countrydata || countrydata.length === 0) {return result;}
        countrydata.forEach(record=>{
            confirmed = confirmed+parseInt(record['confirmed']);
            deaths = deaths+parseInt(record['deaths']);
            recovered = recovered+parseInt(record['recovered']);
        });
//        console.log(confirmed,deaths,recovered);
    }catch(error){
//        console.log("error ", country, date,error);
        return result;
    };

//    if(datatype==='deaths'){
////        if(country==='China'){
////            console.log('deaths ', country, date,datatype,data)
////
////        }
//        return deaths;
//    }else if(datatype==='recovered'){
////        console.log('recovered ', recovered)
//        return recovered;
//    }else if(datatype==='hospitalized'){
//        var hospitalized =confirmed-deaths-recovered;
////        console.log('hospitalized ', hospitalized)
//        return hospitalized;
//    }else{
////        console.error("no matched datadype");
//        return 0;
//    }

    result = {"confirmed":confirmed,"recovered":recovered,"deaths":deaths,"active":(confirmed-recovered-deaths)};

    return result;


}

function latestDate(data){
    const today = new Date();
    const closest = data.reduce((a, b) => a.Date - today < b.Date - today ? a : b);

    return closest.date;
}

function countryname(name){
    if(name==='Mainland China')
    {
        return "China";
    }
    else if(name==='US')
    {
        return "United States";
    }
    else{
        return name;
    }

}


function latestCountry(data,selectedCountry){
//    selectedCountry = countryname(selectedCountry);
    const today = new Date();
    const closest = data.reduce((a, b) => a.Date - today < b.Date - today ? a : b);
    const date= closest.date;
    const latest_data = data.filter((row)=>{return(row.date===date && row.country=== selectedCountry);});
    console.log(date,selectedCountry,latest_data);

    var latest = latest_data.map(function(d) {
      return {
        province: d.province,
        deaths: Math.round(d.deaths),
        confirmed: Math.round(d.confirmed),
        recovered: Math.round(d.recovered),
        active:parseInt(d.confirmed) - parseInt(d.deaths) - parseInt(d.recovered),
      }
    });

    latest.sort(function(a,b) {
        return b.confirmed-a.confirmed;
    });
    console.log("latest",latest);
    return latest;

}

function summarizeCountry(data,selectedCountry){
//    selectedCountry = countryname(selectedCountry);
    var latest = latestCountry(data,selectedCountry);
    var confirmed = latest.reduce((a, b) => +a + +b.confirmed, 0);
    var recovered = latest.reduce((a, b) => +a + +b.recovered, 0);
    var deaths = latest.reduce((a, b) => +a + +b.deaths, 0);
    var active = confirmed-recovered-deaths;

    var summary={"confirmed":confirmed,"recovered":recovered,"deaths":deaths,"active":active};
//    console.log("summary",selectedCountry,summary);
    return summary;
}



function findMax(data, datatype){
    var grouped = {};
    const groups = ['country', 'date'];


    data.forEach(function (a) {
        groups.reduce(function (o, g, i) {  // take existing object,
            o[a[g]] = o[a[g]] || (i + 1 === groups.length ? [] : {}); // or generate new obj, or
            return o[a[g]];                                           // at last, then an array
        }, grouped).push(a);
    });

//    console.log("findMax",grouped);
}


export {groupBy,findCountryData,findMax,summarizeCountry,latestCountry,latestDate};
