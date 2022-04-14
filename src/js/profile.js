import { properties } from "./../properties.js";
const profileImage = document.getElementById("profile-image");
const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");
const amountTopay = document.getElementById("amount-topay");
const amountToReceive = document.getElementById("amount-toreceive");
const profileFriendsCount = document.getElementById("profile-friends-count");
const addFriendIcon = document.querySelector(".add-friend-icon");
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
const addFriendForm = document.getElementById("add-friend-form");
const errorMessage = document.getElementById("errorMessage");

const jwtToken = localStorage.getItem("jwtToken")
	? localStorage.getItem("jwtToken")
	: "";
let flag = false;

function toggleModal() {
	if (flag) {
		addFriendForm.reset();
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
		amountTopay.innerText = data.user.toPay;
		amountToReceive.innerText = data.user.toReceive;
		profileName.innerText = data.user.email.split("@")[0];
		profileEmail.innerText = data.user.email;
		profileImage.src = data.user.imageURL
			? data.user.imageURL
			: "./../media/profile.png";
	} else {
		alert("user not found. please login again.");
		localStorage.removeItem("jwtToken");
		window.location.href = "./qrcodeverify.html";
	}
}

async function getFriends() {
	let data = await fetch(`${properties.LOCAL}/users/fetchfriend`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwtToken}`,
		},
	});
	data = await data.json();
	if (data && data.statusCode === 200) {
		profileFriendsCount.innerText = data.data.length;
	} else {
		console.log("Error in getting friends.");
	}
}

async function addNewFriendInList(otherEmail) {
	let data = await fetch(`${properties.LOCAL}/users/addfriend`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwtToken}`,
		},
		body: JSON.stringify({
			otherEmail,
		}),
	});
	data = await data.json();
	if (data && data.statusCode === 200) {
		alert("friend added successfully");
		getFriends();
		toggleModal();
	} else if (data.statusCode === 401 || data.statusCode === 208) {
		errorMessage.classList.remove("hide");
		errorMessage.classList.add("show");
		errorMessage.innerText = data.message;
	}
}
// Laod content
document.addEventListener("DOMContentLoaded", function () {
	if (!jwtToken) {
		window.location.href = "./qrcodeverify.html";
		return;
	}
	getUserProfile();
	getFriends();
});

addFriendIcon.addEventListener("click", function () {
	toggleModal();
});
addFriendForm.addEventListener("submit", function (e) {
	e.preventDefault();
	let email = document.getElementById("email");
	let friendEmail = email.value;
	if (friendEmail.length === 0 || !validateEmail(friendEmail)) {
		errorMessage.classList.remove("hide");
		errorMessage.classList.add("show");
		email.classList.add("input-border-error");
		errorMessage.innerText = "Please enter valid email";
	} else {
		errorMessage.classList.remove("show");
		errorMessage.classList.add("hide");
		email.classList.remove("input-border-error");
		addNewFriendInList(friendEmail);
	}
});

window.addEventListener("click", windowOnClick);
closeButton.addEventListener("click", toggleModal);
