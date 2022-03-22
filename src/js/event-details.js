import { properties } from "./../properties.js";
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
const jwtToken = localStorage.getItem("jwtToken")
	? localStorage.getItem("jwtToken")
	: "";

const eventName = document.querySelector(`.event-name input[type="text"]`);

function toggleModal() {
	modal.classList.toggle("show-modal");
}
function windowOnClick(event) {
	if (event.target === modal) {
		toggleModal();
	}
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
    <i class="fa fa-trash" onclick="removeMember()" title="remove member"></i>
  </div>
  `;

	return html;
};

const displayMembers = (members) => {
	for (let i = 0; i < members.length; ++i) {
		document
			.getElementsByClassName("event-members-list")[0]
			.insertAdjacentHTML("beforeend", generateMember(members[i]));
	}
};
const getEvent = async (eventId) => {
	let data = await fetch(`${properties.LOCAL}/events/display`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			eventId,
		}),
	});
	data = await data.json();
	if (data && data.statusCode === 200 && data.data) {
		eventName.value = data.data.name;
		displayMembers(data.data.members);
	}
};

const getEventIdFromParams = () => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	return urlParams.get("eventId").substring(6);
};
window.addUser = addUser;
window.copyInviteLink = copyInviteLink;
window.editName = editName;
window.removeMember = removeMember;
window.initialize = initialize;
window.addExpenses = addExpenses;
window.addEventListener("click", windowOnClick);
closeButton.addEventListener("click", toggleModal);

function initialize() {
	if (!jwtToken) {
		window.location.href = "./qrcodeverify.html";
		return;
	}
	let eventId = getEventIdFromParams();
	getEvent(eventId);
}

initialize();
