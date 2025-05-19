const barsContainer = document.getElementById('bars-container');
const newArrayBtn = document.getElementById('newArrayBtn');
const arraySizeSlider = document.getElementById('arraySize');
const sortingSpeedSlider = document.getElementById('sortingSpeed');
const sortButtons = document.querySelectorAll('.sort-btn');
const stopSortBtn = document.getElementById('stopSortBtn'); // Get Stop button
const darkModeToggle = document.getElementById('darkModeToggle'); // Get Dark Mode Toggle button
const body = document.body;

// --- Global Variables ---
let array = [];
let arraySize = parseInt(arraySizeSlider.value);
let animationSpeedMs = 300 - parseInt(sortingSpeedSlider.value); // Higher value for slower speed
let isSorting = false;
let stopSorting = false; // Flag to signal stopping

// --- Utility Functions ---

// Function to generate a random array
function generateNewArray() {
    if (isSorting) return; // Prevent generating new array during sorting
    array = [];
    barsContainer.innerHTML = ''; // Clear previous bars
    arraySize = parseInt(arraySizeSlider.value);
    stopSorting = false; // Reset stop flag

    // Calculate bar width dynamically based on array size
    const barWidth = 100 / arraySize - 0.5; // Subtracting 0.5 for a small gap

    for (let i = 0; i < arraySize; i++) {
        // Generate random numbers between 5 and 500 (adjust as needed for height)
        const value = Math.floor(Math.random() * 496) + 5;
        array.push(value);

        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value}px`;
        // bar.style.width = `${barWidth}%`; // Set width dynamically
        barsContainer.appendChild(bar);
    }
    // Reset colors when new array is generated
    resetBarColors();
    enableControls(); // Ensure controls are enabled after generating new array
}

// Function to reset all bar colors to default
function resetBarColors() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.style.backgroundColor = 'var(--bar-color)';
    });
}

// Function to introduce a delay for visualization and check stop flag
const sleep = (ms) => new Promise(resolve => {
    if (stopSorting) {
        resolve(); // Resolve immediately if stopping
    } else {
        setTimeout(resolve, ms);
    }
});

// Function to swap two elements in the array and visualize it
async function swap(arr, i, j, bars) {
    if (stopSorting) return; // Check stop flag before swapping

    // Highlight elements being swapped
    bars[i].style.backgroundColor = 'var(--bar-swap-color)';
    bars[j].style.backgroundColor = 'var(--bar-swap-color)';
    await sleep(animationSpeedMs);
    if (stopSorting) return; // Check again after sleep

    // Swap values in the array
    [arr[i], arr[j]] = [arr[j], arr[i]];

    // Update bar heights
    bars[i].style.height = `${arr[i]}px`;
    bars[j].style.height = `${arr[j]}px`;
    await sleep(animationSpeedMs); // Short delay after swap for visual confirmation
    if (stopSorting) return; // Check again after sleep

    // Reset colors
    bars[i].style.backgroundColor = 'var(--bar-color)';
    bars[j].style.backgroundColor = 'var(--bar-color)';
}

// Function to disable all control buttons during sorting
function disableControls() {
    newArrayBtn.disabled = true;
    arraySizeSlider.disabled = true;
    sortingSpeedSlider.disabled = true;
    sortButtons.forEach(btn => btn.disabled = true);
    stopSortBtn.disabled = false; // Enable stop button
    isSorting = true;
}

// Function to enable all control buttons after sorting or stopping
function enableControls() {
    newArrayBtn.disabled = false;
    arraySizeSlider.disabled = false;
    sortingSpeedSlider.disabled = false;
    sortButtons.forEach(btn => btn.disabled = false);
    stopSortBtn.disabled = true; // Disable stop button
    isSorting = false;
}

// --- Sorting Algorithms ---
/**
 * Bubble Sort
 * Selection Sort
 * Insertion Sort
 * Merge Sort
 * Quick Sort 
 * Heap Sort
 */

// Bubble Sort (Example Implementation)
async function bubbleSort() {
    disableControls();
    const arr = [...array]; // Work on a copy to avoid modifying original array directly
    const bars = document.querySelectorAll('.bar');
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        if (stopSorting) break; // Check stop flag
        for (let j = 0; j < n - i - 1; j++) {
            if (stopSorting) break; // Check stop flag
            // Highlight elements being compared
            bars[j].style.backgroundColor = 'var(--bar-compare-color)';
            bars[j + 1].style.backgroundColor = 'var(--bar-compare-color)';
            await sleep(animationSpeedMs);
            if (stopSorting) break; // Check after sleep

            if (arr[j] > arr[j + 1]) {
                await swap(arr, j, j + 1, bars);
                if (stopSorting) break; // Check after swap
            } else {
                // If no swap, reset colors after comparison
                bars[j].style.backgroundColor = 'var(--bar-color)';
                bars[j + 1].style.backgroundColor = 'var(--bar-color)';
            }
        }
        if (stopSorting) break; // Check stop flag
        // Mark the largest element (which is now in its correct place) as sorted
        bars[n - 1 - i].style.backgroundColor = 'var(--bar-sorted-color)';
    }
    // Ensure all bars are colored correctly at the end or if stopped
    if (!stopSorting) {
        bars[0].style.backgroundColor = 'var(--bar-sorted-color)'; // Mark the first element as sorted
    }
    resetBarColors(); // Reset colors if stopped mid-sort
    enableControls();
}

// Selection Sort
async function selectionSort() {
    const arr = [...array];
    const bars = document.querySelectorAll('.bar');
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        if (stopSorting) break;
        let min_idx = i;
        bars[i].style.backgroundColor = 'var(--bar-pivot-color)'; // Highlight current position

        for (let j = i + 1; j < n; j++) {
            if (stopSorting) break;
            bars[j].style.backgroundColor = 'var(--bar-compare-color)';
            await sleep(animationSpeedMs);
            if (stopSorting) break;

            if (arr[j] < arr[min_idx]) {
                if (min_idx !== i) bars[min_idx].style.backgroundColor = 'var(--bar-color)'; // Reset old min_idx
                min_idx = j;
                bars[min_idx].style.backgroundColor = 'var(--bar-compare-color)'; // Keep new min_idx highlighted
            } else {
                bars[j].style.backgroundColor = 'var(--bar-color)'; // Reset j if not new min
            }
        }
        if (stopSorting) break;
        // After finding min_idx, swap if necessary
        if (min_idx !== i) {
            await swap(arr, i, min_idx, bars);
            if (stopSorting) break;
        } else {
            bars[i].style.backgroundColor = 'var(--bar-color)'; // Reset original pivot color if no swap
        }
        bars[i].style.backgroundColor = 'var(--bar-sorted-color)'; // Mark as sorted
    }
    if (!stopSorting) {
        bars[n - 1].style.backgroundColor = 'var(--bar-sorted-color)'; // Mark last element as sorted
    }
    resetBarColors();
    enableControls();
}

// Insertion Sort
async function insertionSort() {
    const arr = [...array];
    const bars = document.querySelectorAll('.bar');
    const n = arr.length;

    if (!stopSorting) bars[0].style.backgroundColor = 'var(--bar-sorted-color)'; // First element is considered sorted

    for (let i = 1; i < n; i++) {
        if (stopSorting) break;
        let key = arr[i];
        let j = i - 1;

        bars[i].style.backgroundColor = 'var(--bar-pivot-color)'; // Element to be inserted
        await sleep(animationSpeedMs);
        if (stopSorting) break;

        while (j >= 0 && arr[j] > key) {
            if (stopSorting) break;
            bars[j].style.backgroundColor = 'var(--bar-compare-color)';
            bars[j + 1].style.backgroundColor = 'var(--bar-compare-color)';
            await sleep(animationSpeedMs);
            if (stopSorting) break;

            // Shift element to the right
            arr[j + 1] = arr[j];
            bars[j + 1].style.height = `${arr[j]}px`;
            bars[j + 1].style.backgroundColor = 'var(--bar-sorted-color)'; // Mark as sorted during shift
            bars[j].style.backgroundColor = 'var(--bar-color)'; // Reset color of element moved
            await sleep(animationSpeedMs);
            if (stopSorting) break;

            j--;
        }
        if (stopSorting) break;
        arr[j + 1] = key;
        bars[j + 1].style.height = `${key}px`;
        bars[j + 1].style.backgroundColor = 'var(--bar-sorted-color)'; // Mark as sorted

        // Reset colors of elements that were compared but not moved
        for (let k = 0; k <= i; k++) {
            if (stopSorting) break;
            bars[k].style.backgroundColor = 'var(--bar-sorted-color)';
        }
        if (stopSorting) break;
    }
    resetBarColors();
    enableControls();
}


// Merge Sort
async function mergeSort(l = 0, r = array.length - 1) {
    const arr = array; // Use the global array directly
    const bars = document.querySelectorAll('.bar');

    async function merge(arr, l, m, r) {
        if (stopSorting) return;
        const n1 = m - l + 1;
        const n2 = r - m;

        const L = new Array(n1);
        const R = new Array(n2);

        for (let i = 0; i < n1; i++) {
            if (stopSorting) return;
            L[i] = arr[l + i];
            bars[l + i].style.backgroundColor = 'var(--bar-compare-color)';
        }
        for (let j = 0; j < n2; j++) {
            if (stopSorting) return;
            R[j] = arr[m + 1 + j];
            bars[m + 1 + j].style.backgroundColor = 'var(--bar-compare-color)';
        }
        await sleep(animationSpeedMs); // Highlight sub-arrays being merged
        if (stopSorting) return;

        let i = 0;
        let j = 0;
        let k = l;

        while (i < n1 && j < n2) {
            if (stopSorting) return;
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                bars[k].style.height = `${L[i]}px`;
                bars[k].style.backgroundColor = 'var(--bar-swap-color)'; // Temporarily show placement
                i++;
            } else {
                arr[k] = R[j];
                bars[k].style.height = `${R[j]}px`;
                bars[k].style.backgroundColor = 'var(--bar-swap-color)'; // Temporarily show placement
                j++;
            }
            await sleep(animationSpeedMs);
            if (stopSorting) return;
            bars[k].style.backgroundColor = 'var(--bar-sorted-color)'; // Mark as sorted
            k++;
        }

        while (i < n1) {
            if (stopSorting) return;
            arr[k] = L[i];
            bars[k].style.height = `${L[i]}px`;
            bars[k].style.backgroundColor = 'var(--bar-swap-color)';
            await sleep(animationSpeedMs);
            if (stopSorting) return;
            bars[k].style.backgroundColor = 'var(--bar-sorted-color)';
            i++;
            k++;
        }

        while (j < n2) {
            if (stopSorting) return;
            arr[k] = R[j];
            bars[k].style.height = `${R[j]}px`;
            bars[k].style.backgroundColor = 'var(--bar-swap-color)';
            await sleep(animationSpeedMs);
            if (stopSorting) return;
            bars[k].style.backgroundColor = 'var(--bar-sorted-color)';
            j++;
            k++;
        }
        // Reset colors for the merged segment to default if they weren't explicitly marked sorted
        for (let x = l; x <= r; x++) {
            if (stopSorting) return;
            if (bars[x].style.backgroundColor !== 'var(--bar-sorted-color)') {
                bars[x].style.backgroundColor = 'var(--bar-color)';
            }
        }
    }

    async function mergeSortRecursive(arr, l, r) {
        if (stopSorting) return;
        if (l < r) {
            const m = Math.floor(l + (r - l) / 2);

            // Highlight the current segment being divided
            for (let i = l; i <= r; i++) {
                if (stopSorting) return;
                bars[i].style.backgroundColor = 'var(--bar-pivot-color)';
            }
            await sleep(animationSpeedMs * 1.5); // A longer pause for division visualization
            if (stopSorting) return;
            for (let i = l; i <= r; i++) {
                if (stopSorting) return;
                bars[i].style.backgroundColor = 'var(--bar-color)'; // Reset after division
            }

            await mergeSortRecursive(arr, l, m);
            if (stopSorting) return;
            await mergeSortRecursive(arr, m + 1, r);
            if (stopSorting) return;
            await merge(arr, l, m, r);
        }
    }

    await mergeSortRecursive(arr, l, r);
    resetBarColors();
    enableControls();
}


// Quick Sort
async function quickSortInitialCall() {
    const arr = array; // Work on the global array directly
    const bars = document.querySelectorAll('.bar');
    await quickSort(arr, 0, arr.length - 1, bars);
    resetBarColors();
    enableControls();
}

async function quickSort(arr, low, high, bars) {
    if (stopSorting) return;
    if (low < high) {
        let pi = await partition(arr, low, high, bars);
        if (stopSorting) return;

        // Recursively sort elements before and after partition
        await quickSort(arr, low, pi - 1, bars);
        if (stopSorting) return;
        await quickSort(arr, pi + 1, high, bars);
        if (stopSorting) return;
    }
    // Mark elements as sorted if they are part of a fully sorted partition
    if (!stopSorting && low >= 0 && high < arr.length) {
        for (let k = low; k <= high; k++) {
            if (stopSorting) return;
            bars[k].style.backgroundColor = 'var(--bar-sorted-color)';
        }
    }
}

async function partition(arr, low, high, bars) {
    if (stopSorting) return low - 1; // Return an invalid index if stopping
    let pivot = arr[high];
    bars[high].style.backgroundColor = 'var(--bar-pivot-color)'; // Highlight pivot
    await sleep(animationSpeedMs);
    if (stopSorting) return low - 1;

    let i = (low - 1); // Index of smaller element

    for (let j = low; j <= high - 1; j++) {
        if (stopSorting) return low - 1;
        bars[j].style.backgroundColor = 'var(--bar-compare-color)'; // Highlight element being compared
        await sleep(animationSpeedMs);
        if (stopSorting) return low - 1;

        if (arr[j] < pivot) {
            i++;
            await swap(arr, i, j, bars);
            if (stopSorting) return low - 1;
            if (!stopSorting) bars[i].style.backgroundColor = 'var(--bar-sorted-color)'; // Mark as sorted in place
        } else {
            bars[j].style.backgroundColor = 'var(--bar-color)'; // Reset if not swapped
        }
    }

    // Place the pivot element in its correct position
    await swap(arr, i + 1, high, bars);
    if (stopSorting) return low - 1;
    if (!stopSorting) bars[i + 1].style.backgroundColor = 'var(--bar-sorted-color)'; // Mark pivot as sorted
    return (i + 1);
}

// Heap Sort
async function heapSort() {
    const arr = [...array];
    const bars = document.querySelectorAll('.bar');
    const n = arr.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        if (stopSorting) break;
        await heapify(arr, n, i, bars);
        if (stopSorting) break;
    }

    // One by one extract an element from heap
    for (let i = n - 1; i > 0; i--) {
        if (stopSorting) break;
        // Move current root to end
        await swap(arr, 0, i, bars);
        if (stopSorting) break;
        if (!stopSorting) bars[i].style.backgroundColor = 'var(--bar-sorted-color)'; // Mark as sorted

        // call max heapify on the reduced heap
        await heapify(arr, i, 0, bars);
        if (stopSorting) break;
    }
    if (!stopSorting) bars[0].style.backgroundColor = 'var(--bar-sorted-color)'; // Mark the last element as sorted
    resetBarColors();
    enableControls();
}

async function heapify(arr, n, i, bars) {
    if (stopSorting) return;
    let largest = i; // Initialize largest as root
    let left = 2 * i + 1; // left = 2*i + 1
    let right = 2 * i + 2; // right = 2*i + 2

    // Highlight current root being heapified
    bars[i].style.backgroundColor = 'var(--bar-pivot-color)';
    await sleep(animationSpeedMs);
    if (stopSorting) return;

    // If left child is larger than root
    if (left < n) {
        bars[left].style.backgroundColor = 'var(--bar-compare-color)';
        await sleep(animationSpeedMs);
        if (stopSorting) return;
        if (arr[left] > arr[largest]) {
            if (largest !== i) bars[largest].style.backgroundColor = 'var(--bar-color)'; // Reset old largest
            largest = left;
        } else {
            bars[left].style.backgroundColor = 'var(--bar-color)'; // Reset if not largest
        }
    }

    // If right child is larger than largest so far
    if (right < n) {
        bars[right].style.backgroundColor = 'var(--bar-compare-color)';
        await sleep(animationSpeedMs);
        if (stopSorting) return;
        if (arr[right] > arr[largest]) {
            if (largest !== i && largest !== left) bars[largest].style.backgroundColor = 'var(--bar-color)'; // Reset old largest
            largest = right;
        } else {
            bars[right].style.backgroundColor = 'var(--bar-color)'; // Reset if not largest
        }
    }

    // If largest is not root
    if (largest !== i) {
        await swap(arr, i, largest, bars);
        if (stopSorting) return;
        bars[i].style.backgroundColor = 'var(--bar-color)'; // Reset after swap
        await heapify(arr, n, largest, bars); // Recursively heapify the affected sub-tree
    } else {
        bars[i].style.backgroundColor = 'var(--bar-color)'; // Reset if no change
    }
}


// --- Event Listeners ---

// Generate new array on page load
document.addEventListener('DOMContentLoaded', generateNewArray);

// Event listener for "New Array" button
newArrayBtn.addEventListener('click', generateNewArray);

// Event listener for array size slider
arraySizeSlider.addEventListener('input', () => {
    if (!isSorting) { // Only regenerate if not sorting
        generateNewArray();
    }
});

// Event listener for sorting speed slider
sortingSpeedSlider.addEventListener('input', () => {
    animationSpeedMs = 300 - parseInt(sortingSpeedSlider.value);
});

// Event listener for Stop button
stopSortBtn.addEventListener('click', () => {
    stopSorting = true;
    enableControls(); // Enable controls immediately on stop
    resetBarColors(); // Reset bar colors when stopped
});


// Event listeners for sorting buttons
document.getElementById('bubbleSortBtn').addEventListener('click', bubbleSort);
document.getElementById('selectionSortBtn').addEventListener('click', async () => {
    if (isSorting) return;
    disableControls();
    await selectionSort();
    enableControls();
});
document.getElementById('insertionSortBtn').addEventListener('click', async () => {
    if (isSorting) return;
    disableControls();
    await insertionSort();
    enableControls();
});
document.getElementById('mergeSortBtn').addEventListener('click', async () => {
    if (isSorting) return;
    disableControls();
    await mergeSort();
    enableControls();
});
document.getElementById('quickSortBtn').addEventListener('click', async () => {
    if (isSorting) return;
    disableControls();
    await quickSortInitialCall(); // Use an initial call for quicksort
    enableControls();
});
document.getElementById('heapSortBtn').addEventListener('click', async () => {
    if (isSorting) return;
    disableControls();
    await heapSort();
    enableControls();
});

// Event listener for Dark Mode Toggle button
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode'); // Toggle the light-mode class
    // Save the preference to local storage
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
    // Reset bar colors to apply the new theme colors immediately
    resetBarColors();
});