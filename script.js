const lights = [...document.querySelectorAll('.light')];
const message = document.querySelector('#message');
const startButton = document.querySelector('#start-button');
const reactButton = document.querySelector('#react-button');
const againButton = document.querySelector('#again-button');
const results = document.querySelector('#results');
const timeOutput = document.querySelector('#time');
const rankOutput = document.querySelector('#rank');
const oddsOutput = document.querySelector('#odds');
const attemptLabel = document.querySelector('#attempt-label');

let phase = 'ready';
let timeouts = [];
let goAt = 0;
let attempt = 1;

function clearTimers() {
  timeouts.forEach(clearTimeout);
  timeouts = [];
}

function schedule(callback, delay) {
  timeouts.push(setTimeout(callback, delay));
}

function rankFor(milliseconds) {
  if (milliseconds < 150) return 'Caffeinated Cheetah';
  if (milliseconds < 200) return 'Turbo Tortoise';
  if (milliseconds < 250) return 'Pit-Lane Pro';
  if (milliseconds < 350) return 'Gear-Shift Goblin';
  return 'Sleepy Pit Crew';
}

function finishRace(milliseconds) {
  phase = 'finished';
  document.body.dataset.phase = phase;
  reactButton.disabled = true;
  startButton.disabled = true;
  results.hidden = false;
  timeOutput.textContent = milliseconds + ' ms';
  rankOutput.textContent = rankFor(milliseconds);
  const chance = Math.max(5, Math.min(95, Math.round(50 + (250 - milliseconds) / 5)));
  oddsOutput.textContent = chance + '%';
  message.textContent = 'Race complete. Check your time, then take another lap.';
  againButton.focus();
}

function falseStart() {
  clearTimers();
  phase = 'false-start';
  document.body.dataset.phase = phase;
  lights.forEach((light) => light.classList.remove('lit'));
  reactButton.disabled = true;
  startButton.disabled = true;
  results.hidden = false;
  timeOutput.textContent = 'FALSE START';
  rankOutput.textContent = 'Jump-Start Jellybean';
  oddsOutput.textContent = '0%';
  message.textContent = 'Too soon! Wait for the lights to go out.';
  againButton.focus();
}

function react() {
  if (phase === 'countdown') {
    falseStart();
    return;
  }
  if (phase !== 'go') return;
  finishRace(Math.round(performance.now() - goAt));
}

function startRace() {
  clearTimers();
  phase = 'countdown';
  document.body.dataset.phase = phase;
  results.hidden = true;
  startButton.disabled = true;
  reactButton.disabled = false;
  reactButton.focus();
  lights.forEach((light) => light.classList.remove('lit'));
  message.textContent = 'Get ready…';
  attemptLabel.textContent = 'ATTEMPT ' + String(attempt).padStart(2, '0');

  lights.forEach((light, index) => {
    schedule(() => {
      light.classList.add('lit');
      message.textContent = 'Light ' + (index + 1) + ' of 5…';
    }, 600 * (index + 1));
  });

  const pauseAfterLights = 900 + Math.random() * 1800;
  schedule(() => {
    lights.forEach((light) => light.classList.remove('lit'));
    phase = 'go';
    document.body.dataset.phase = phase;
    message.textContent = 'GO! CLICK NOW!';
    goAt = performance.now();
  }, 600 * lights.length + pauseAfterLights);
}

function raceAgain() {
  attempt += 1;
  startRace();
}

startButton.addEventListener('click', startRace);
reactButton.addEventListener('click', react);
againButton.addEventListener('click', raceAgain);
