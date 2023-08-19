function bubbleSort(arr) {
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i+1]) {
                const temp = arr[i];
                arr[i] = arr[i+1];
                arr[i+1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
    return arr;
}

function insertionSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        const NTI = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > NTI) {
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = NTI;
    }
    return arr;
}

function mergeSort(arr) {
    if (arr.length < 2) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    let L = 0;
    let R = 0;
    const merged = [];
    while (L < left.length && R < right.length) {
        if (left[L] < right[R]) {
            merged.push(left[L]);
            L++;
        } else {
            merged.push(right[R]);
            R++;
        }
    }
    const remainder = L < left.length ? {arr:left, index:L} : {arr:right, index:R};
    for (let i = remainder.index; i < remainder.arr.length; i++) {
        merged.push(remainder.arr[i]);
    }
    return merged;
}

function quickSort(arr) {
    if (arr.length < 2) {
        return arr;
    }

    const pivot = arr.pop();
    const left = [];
    const right = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return [...quickSort(left), pivot, ...quickSort(right)];
}

function binarySearch(arr, target) {
    let start = 0;
    let end = arr.length - 1;
    while (start < end) {
        const mid = Math.floor((start + end) / 2);
        if (arr[mid] === target) {
            return mid;
        }
        if (target < arr[mid]) {
            end = mid - 1;
        } else {
            start = mid + 1;
        }
    }
    return -1;
}

function recBinary(arr, target) {
    return search(arr, target, 0, arr.length - 1);
}

function search(arr, target, start, end) {
    if (start > end) return -1;

    const mid = Math.floor((start + end) / 2);
    if (arr[mid] === target) return mid;

    if (target < arr[mid]) {
        return search(arr, target, start, mid - 1);
    } else {
        return search(arr, target, mid + 1, end);
    }
}

