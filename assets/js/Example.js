const myArrayOfCityObjects = [{ cityName: 'Richmond' }, { cityName: 'Austin' }, { cityName: 'New York' }];

const result1 = myArrayOfCityObjects.find((city) => city.cityName === 'Richmond');
const result2 = myArrayOfCityObjects.findIndex((city) => city.cityName === 'Richmond');
const result3 = myArrayOfCityObjects.some((city) => city.cityName === 'Richmond');

console.log(result1);
console.log(result2);
console.log(result3);