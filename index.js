const CURRENCY_CODE = {
  USD: 'usd',
  EUR: 'eur',
  AUD: 'aud',
  CAD: 'cad',
  CHF: 'chf',
  NZD: 'nzd',
  BGN: 'bgn',
};

window.DEFAULT_CURRENCY = 'usd';

window.onload = () => {
  let l = localStorage.getItem('DEFAULT_CURRENCY');
  window.DEFAULT_CURRENCY = l || window.DEFAULT_CURRENCY;

  axios
    .get(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${window.DEFAULT_CURRENCY}.json`,
    )
    .then((response) => {
      renderCurrency(response);
    });
  let select = document.getElementById('mySelect');
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value === window.DEFAULT_CURRENCY) {
      select.options[i].selected = 'selected';
    }
  }
};

function sortProperties(obj) {
  var sortable = [];
  for (var key in obj)
    if (obj.hasOwnProperty(key)) sortable.push([key, obj[key]]);

  sortable.sort(function (a, b) {
    return a[1] - b[1];
  });
  return sortable;
}

const renderCurrency = (response) => {
  const { data } = response;

  document.getElementById('date').innerHTML = data.date;

  let group1 = {};
  let group2 = {};
  let group3 = {};
  let arrLength = 0;

  Object.keys(data[window.DEFAULT_CURRENCY]).map((currencyCode) => {
    if (
      Object.values(CURRENCY_CODE).includes(currencyCode) &&
      currencyCode !== window.DEFAULT_CURRENCY
    ) {
      if (
        Math.abs(Number(data[window.DEFAULT_CURRENCY][currencyCode]) - 1) <= 0.5
      ) {
        arrLength += 1;
      }

      if (Number(data[window.DEFAULT_CURRENCY][currencyCode]) < 1) {
        group1[currencyCode] = data[window.DEFAULT_CURRENCY][currencyCode];
      } else if (
        Number(data[window.DEFAULT_CURRENCY][currencyCode]) >= 1 &&
        Number(data[window.DEFAULT_CURRENCY][currencyCode]) < 1.5
      ) {
        group2[currencyCode] = data[window.DEFAULT_CURRENCY][currencyCode];
      } else if (Number(data[window.DEFAULT_CURRENCY][currencyCode]) >= 1.5) {
        group3[currencyCode] = data[window.DEFAULT_CURRENCY][currencyCode];
      }
    }
  });

  let groupOne = '';
  sortProperties(group1).map((el) => {
    groupOne += `
    <div>
     <p>${window.DEFAULT_CURRENCY.toUpperCase()}-${el[0].toUpperCase()} ${el[1].toFixed(
      2,
    )} </p>
    </div>
    `;
  });
  groupOne += `<p>Count: ${Object.keys(group1).length}</p>`;

  let groupTwo = '';
  sortProperties(group2).map((el) => {
    groupTwo += `
    <div>
     <p>${window.DEFAULT_CURRENCY.toUpperCase()}-${el[0].toUpperCase()} ${el[1].toFixed(
      2,
    )} </p>
    </div>
    `;
  });
  groupTwo += `<p>Count: ${Object.keys(group2).length}</p>`;

  let groupThree = '';
  sortProperties(group3).map((el) => {
    groupThree += `
    <div>
     <p>${window.DEFAULT_CURRENCY.toUpperCase()}-${el[0].toUpperCase()} ${el[1].toFixed(
      2,
    )} </p>
    </div>
    `;
  });
  groupThree += `<p>Count: ${Object.keys(group3).length}</p>`;

  document.getElementById('group1-data').innerHTML = groupOne;
  document.getElementById('group2-data').innerHTML = groupTwo;
  document.getElementById('group3-data').innerHTML = groupThree;
  document.getElementById(
    'demo',
  ).innerHTML = `<p id="array"> Longest array length is ${arrLength}</p>`;
};

function changeCurrency() {
  let c = document.getElementById('mySelect').value;
  window.DEFAULT_CURRENCY = c;
  localStorage.setItem('DEFAULT_CURRENCY', c);
  localStorage.setItem('TIME_EXPIRY_CURRENCY', Date.now());

  document.getElementById('group1-data').innerHTML = '';
  document.getElementById('group2-data').innerHTML = '';
  document.getElementById('group3-data').innerHTML = '';

  axios
    .get(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${window.DEFAULT_CURRENCY}.json`,
    )
    .then((response) => {
      renderCurrency(response);
    });

  document.getElementById('demo').innerHTML = 'You selected: ' + c;
}
