// Theme switcher logic
const switchBtns = document.querySelectorAll('[data-set-theme]');
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('tynkr-glass-theme', t); } catch (e) {}
  switchBtns.forEach(b => b.classList.toggle('on', b.dataset.setTheme === t));
}
switchBtns.forEach(b => b.addEventListener('click', () => setTheme(b.dataset.setTheme)));

try {
  const stored = localStorage.getItem('tynkr-glass-theme');
  if (stored && ['light','mist','dark'].includes(stored)) setTheme(stored);
} catch (e) {}

// Calculator Logic
const origShape = document.getElementById('orig-shape');
const targetShape = document.getElementById('target-shape');
const origDims = document.getElementById('orig-dims');
const targetDims = document.getElementById('target-dims');
const multiplierOutput = document.getElementById('multiplier-output');
const areaOutput = document.getElementById('area-output');
const timeOutput = document.getElementById('time-output');

function getInputsHtml(shape, prefix) {
  if (shape === 'round') {
    return `
      <div class="input-group">
        <span class="input-label">Diameter (in)</span>
        <input type="number" id="${prefix}-dim1" class="form-input" value="8" min="1" step="0.5">
      </div>`;
  } else if (shape === 'square') {
    return `
      <div class="input-group">
        <span class="input-label">Side (in)</span>
        <input type="number" id="${prefix}-dim1" class="form-input" value="8" min="1" step="0.5">
      </div>`;
  } else if (shape === 'rectangular') {
    return `
      <div class="input-group">
        <span class="input-label">Length (in)</span>
        <input type="number" id="${prefix}-dim1" class="form-input" value="13" min="1" step="0.5">
      </div>
      <div class="input-group">
        <span class="input-label">Width (in)</span>
        <input type="number" id="${prefix}-dim2" class="form-input" value="9" min="1" step="0.5">
      </div>`;
  }
}

function updateInputs() {
  origDims.innerHTML = getInputsHtml(origShape.value, 'orig');
  targetDims.innerHTML = getInputsHtml(targetShape.value, 'target');
  
  // Attach listeners to new inputs
  document.querySelectorAll('#orig-dims input, #target-dims input').forEach(input => {
    input.addEventListener('input', calculate);
  });
  
  calculate();
}

function getArea(shape, prefix) {
  const dim1 = parseFloat(document.getElementById(`${prefix}-dim1`).value) || 0;
  if (shape === 'round') {
    const radius = dim1 / 2;
    return Math.PI * radius * radius;
  } else if (shape === 'square') {
    return dim1 * dim1;
  } else if (shape === 'rectangular') {
    const dim2 = parseFloat(document.getElementById(`${prefix}-dim2`).value) || 0;
    return dim1 * dim2;
  }
  return 0;
}

function calculate() {
  const area1 = getArea(origShape.value, 'orig');
  const area2 = getArea(targetShape.value, 'target');

  if (area1 > 0 && area2 > 0) {
    const multiplier = area2 / area1;
    // format to 2 decimal places
    multiplierOutput.textContent = (Math.round(multiplier * 100) / 100).toFixed(2) + 'x';
    areaOutput.textContent = `Original: ${Math.round(area1 * 10) / 10} sq in | Target: ${Math.round(area2 * 10) / 10} sq in`;
    
    // Warning logic
    if (multiplier > 1.1) {
      timeOutput.textContent = 'If the target pan is shallower, bake time may be shorter. Check early!';
      timeOutput.style.color = 'var(--text-soft)';
    } else if (multiplier < 0.9) {
      timeOutput.textContent = 'If the target pan is deeper, bake time may be longer. Monitor closely.';
      timeOutput.style.color = 'var(--text-soft)';
    } else {
      timeOutput.textContent = 'Similar area. Bake time should remain roughly the same (monitor depth).';
      timeOutput.style.color = 'var(--text-soft)';
    }
  } else {
    multiplierOutput.textContent = '0.00x';
    areaOutput.textContent = 'Original: 0.0 sq in | Target: 0.0 sq in';
    timeOutput.textContent = 'Enter valid dimensions to calculate.';
  }
}

origShape.addEventListener('change', updateInputs);
targetShape.addEventListener('change', updateInputs);

// Initialize
updateInputs();
