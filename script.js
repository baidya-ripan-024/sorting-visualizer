// dom elements
const barsContainer = document.getElementById("bars-container");
const newArrayBtn = document.getElementById("newArrayBtn");
const arraySizeSlider = document.getElementById("arraySize");
const sortingSpeedSlider = document.getElementById("sortingSpeed");
const startSortBtn = document.getElementById("startSortBtn");
const stopSortBtn = document.getElementById("stopSortBtn");
const algorithmSelect = document.getElementById("algorithmSelect");
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

// global variables
let array = [];                                 
let arraySize = parseInt(arraySizeSlider.value, 10);
let animationSpeedMs = 300 - parseInt(sortingSpeedSlider.value, 10); 
let isSorting = false;                              
let stopSorting = false;                              

// utility functions
function disableControls() {
    isSorting = true;
    newArrayBtn.disabled = true;
    arraySizeSlider.disabled = true;
    sortingSpeedSlider.disabled = true;
    algorithmSelect.disabled = true;
    startSortBtn.disabled = true;
    stopSortBtn.disabled = false;
}

function enableControls() {
    isSorting = false;
    newArrayBtn.disabled = false;
    arraySizeSlider.disabled = false;
    sortingSpeedSlider.disabled = false;
    algorithmSelect.disabled = false;
    startSortBtn.disabled = false;
    stopSortBtn.disabled = true;
}

function resetBarColors() {
    document.querySelectorAll('.bar').forEach(bar => {
        bar.style.backgroundColor = 'var(--bar-color)';
    });
}

// Promise-based sleep that can exit early when `stopSorting` is set
const sleep = ms => new Promise(res => {
    if (stopSorting) res();
    else setTimeout(res, ms);
});

// array generation
function generateNewArray() {
    if (isSorting) return;
    array = [];
    barsContainer.innerHTML = '';
    arraySize = parseInt(arraySizeSlider.value, 10);
    stopSorting = false;

    const barWidthPercent = 100 / arraySize - 0.5; // leave 0.5% gap

    for (let i = 0; i < arraySize; i++) {
        const val = Math.floor(Math.random() * 496) + 5; // 5 – 500
        array.push(val);
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${val}px`;
        bar.style.width = `${barWidthPercent}%`;
        barsContainer.appendChild(bar);
    }
    resetBarColors();
    enableControls();
}

// visual swap function
async function swap(arr, i, j, bars) {
    if (stopSorting) return;
    bars[i].style.backgroundColor = 'var(--bar-swap-color)';
    bars[j].style.backgroundColor = 'var(--bar-swap-color)';
    await sleep(animationSpeedMs);
    if (stopSorting) return;

    [arr[i], arr[j]] = [arr[j], arr[i]];
    bars[i].style.height = `${arr[i]}px`;
    bars[j].style.height = `${arr[j]}px`;

    await sleep(animationSpeedMs);
    if (stopSorting) return;
    bars[i].style.backgroundColor = 'var(--bar-color)';
    bars[j].style.backgroundColor = 'var(--bar-color)';
}

// bubble sort
async function bubbleSort() {
    const arr = [...array];
    const bars = document.querySelectorAll('.bar');
    const n = arr.length;

    for (let i = 0; i < n - 1 && !stopSorting; i++) {
        for (let j = 0; j < n - i - 1 && !stopSorting; j++) {
            bars[j].style.backgroundColor = 'var(--bar-compare-color)';
            bars[j + 1].style.backgroundColor = 'var(--bar-compare-color)';
            await sleep(animationSpeedMs);
            if (stopSorting) break;
            if (arr[j] > arr[j + 1]) await swap(arr, j, j + 1, bars);
            else {
                bars[j].style.backgroundColor = 'var(--bar-color)';
                bars[j + 1].style.backgroundColor = 'var(--bar-color)';
            }
        }
        if (!stopSorting) bars[n - 1 - i].style.backgroundColor = 'var(--bar-sorted-color)';
    }
    if (!stopSorting) bars[0].style.backgroundColor = 'var(--bar-sorted-color)';
    array = arr;
}

// selection sort
async function selectionSort() {
    const arr = [...array];
    const bars = document.querySelectorAll('.bar');
    const n = arr.length;
    for (let i = 0; i < n - 1 && !stopSorting; i++) {
        let minIdx = i;
        bars[i].style.backgroundColor = 'var(--bar-pivot-color)';
        for (let j = i + 1; j < n && !stopSorting; j++) {
            bars[j].style.backgroundColor = 'var(--bar-compare-color)';
            await sleep(animationSpeedMs);
            if (stopSorting) break;
            if (arr[j] < arr[minIdx]) {
                if (minIdx !== i) bars[minIdx].style.backgroundColor = 'var(--bar-color)';
                minIdx = j;
            }
            bars[j].style.backgroundColor = 'var(--bar-color)';
        }
        if (stopSorting) break;
        if (minIdx !== i) await swap(arr, i, minIdx, bars);
        bars[i].style.backgroundColor = 'var(--bar-sorted-color)';
    }
    if (!stopSorting) bars[n - 1].style.backgroundColor = 'var(--bar-sorted-color)';
    array = arr;
}

// insertion sort
async function insertionSort() {
    const arr = [...array];
    const bars = document.querySelectorAll('.bar');
    const n = arr.length;
    bars[0].style.backgroundColor = 'var(--bar-sorted-color)';
    for (let i = 1; i < n && !stopSorting; i++) {
        const key = arr[i];
        let j = i - 1;
        bars[i].style.backgroundColor = 'var(--bar-pivot-color)';
        await sleep(animationSpeedMs);
        while (j >= 0 && arr[j] > key && !stopSorting) {
            bars[j].style.backgroundColor = 'var(--bar-compare-color)';
            bars[j + 1].style.backgroundColor = 'var(--bar-compare-color)';
            await sleep(animationSpeedMs);
            arr[j + 1] = arr[j];
            bars[j + 1].style.height = `${arr[j]}px`;
            bars[j + 1].style.backgroundColor = 'var(--bar-sorted-color)';
            bars[j].style.backgroundColor = 'var(--bar-color)';
            j--;
        }
        if (stopSorting) break;
        arr[j + 1] = key;
        bars[j + 1].style.height = `${key}px`;
        for (let k = 0; k <= i; k++) bars[k].style.backgroundColor = 'var(--bar-sorted-color)';
    }
    array = arr;
}

// merge sort
async function mergeSort() {
    const bars = document.querySelectorAll('.bar');

    async function merge(arr, l, m, r) {
        const n1 = m - l + 1,
            n2 = r - m;
        const L = arr.slice(l, m + 1), R = arr.slice(m + 1, r + 1);
        let i = 0, j = 0, k = l;
        while (i < n1 && j < n2 && !stopSorting) {
            if (L[i] <= R[j]) {
                arr[k] = L[i]; bars[k].style.height = `${L[i]}px`; i++;
            } else {
                arr[k] = R[j]; bars[k].style.height = `${R[j]}px`; j++;
            }
            bars[k].style.backgroundColor = 'var(--bar-swap-color)';
            await sleep(animationSpeedMs);
            bars[k].style.backgroundColor = 'var(--bar-sorted-color)';
            k++;
        }
        while (i < n1 && !stopSorting) {
            arr[k] = L[i]; bars[k].style.height = `${L[i]}px`;
            bars[k].style.backgroundColor = 'var(--bar-sorted-color)';
            await sleep(animationSpeedMs); i++; k++;
        }
        while (j < n2 && !stopSorting) {
            arr[k] = R[j]; bars[k].style.height = `${R[j]}px`;
            bars[k].style.backgroundColor = 'var(--bar-sorted-color)';
            await sleep(animationSpeedMs); j++; k++;
        }
    }

    async function mergeRec(arr, l, r) {
        if (l >= r || stopSorting) return;
        const m = Math.floor((l + r) / 2);
        await mergeRec(arr, l, m);
        await mergeRec(arr, m + 1, r);
        await merge(arr, l, m, r);
    }

    await mergeRec(array, 0, array.length - 1);
}

// quick sort
async function quickSortInitialCall() {
    await quickSort(array, 0, array.length - 1, document.querySelectorAll('.bar'));
}

async function quickSort(arr, low, high, bars) {
    if (low >= high || stopSorting) return;
    const pi = await partition(arr, low, high, bars);
    await quickSort(arr, low, pi - 1, bars);
    await quickSort(arr, pi + 1, high, bars);
    // when sub‑array is fully sorted, colour it
    if (!stopSorting) {
        for (let k = low; k <= high; k++) bars[k].style.backgroundColor = 'var(--bar-sorted-color)';
    }
}

async function partition(arr, low, high, bars) {
    const pivot = arr[high];
    bars[high].style.backgroundColor = 'var(--bar-pivot-color)';
    await sleep(animationSpeedMs);
    let i = low - 1;
    for (let j = low; j <= high - 1 && !stopSorting; j++) {
        bars[j].style.backgroundColor = 'var(--bar-compare-color)';
        await sleep(animationSpeedMs);
        if (arr[j] < pivot) {
            i++;
            await swap(arr, i, j, bars);
            bars[i].style.backgroundColor = 'var(--bar-color)'; // reset colour after swap
        }
        bars[j].style.backgroundColor = 'var(--bar-color)';
    }
    await swap(arr, i + 1, high, bars);
    bars[i + 1].style.backgroundColor = 'var(--bar-sorted-color)';
    return i + 1;
}

// heap sort
async function heapSort() {
    const arr = [...array];
    const bars = document.querySelectorAll('.bar');
    const n = arr.length;

    // build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0 && !stopSorting; i--) {
        await heapify(arr, n, i, bars);
    }
    // extract elements
    for (let i = n - 1; i > 0 && !stopSorting; i--) {
        await swap(arr, 0, i, bars);
        bars[i].style.backgroundColor = 'var(--bar-sorted-color)';
        await heapify(arr, i, 0, bars);
    }
    if (!stopSorting) bars[0].style.backgroundColor = 'var(--bar-sorted-color)';
    array = arr;
}

async function heapify(arr, n, i, bars) {
    let largest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest !== i && !stopSorting) {
        await swap(arr, i, largest, bars);
        await heapify(arr, n, largest, bars);
    }
}

// event binding
// new array on load
window.addEventListener('DOMContentLoaded', () => {
    // apply saved theme
    if (localStorage.getItem('theme') === 'light') body.classList.add('light-mode');
    generateNewArray();
});

newArrayBtn.addEventListener('click', generateNewArray);
arraySizeSlider.addEventListener('input', () => { if (!isSorting) generateNewArray(); });
sortingSpeedSlider.addEventListener('input', () => {
    animationSpeedMs = 300 - parseInt(sortingSpeedSlider.value, 10);
});
stopSortBtn.addEventListener('click', () => {
    stopSorting = true;
    enableControls();
    resetBarColors();
});

startSortBtn.addEventListener('click', async () => {
    if (isSorting) return;
    disableControls();
    stopSorting = false;
    switch (algorithmSelect.value) {
        case 'bubble': await bubbleSort(); break;
        case 'selection': await selectionSort(); break;
        case 'insertion': await insertionSort(); break;
        case 'merge': await mergeSort(); break;
        case 'quick': await quickSortInitialCall(); break;
        case 'heap': await heapSort(); break;
        default: console.error('Unknown algorithm');
    }
    if (stopSorting) resetBarColors();
    enableControls();
});


