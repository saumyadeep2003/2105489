const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;


const windowSize = 10;


let numbers = [];


async function fetchNumbers(type) {
  try {
    const response = await axios.get(`http://20.244.56.144/test/${type}`);
    return response.data.numbers;
  } catch (error) {
    console.error(`Error fetching ${type} numbers:`, error.message);
    return [];
  }
}


function calculateAverage(numbers) {
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return sum / numbers.length;
}


function updateNumbers(newNumbers) {

  const uniqueNumbers = [...new Set([...numbers, ...newNumbers])].slice(-windowSize);


  const avg = calculateAverage(uniqueNumbers);


  numbers = uniqueNumbers;
  return {
    windowPrevState: numbers.slice(0, numbers.length - newNumbers.length),
    windowCurrState: numbers,
    numbers: newNumbers,
    avg,
  };
}


app.get('/numbers/:type', async (req, res) => {
  const { type } = req.params;


  const newNumbers = await fetchNumbers(type);

  const state = updateNumbers(newNumbers);


  res.json(state);
});


app.listen(port, () => {
  console.log(`Average Calculator server listening at http://localhost:${port}`);
});