

class apiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString
    }

    // for filter method 
    filter() {
        const queryobj = { ...this.queryString }
        const rkey = ['page', 'limit', 'sort', 'fields']
        rkey.forEach((el) => delete queryobj[el])

        let querystr = JSON.stringify(queryobj)
        querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        this.query = this.query.find(JSON.parse(querystr))

        return this;

    }

    sorte() {
        if (this.queryString.sort) {
            // for multiple sorting (handling tie)
            const sortquery = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortquery)
        } else {
            this.query = this.query.sort('createAt')
        }
        return this;
    }

    limiting() {
        if (this.queryString.fields) {
            const limquery = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(limquery) // selcect for only showing the field as provided 
        } else {
            this.query = this.query.select('-__v') //- excluding 
        }
        return this;
    }

    pagination() {
        const page = this.query.page * 1;
        const limit = this.query.limit * 1;
        const skip = (page - 1) * limit;


        this.query = this.query.skip(skip).limit(limit);
        return this;


    }


}


module.exports = apiFeatures;
