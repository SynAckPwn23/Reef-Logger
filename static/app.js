function getColorClass(param, value) {
  if (value === null || value === undefined || value === '' || isNaN(value)) return '';
  switch (param) {
    case 'temp':
      if (value >= 24 && value <= 26) return 'table-success';
      else if ((value >= 23.5 && value < 24) || (value > 26 && value <= 26.5)) return 'table-warning';
      else return 'table-danger';

    case 'salinity':
      if (value >= 1025 && value <= 1026) return 'table-success';
      else if ((value >= 1024 && value < 1025) || (value > 1026 && value <= 1027)) return 'table-warning';
      else return 'table-danger';

    case 'ph':
      if (value >= 8.1 && value <= 8.4) return 'table-success';
      else if ((value >= 8.0 && value < 8.1) || (value > 8.4 && value <= 8.5)) return 'table-warning';
      else return 'table-danger';

    case 'mg':
      if (value >= 1250 && value <= 1350) return 'table-success';
      else if ((value >= 1200 && value < 1250) || (value > 1350 && value <= 1400)) return 'table-warning';
      else return 'table-danger';

    case 'ca':
      if (value >= 400 && value <= 450) return 'table-success';
      else if ((value >= 380 && value < 400) || (value > 450 && value <= 470)) return 'table-warning';
      else return 'table-danger';

    case 'kh':
      if (value >= 7 && value <= 9) return 'table-success';
      else if ((value >= 6.5 && value < 7) || (value > 9 && value <= 9.5)) return 'table-warning';
      else return 'table-danger';

    case 'no3':
      if (value >= 1 && value <= 5) return 'table-success';
      else if ((value >= 0.5 && value < 1) || (value > 5 && value <= 10)) return 'table-warning';
      else return 'table-danger';

    case 'po4':
      if (value >= 0.01 && value <= 0.03) return 'table-success';
      else if ((value >= 0.005 && value < 0.01) || (value > 0.03 && value <= 0.05)) return 'table-warning';
      else return 'table-danger';

    default:
      return '';
  }
}

async function loadData() {
  const response = await fetch('/data');
  const data = await response.json();
  data.sort((a, b) => new Date(b.datetime) - new Date(a.datetime)); // più recenti prima


  const tbody = document.querySelector('#dataTable tbody');
  tbody.innerHTML = '';

  data.forEach((entry, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${entry.datetime || ''}</td>
      <td class="${getColorClass('temp', parseFloat(entry.temp))}">${entry.temp ?? ''}</td>
      <td class="${getColorClass('salinity', parseFloat(entry.salinity))}">${entry.salinity ?? ''}</td>
      <td class="${getColorClass('ph', parseFloat(entry.ph))}">${entry.ph ?? ''}</td>
      <td class="${getColorClass('mg', parseFloat(entry.mg))}">${entry.mg ?? ''}</td>
      <td class="${getColorClass('ca', parseFloat(entry.ca))}">${entry.ca ?? ''}</td>
      <td class="${getColorClass('kh', parseFloat(entry.kh))}">${entry.kh ?? ''}</td>
      <td class="${getColorClass('no3', parseFloat(entry.no3))}">${entry.no3 ?? ''}</td>
      <td class="${getColorClass('po4', parseFloat(entry.po4))}">${entry.po4 ?? ''}</td>
      <td>${entry.note ?? ''}</td>
<td><button class="btn btn-danger btn-sm delete-btn" data-datetime="${entry.datetime}">🗑️ Elimina</button></td>
    `;
    tbody.appendChild(tr);
  });

 document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const dt = e.target.getAttribute('data-datetime');
    const conferma = confirm("Sei sicuro di voler eliminare questa riga?");
    if (!conferma) return;
    await fetch(`/delete_by_datetime/${encodeURIComponent(dt)}`, { method: 'DELETE' });
    loadData();
  });
});
  updateCharts(data);
  updateLastReading(data); // 🔄 aggiorna riquadro "Ultima misurazione"
}

function updateCharts(data) {
  const labels = data.map(e => e.datetime);
  const datasets = {
    temp: data.map(e => e.temp ?? null),
    sal: data.map(e => e.salinity ?? null),
    ph: data.map(e => e.ph ?? null),
    mg: data.map(e => e.mg ?? null),
    ca: data.map(e => e.ca ?? null),
    kh: data.map(e => e.kh ?? null),
    no3: data.map(e => e.no3 ?? null),
    po4: data.map(e => e.po4 ?? null)
  };

  ['chartTemp','chartSal','chartPH','chartMg','chartCa','chartKh','chartNo3','chartPo4'].forEach(key => {
    if (window[key] instanceof Chart) {
      window[key].destroy();
    }
  });

  const createChart = (id, label, data, color) => {
    const ctx = document.getElementById(id).getContext('2d');
    window[id] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label,
          data,
          borderColor: color,
          fill: false,
          spanGaps: true
        }]
      }
    });
  };

  createChart('chartTemp', 'Temp (°C)', datasets.temp, 'rgba(255,159,64,1)');
  createChart('chartSal', 'Sal (ppt)', datasets.sal, 'rgba(144,238,144,1)');
  createChart('chartPH', 'pH', datasets.ph, 'rgba(75,114,74,1)');
  createChart('chartMg', 'Mg (mg/l)', datasets.mg, 'rgba(54,162,235,1)');
  createChart('chartCa', 'Ca (mg/l)', datasets.ca, 'rgba(255,99,132,1)');
  createChart('chartKh', 'KH (°dH)', datasets.kh, 'rgba(75,192,192,1)');
  createChart('chartNo3', 'NO3 (mg/l)', datasets.no3, 'rgba(255,206,86,1)');
  createChart('chartPo4', 'PO4 (mg/l)', datasets.po4, 'rgba(153,102,255,1)');
}

function updateLastReading(data) {
  if (data.length > 0) {
    const lastDateStr = data[0].datetime;
    const lastDate = new Date(lastDateStr);

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };

    const formattedDate = lastDate.toLocaleString('it-IT', options);
    const titleEl = document.getElementById('lastReadingTitle');
    titleEl.innerHTML = `📋 Ultima misurazione & suggerimenti <small class="text-muted">(${formattedDate})</small>`;
  }

  const container = document.getElementById('lastReadingSummary');
  container.innerHTML = '';

  if (!data.length) {
    container.innerHTML = '<div class="col-12 text-muted">Nessuna misurazione disponibile.</div>';
    return;
  }

  const last = data[0];
  const parameters = [
    { key: 'temp', label: '🌡 Temp', unit: '°C', ideal: [24, 26] },
    { key: 'salinity', label: '🌊 Densità', unit: '', ideal: [1025, 1026] },
    { key: 'ph', label: '🧪 pH', unit: '', ideal: [8.1, 8.4] },
    { key: 'mg', label: '🧲 Mg', unit: 'mg/l', ideal: [1250, 1350] },
    { key: 'ca', label: '🦴 Ca', unit: 'mg/l', ideal: [400, 450] },
    { key: 'kh', label: '💧 KH', unit: '°dH', ideal: [7, 9] },
    { key: 'no3', label: '🌿 NO₃', unit: 'mg/l', ideal: [1, 5] },
    { key: 'po4', label: '🟣 PO₄', unit: 'mg/l', ideal: [0.01, 0.03] },
  ];

  let hasValidData = false;

parameters.forEach(param => {
  const value = parseFloat(last[param.key]);
  if (isNaN(value)) return;

  hasValidData = true;

  const [min, max] = param.ideal;
  const status = value < min ? '⚠️ Basso' : (value > max ? '⚠️ Alto' : '✅ OK');

  let suggestion = '';

  if (param.key === 'mg') {
    if (value < min) suggestion = '<br/><small class="text-danger">➕ Aggiungi Mg</small>';
    else if (value > max) suggestion = '<br/><small class="text-warning">🔽 Verifica consumo Mg</small>';
  }

  if (param.key === 'kh') {
    if (value < min) suggestion = '<br/><small class="text-danger">➕ Aumenta KH</small>';
    else if (value > max) suggestion = '<br/><small class="text-warning">🔽 Riduci buffer KH</small>';
  }

  if (param.key === 'no3') {
    if (value < min) suggestion = '<br/><small class="text-warning">🔁 Nutri di più</small>';
    else if (value > max) suggestion = '<br/><small class="text-danger">🔽 Cambi acqua o assorbitori NO3</small>';
  }

  if (param.key === 'po4') {
    if (value < min) suggestion = '<br/><small class="text-warning">🔁 Nutri di più o integra PO4</small>';
    else if (value > max) suggestion = '<br/><small class="text-danger">🔽 Riduci alimentazione o usa PO4 remover</small>';
  }

  if (param.key === 'ca') {
    if (value < min) suggestion = '<br/><small class="text-danger">➕ Aggiungi Ca</small>';
    else if (value > max) suggestion = '<br/><small class="text-warning">🔽 Riduci dosaggio Ca</small>';
  }

  if (param.key === 'ph') {
    if (value < min) suggestion = '<br/><small class="text-warning">💨 Migliora aerazione</small>';
    else if (value > max) suggestion = '<br/><small class="text-warning">🧪 Verifica misurazione</small>';
  }

  if (param.key === 'temp') {

    if (value < min) suggestion = '<br/><small class="text-danger">🌡️ Aumenta riscaldamento</small>';
    else if (value > max) suggestion = '<br/><small class="text-danger">❄️ Raffredda l’acqua</small>';
  }

  if (param.key === 'salinity') {
    if (value < min) suggestion = '<br/><small class="text-warning">➕ Aggiungi sale</small>';
    else if (value > max) suggestion = '<br/><small class="text-warning">💧 Aggiungi acqua d’osmosi</small>';
  }

  container.innerHTML += `
    <div class="col-6 col-md-3 col-lg-2 mb-2">
      <div class="p-2 border rounded bg-light">
        <strong>${param.label}</strong><br/>
        ${value} ${param.unit}<br/>
        ${status}
        ${suggestion}
      </div>
    </div>
  `;
});

if (!hasValidData) {
  const noteText = last.note ? `<br/><em>📝 Nota: ${last.note}</em>` : '';
  container.innerHTML = `<div class="col-12 text-muted">⚠️ Nessun parametro valido nella misurazione più recente.${noteText}</div>`;
}
}

document.getElementById('paramForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const data = {
    datetime: document.getElementById('datetime').value,
    temp: parseFloat(document.getElementById('temp').value) || null,
    salinity: parseFloat(document.getElementById('salinity').value) || null,
    ph: parseFloat(document.getElementById('ph').value) || null,
    mg: parseFloat(document.getElementById('mg').value) || null,
    ca: parseFloat(document.getElementById('ca').value) || null,
    kh: parseFloat(document.getElementById('kh').value) || null,
    no3: parseFloat(document.getElementById('no3').value) || null,
    po4: parseFloat(document.getElementById('po4').value) || null,
    note: document.getElementById('note').value || null,
  };

  try {
    const response = await fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const result = await response.json();
      alert(result.message || 'Errore durante l’inserimento.');
      return;
    }

    this.reset();
    loadData();
  } catch (err) {
    console.error(err);
    alert("Errore di rete durante l’inserimento.");
  }
});
window.onload = loadData;