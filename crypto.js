const tokens = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'aerodrome-finance', name: 'Aerodrome Finance', symbol: 'AERO' }
];

function formatNumber(n) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

async function fetchCryptoData() {
  const ids = tokens.map(t => t.id).join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true&include_last_updated_at=true`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const tbody = document.getElementById('crypto-table-body');
    tbody.innerHTML = '';

    tokens.forEach(token => {
      const info = data[token.id];
      if (info) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${token.name}</td>
          <td>${token.symbol}</td>
          <td>$${formatNumber(info.usd)}</td>
          <td style="color:${info.usd_24h_change >= 0 ? 'green' : 'red'}">
            ${formatNumber(info.usd_24h_change)}%
          </td>
          <td>$${formatNumber(info.usd_market_cap)}</td>
          <td>${new Date(info.last_updated_at * 1000).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
      }
    });
  } catch (err) {
    document.getElementById('crypto-table-body').innerHTML =
      `<tr><td colspan="6">Failed to load data.</td></tr>`;
    console.error('API fetch error:', err);
  }
}

fetchCryptoData();
