function iterFib(n) {
    let arr = [];

    for (let i = 0; i <= n; i++) {
        if (i === 0) {
            arr.push(0);     
        } else if (i === 1) {
            arr.push(1);
        } else if (i === 2) {
            arr.push(1);
        } else {
            const sum = arr[i-1] + arr[i-2];
            arr.push(sum);
        }
    }

    return arr;
}

console.log(iterFib(8));


function recFib(n) {
    return (n < 2) ? n : recFib(n-1) + recFib(n-2);
}

console.log(recFib(8));

function fact(n) {
    if (n === 1 || n === 0) {
        return n;
    }

    else {
        return n * fact(n-1);
    }
}

// call stack for fact(5): [fact(5)] [5 * fact(4)] [4 * fact[3]] [3 * fact[2]] [2 * fact(1)]
    // unwind: [fact(5)] [5 * fact(4)] [4 * fact[3]] [3 * fact[2]] [2 * fact(1)]
    //  120 <== 5*24=120 <== 4*6=24 <== 3*2=6 <== 2*1=2

