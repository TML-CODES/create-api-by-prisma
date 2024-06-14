exports.booleanify =  (value) => {
    const truthy = [
        'true',
        'True',
        '1'
    ]

    return truthy.includes(String(value))
}

exports.buildSqlToPrismaClosures = (orderBy) => {
    let orderByObj = undefined;

    if(orderBy){
        if(typeof orderBy === 'string'){
            const field = orderBy.split(' ')[0];
            const order = orderBy.split(' ')[1].toLowerCase();
            orderByObj = (field && order) 
                ? { [field]: order } 
                : {}
            ;
        }else{
            orderByObj = orderBy;
        }
    }

    return {
        orderBy: orderByObj
    };
}