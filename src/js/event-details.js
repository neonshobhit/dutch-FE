import { properties } from "./../properties.js";
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
const jwtToken = localStorage.getItem("jwtToken")
	? localStorage.getItem("jwtToken")
	: "";

const eventName = document.querySelector(`.event-name input[type="text"]`);
const addMemberForm = document.getElementById("add-member-form");
const errorMessage = document.getElementById("errorMessage");
let flag = false;
let members;
let event = undefined;
let names = {}
let indexedBalance = {}
function toggleModal() {
	if (flag) {
		addMemberForm.reset();
		flag = false;
	} else {
		flag = true;
	}
	modal.classList.toggle("show-modal");
}
function windowOnClick(event) {
	if (event.target === modal) {
		toggleModal();
	}
}
function validateEmail(email) {
	const regex = properties.EMAIL_REGEX;

	return regex.test(email.trim().toLowerCase());
}

const addUser = () => {
	toggleModal();
};

const copyInviteLink = () => {
	console.log("copy invited");

	alert("https://someurl.com");
};

const editName = () => {
	eventName.removeAttribute("readonly", false);
};

const addExpenses = () => {
	window.location.href = "./split.html?eventId=" + getEventIdFromParams();
};

const removeMember = () => {
	console.log("remove member");
};

const generateMember = (member) => {
	const html = `
  <div class="event-member-options">
    <span class="event-member">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuHmklWCsY6sTDgS1Gxv-pZ4aEaCOgtvgOzg&usqp=CAU" alt=""  class="event-member-img"></img>
      <span class="event-member-name">${member.name}</span>
    </span>
  </div>
  `;
  // <i class="fa fa-trash" onclick="removeMember()" title="remove member"></i>

	return html;
};

const generateOwedBy = (name, amount) => {
	const html = `
  <div class="event-member-options">
    <span class="event-member">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuHmklWCsY6sTDgS1Gxv-pZ4aEaCOgtvgOzg&usqp=CAU" alt=""  class="event-member-img"></img>
      <span class="event-member-name">${name} owes ${amount}</span>
    </span>
  </div>
  `;

	return html;
};

const displayMembers = (members) => {
	document.getElementsByClassName("event-members-list")[0].innerHTML = "";
	for (let i = 0; i < members.length; ++i) {
		document
			.getElementsByClassName("event-members-list")[0]
			.insertAdjacentHTML("beforeend", generateMember(members[i]));
	}
};
const displayBalances = (name, amount, index) => {
  let html = `
  <div class="expanded-tile">
    <div class="balance-expansion-tile" onclick="expandTileToggle(${index})">
      <span class="expansion-tile-text">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuHmklWCsY6sTDgS1Gxv-pZ4aEaCOgtvgOzg&usqp=CAU" alt=""  class="expansion-tile-img"></img>
        ${name} gets back ${amount}
      </span>
      <i class="fas fa-arrow-down"></i>
    </div>
  </div>
  `
  return html;
}
const updateName = (eventName) => {
  console.log(document.getElementsByClassName("msger-header-title")[0].children)
  document.getElementsByClassName("msger-header-title")[0].children[0].innerHTML = " " + eventName
}
const updateBalance = (graph, members) => {
  for (let i in members) {
    names[members[i].userId] = members[i].name
  }
  let index = 0;
  let html = ''
  for (let i in graph) {
    let sum = 0;
    // let innerhtml = ''
    for (let j in graph[i]) {
      sum += graph[i][j];
      // innerhtml += generateOwedBy(names[graph[j]]);
    }
    html += displayBalances(names[i], sum, ++index)
    indexedBalance[index] = i
  }
  document.getElementsByClassName("balances")[0].insertAdjacentHTML('beforeend', html)
  console.log(html, event)
}
const getEventIdFromParams = () => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	return urlParams.get("eventId").substring(6);
};

const getEvent = async (eventId) => {
	let data = await fetch(
		`${properties.LOCAL}/events/display/${getEventIdFromParams()}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwtToken}`,
			},
		},
	);
	data = await data.json();
	if (data && data.statusCode === 200 && data.data) {
		eventName.value = data.data.name;
    event = data.data
		displayMembers(data.data.members);
    updateName(data.data.name);
    updateBalance(data.data.graph, data.data.members);
		members = data.data.members;
	}
};
const addNewMemberInList = async (addMemberData) => {
	let data = await fetch(`${properties.LOCAL}/events/addmembers`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwtToken}`,
		},
		body: JSON.stringify(addMemberData),
	});
	data = await data.json();
	if (data && data.statusCode === 200) {
		alert("Member added successfully");
		toggleModal();
		displayMembers(data.members);
	} else {
		alert(data.message);
	}
};

window.addUser = addUser;
window.copyInviteLink = copyInviteLink;
window.editName = editName;
window.removeMember = removeMember;
window.initialize = initialize;
window.addExpenses = addExpenses;
window.addEventListener("click", windowOnClick);
closeButton.addEventListener("click", toggleModal);

addMemberForm.addEventListener("submit", (e) => {
	e.preventDefault();
	let emailInput = document.getElementById("email");
	let email = emailInput.value;
	if (email.length === 0 || !validateEmail(email)) {
		errorMessage.classList.remove("hide");
		errorMessage.classList.add("show");
		emailInput.classList.add("input-border-error");
		errorMessage.innerText = "Please enter valid email";
	} else {
		errorMessage.classList.remove("show");
		errorMessage.classList.add("hide");
		emailInput.classList.remove("input-border-error");
		let name = email.split("@")[0];
		let data = {
			eventId: getEventIdFromParams(),
			memberEmail: email,
			memberName: name.charAt(0).toUpperCase() + name.substring(1),
			isGuest: false,
		};
		addNewMemberInList(data);
	}
});

function initialize() {
	if (!jwtToken) {
		window.location.href = "./qrcodeverify.html";
		return;
	}
	let eventId = getEventIdFromParams();
	getEvent(eventId);
	getDues(eventId);
}

const getDues = async (eventId) => {
	console.log(eventId);
	let data = await fetch(`${properties.LOCAL}/events/getDues/${eventId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		// body: JSON.stringify(addMemberData),
	});
	data = await data.json();
	console.log(data.graph);
};
initialize();
const expandTileToggle = (ind) => {
	let elRef =
		document.getElementsByClassName("balances")[0].children[ind].children[0]
			.children[1];
	const isExpanded = elRef.className === "fas fa-arrow-up";
	const expandTile =
		document.getElementsByClassName("balances")[0].children[ind];
	if (isExpanded) {
    for (let i in event.graph[indexedBalance[ind]]) {
      expandTile.removeChild(expandTile.lastElementChild);
    }
		elRef.className = "fas fa-arrow-down";
	} else {
		elRef.className = "fas fa-arrow-up";
    for (let i in event.graph[indexedBalance[ind]]) {
      expandTile.insertAdjacentHTML(
        "beforeend",
        generateOwedBy(names[i], event.graph[indexedBalance[ind]][i]),
      );
    }
	}
};

window.expandTileToggle = expandTileToggle;
// document.getElementsByClassName('balance-expansion-tile')
