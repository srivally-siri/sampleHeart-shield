document.addEventListener('DOMContentLoaded', () => {
  const trackerForm = document.getElementById('trackerForm');
  const ctx = document.getElementById('healthChart');
  let chart;

  // Retrieve saved data from localStorage
  let healthData = JSON.parse(localStorage.getItem('healthData')) || {
    dates: [],
    bp: [],
    sugar: [],
    pulse: []
  };

  // Function to render chart
  function renderChart() {
    if (!ctx) return;
    if (chart) chart.destroy(); // Clear old chart

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: healthData.dates,
        datasets: [
          {
            label: 'Blood Pressure (mmHg)',
            data: healthData.bp,
            borderColor: 'red',
            fill: false,
            tension: 0.3
          },
          {
            label: 'Blood Sugar (mg/dL)',
            data: healthData.sugar,
            borderColor: 'green',
            fill: false,
            tension: 0.3
          },
          {
            label: 'Pulse (BPM)',
            data: healthData.pulse,
            borderColor: 'blue',
            fill: false,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // Save health data
  if (trackerForm) {
    trackerForm.addEventListener('submit', e => {
      e.preventDefault();
      const bp = parseInt(document.getElementById('bp').value);
      const sugar = parseInt(document.getElementById('sugar').value);
      const pulse = parseInt(document.getElementById('pulse').value);
      const sleep = parseInt(document.getElementById('sleep').value);
      const date = new Date().toLocaleDateString();

      let msg = "✅ You're healthy! Keep maintaining your routine.";
      if (bp > 140 || sugar > 180 || pulse > 100 || sleep < 6)
        msg = "⚠️ Warning! Some values are out of range. Consult a doctor.";

      document.getElementById('result').innerText = msg;

      // Store data
      healthData.dates.push(date);
      healthData.bp.push(bp);
      healthData.sugar.push(sugar);
      healthData.pulse.push(pulse);

      localStorage.setItem('healthData', JSON.stringify(healthData));

      renderChart();
      trackerForm.reset();
    });
  }

  renderChart();

  // Quiz logic (unchanged)
  const quizForm = document.getElementById('quizForm');
  if (quizForm) {
    quizForm.addEventListener('submit', e => {
      e.preventDefault();
      const total =
        parseInt(document.getElementById('smoke').value) +
        parseInt(document.getElementById('exercise').value) +
        parseInt(document.getElementById('bpSugar').value) +
        parseInt(document.getElementById('history').value);

      let result = "";
      if (total <= 1) result = "✅ Low Risk – Keep up your healthy habits!";
      else if (total <= 3) result = "⚠️ Moderate Risk – Exercise and monitor your health.";
      else result = "🚨 High Risk – Please consult your doctor soon!";

      document.getElementById('quizResult').innerText = result;
    });
  }
});
