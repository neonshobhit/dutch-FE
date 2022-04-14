import { properties } from "./../properties.js";
const eventsContainer = document.getElementById("eventContainerId");
const to_receive_ammount = document.getElementById("toReceive");
const to_send_ammount = document.getElementById("toSend");
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
const trigger = document.getElementById("add_event_btn");
const addEventForm = document.getElementById("add_event_form");
const jwtToken = localStorage.getItem("jwtToken")
	? localStorage.getItem("jwtToken")
	: "";

let flag = false;

function addEvent(element) {
	return `<div class="event border" id=event_${element.eventId}>
                <div class="event-img-container">
                    <img src=${element.imageURL} alt="no" />
                    <p class="font-12">${element.name}</p>
                </div>
                <div class="ammount-event-container">
                    <div class="event-received-ammount font-12">
                        <i class="fa fa-arrow-up"></i>
                        100
                    </div>
                    <div class="event-send-ammount font-12">
                        <i class="fa fa-arrow-down"></i>
                        200
                    </div>
                </div>
            </div>`;
}

async function getEvents() {
	let innerHTML = "";
	let data = await fetch(`${properties.LOCAL}/users/listEvents`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwtToken}`,
		},
	});
	data = await data.json();

	if (data && data.statusCode === 200) {
		data.data.forEach((element) => {
			innerHTML += addEvent(element);
		});
	}
	eventsContainer.innerHTML = innerHTML;
}

async function getUserProfile() {
	let data = await fetch(`${properties.LOCAL}/users/profile`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwtToken}`,
		},
	});
	data = await data.json();
	if (data && data.statusCode === 200) {
		to_receive_ammount.innerText = data.user.toReceive;
		to_send_ammount.innerText = data.user.toPay;
		return data;
	}
	return null;
}

function toggleModal() {
	if (flag) {
		addEventForm.reset();
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

async function getEventInformation(event) {
	event.preventDefault();
	const eventName = document.getElementById("eventName").value;
	const eventImage = document.getElementById("eventImage").value;
	const eventIsSimplified = document.querySelector(
		'input[name="eventIsSimplified"]:checked',
	).value;
	const userProfile = await getUserProfile();
	if (userProfile == null) {
		alert("User Does not exist !");
		toggleModal();
		return;
	}
	const eventData = {
		name: eventName,
		imageURL: eventImage,
		simplify: eventIsSimplified === "yes",
		userId: userProfile.id,
		userName: userProfile.user.email.substring(
			0,
			userProfile.user.email.indexOf("@"),
		),
	};
	let data = await fetch(`${properties.LOCAL}/events/newevent`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwtToken}`,
		},
		body: JSON.stringify(eventData),
	});
	data = await data.json();
	if (data && data.statusCode === 200) {
		alert("Group Added successfully");
		window.location.reload();
	} else {
		alert("Group not added");
	}
}
// Event Bubbling and Event-capturing
eventsContainer.addEventListener("click", (e) => {
	if (e.target.classList.contains("event")) {
		window.location.href =
			"./html/event-details.html?eventId=" + e.target.id;
	}
});

// Laod content
document.addEventListener("DOMContentLoaded", function () {
	if (!jwtToken) {
		window.location.href = "./html/qrcodeverify.html";
		return;
	}
	getUserProfile();
	getEvents();
});

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);
addEventForm.addEventListener("submit", getEventInformation);
