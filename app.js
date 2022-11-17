const express = require('express');
const app = express();

// #########################

app.get('/', function (req, res) {
    return res.send('Hello World');
});

// routes

app.get('/mean?:nums', function (req, res) {
    try {
        let nums = req.query.nums;
        let arr = nums.split(',');
        let sum = 0;

        for (let num of arr) {
            let int = Number(num);
            sum += int;
        }

        let mean = sum/arr.length;
        return res.json({operation: 'mean', value: mean})
    } catch (e) {
        next(e)
    }
});


app.get('/median?:nums', function (req, res) {
    let nums = req.query.nums;
    let arr = nums.split(',');
    let sortedArr = arr.sort((a,b) => a-b);
    let middleIndex = Math.floor(sortedArr.length / 2);

    if (sortedArr.length % 2 === 0) {
        return res.json({operation: 'median', value: (sortedArr[middleIndex-1]+sortedArr[middleIndex])/2});
    } else {
        return res.json({operation: 'median', value: `${sortedArr[middleIndex]}`});
    }
});


app.get('/mode?:nums', function (req, res) {
    let nums = req.query.nums;
    let arr = nums.split(',');
    let sortedArr = arr.sort((a, b) => a - b);

    let highestCount = 1;
    let accumulator = 1;

    let highestCountElement = sortedArr[0];
    let currentElem = sortedArr[0];

    for (let i=1; i<sortedArr.length; i++) {
        if (sortedArr[i-1] !== sortedArr[i]) {
            if (accumulator > highestCount) {
                highestCount = accumulator;
                highestCountElement = currentElem;
            }
            accumulator = 0;
            currentElem = sortedArr[i];
        }
        accumulator++;
    }
    if (accumulator > highestCount) {
        res.json({operation: 'mode', value: `${currentElem}`});
    } else {
        res.json({ operation: 'mode', value: `${highestCountElement}`});
    }
});

// error handling

app.use((req, res, next) => {
    const e = new ExpressError("Bad Request", 400)
    next(e)
})

app.use(function (err, req, res) {
    let status = err.status || 404;
    let message = err.msg;

    return res.status(status).json({
        error: { message, status }
    });
});



app.listen(3000, function () {
    console.log('App on port 3000');
})