const dayEl = document.querySelector("#day");
const partEl = document.querySelector("#part");
const inputEl = document.querySelector("#input");
const resultEl = document.querySelector("#result");
const runBtn = document.querySelector("#run");

runBtn.addEventListener("click", async () => {
  const day = Number(dayEl.value);
  const part = Number(partEl.value);
  const input = inputEl.value;

  if (!day || !input) {
    resultEl.textContent = "Вкажіть номер дня та додайте вхідні дані.";
    return;
  }

  try {
    const dayStr = day.toString().padStart(2, "0");
    const module = await import(`./days/day${dayStr}/part${part}.js`);
    const fn = module.default;
    const output = await fn(input);

    resultEl.textContent = output;
    
  } catch (err) {
    resultEl.textContent = "Помилка: " + err.message;
  }
});
