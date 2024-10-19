
var dropdownData = []
var latitude;
var longitude;
var name
function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  if (dropdown.style.display === "block") {
    dropdown.style.display = "none";
  } else {
    filterFunction(); // Ensure dropdown is updated before showing
    dropdown.style.display = "block";
  }
}

function filterFunction() {
  const input = document.getElementById('location').value.toLowerCase();
  const dropdown = document.getElementById('dropdown');
  dropdown.innerHTML = '';
  dropdownData.forEach(item => {
    if (item.toLowerCase().includes(input)) {
      const p = document.createElement('p');
      p.innerText = item;
      p.onclick = function() { selectItem(this); };
      dropdown.appendChild(p);
    }
  });

  dropdown.style.display = dropdown.innerHTML ? "block" : "none";
}

function selectItem(element) {
  const locationInput = document.getElementById("location");
  locationInput.value = element.innerText;
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display = "none";
}

async function getrecords(catagory) {

      const input = catagory;
      const response = await fetch('http://127.0.0.1:5000/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({input: '',category: catagory })
    });

     const data = await response.json();
     dropdownData = data.Name;
  }
async function sendInput() {
    const input = document.getElementById("inputField").value;
    const category = document.getElementById("category").value;
    const response = await fetch('http://127.0.0.1:5000/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({input: input, category: category})
    });

    const data = await response.json();
    let displayText = `${data.Name} + ${data.output}`;
    if (data.suggestions && data.suggestions.length > 0) {
        displayText += "<br>Did you mean: <ul>";
        data.suggestions.forEach(suggestion => {
            displayText += `<li>${suggestion}</li>`;
        });
        displayText += "</ul>";
    }
    latitude = data.lat;
    longitude = data.long;
    name = data.Name;
    document.getElementById("name").innerHTML = name;
    document.getElementById("address").innerHTML = displayText;
}
