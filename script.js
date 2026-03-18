const brigadeCycles = {
  A:["day","night","rest","off"],
  B:["night","rest","off","day"],
  C:["rest","off","day","night"],
  D:["off","day","night","rest"]
};

let selectedBrigade = localStorage.getItem("brigade") || "A";
let currentYear = new Date().getFullYear();

const calendarEl = document.querySelector(".calendar");
const todayBtn = document.getElementById("today-btn");
const dateInput = document.getElementById("date-input");
const checkBtn = document.getElementById("check-date");

const monthNames = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const weekDays = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

const baseDate = new Date(2026, 2, 15);
baseDate.setHours(0,0,0,0);

const brigadeOffsets = {
  A:0,
  B:2,
  C:3,
  D:1
};

document.querySelectorAll(".brigade-btn").forEach(btn=>{
  btn.onclick = ()=>{
    document.querySelectorAll(".brigade-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");

    selectedBrigade = btn.dataset.brigade;
    localStorage.setItem("brigade", selectedBrigade);

    generateCalendar();
    showShiftAlert();
  };
});

const activeBtn = document.querySelector(`[data-brigade="${selectedBrigade}"]`);
if(activeBtn) activeBtn.classList.add("active");

function getShift(date){
  const cycle = brigadeCycles[selectedBrigade];
  const d = new Date(date);
  d.setHours(0,0,0,0);

  const diff = Math.floor((d - baseDate) / 86400000);

  let index = (diff + brigadeOffsets[selectedBrigade]) % 4;
  if(index < 0) index += 4;

  return cycle[index];
}

function generateCalendar(){

  if(!calendarEl) return;
  calendarEl.innerHTML = "";

  const today = new Date();
  today.setHours(0,0,0,0);

  for(let month=0; month<12; month++){

    const monthDiv = document.createElement("div");
    monthDiv.className = "month";

    const daysContainer = document.createElement("div");
    daysContainer.className = "days-container";

    const daysInMonth = new Date(currentYear, month+1, 0).getDate();

    for(let day=1; day<=daysInMonth; day++){

      const date = new Date(currentYear, month, day);
      const shift = getShift(date);

      const cell = document.createElement("div");
      cell.className = "day-cell " + shift;
      cell.textContent = day;

      if(date.toDateString() === today.toDateString()){
        cell.classList.add("today");
      }

      daysContainer.appendChild(cell);
    }

    monthDiv.appendChild(daysContainer);
    calendarEl.appendChild(monthDiv);
  }
}

function showShiftAlert(){

  const alert = document.getElementById("shift-alert");
  if(!alert) return;

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate()+1);

  const todayShift = getShift(today);
  const tomorrowShift = getShift(tomorrow);

  alert.innerHTML = todayShift + "<br>" + tomorrowShift;
}

generateCalendar();
showShiftAlert();
