import { properties } from "./../properties.js";

const editmail = document.getElementById("editmail");
const emailContainer = document.getElementById("email-container");
const otpConfirmationContainer = document.getElementById(
	"otp-confirmation-container",
);

const addUserForm = document.getElementById("addUserForm");
const otpConfirmationForm = document.getElementById("otpConfirmationForm");

const errorMessage = document.getElementById("errorMessage");
const otpErrorMessage = document.getElementById("otpErrorMessage");

const email = document.getElementById("email");
const otp = document.getElementById("otp");

let emailValue = localStorage.getItem("userEmail")
	? localStorage.getItem("userEmail")
	: "";
let isOtpVerified = localStorage.getItem("isOtpVerified")
	? localStorage.getItem("isOtpVerified")
	: false;

let otpConfirmationPage = localStorage.getItem("userEmail") ? true : false;

const validateEmail = (email) => {
	const regex = properties.EMAIL_REGEX;

	return regex.test(email.trim().toLowerCase());
};

const hideEmailContainer = function () {
	emailContainer.classList.add("hide-email-container");
	emailContainer.classList.remove("show-email-container");
};

const showOtpConfirmationContainer = function () {
	otpConfirmationContainer.classList.add("show-otp-confirmation-container");
	otpConfirmationContainer.classList.remove(
		"hide-otp-confirmation-container",
	);
};

const showOtpErrorMessage = function () {
	otpErrorMessage.classList.add("show-error-message");
	otpErrorMessage.classList.remove("hide-error-message");
};

const hideOtpContainer = function () {
	otpConfirmationContainer.classList.add("hide-otp-confirmation-container");
	otpConfirmationContainer.classList.remove(
		"show-otp-confirmation-container",
	);
};

const showEmailContainer = function () {
	emailContainer.classList.add("show-email-container");
	emailContainer.classList.remove("hide-email-container");
};

const fillEditEmailValue = function (email) {
	editmail.innerHTML = email;
};
const signup = async (email) => {
	const response = await fetch(`${properties.LOCAL}/users/add`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
		}),
	});
	const data = await response.json();
	return data;
};

const otpVerify = async (otp) => {
	const response = await fetch(`${properties.LOCAL}/users/verify`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: emailValue,
			token: otp,
		}),
	});
	const data = await response.json();
	return data;
};

addUserForm.addEventListener("submit", async function (e) {
	e.preventDefault();
	var errorText = document.getElementsByClassName("error-text")[0];
	var emailInputValue = email.value;

	if (emailInputValue.length == 0) {
		errorMessage.classList.remove("hide");
		errorMessage.classList.add("show");
		email.classList.add("input-border-error");
		errorText.innerHTML = "Please enter a valid email id.";
	} else if (!validateEmail(emailInputValue)) {
		errorMessage.classList.remove("hide");
		errorMessage.classList.add("show");
		email.classList.add("input-border-error");
		errorText.innerHTML = "Please enter a valid email id.";
	} else {
		errorMessage.classList.add("hide");
		email.classList.remove("input-border-error");
		let result = await signup(emailInputValue);
		if (result && result.statusCode === 200) {
			showOtpConfirmationContainer();
			hideEmailContainer();
			localStorage.setItem("userEmail", emailInputValue);
			fillEditEmailValue(emailInputValue);
			otpConfirmationPage = true;
			emailValue = emailInputValue;
		} else {
			errorMessage.classList.remove("hide");
			errorMessage.classList.add("show");
			email.classList.add("input-border-error");
			errorText.innerHTML = `${result.error}`;
		}
	}
});

otpConfirmationForm.addEventListener("submit", async function (e) {
	e.preventDefault();
	var otpInputValue = otp.value;

	let result = await otpVerify(otpInputValue);

	if (result && result.statusCode === 200) {
		alert("Otp is Verified.");
		localStorage.setItem("isOtpVerified", true);
		window.location.href = "./qrcodeverify.html";
	} else {
		showOtpErrorMessage();
	}
});

editmail.addEventListener("click", function () {
	hideOtpContainer();
	showEmailContainer();
	email.value = emailValue;
	otpConfirmationPage = false;
	localStorage.clear();
});

function initialize() {
	if (isOtpVerified) {
		window.location.href = "./qrcodeverify.html";
		return;
	}
	if (!otpConfirmationPage) {
		hideOtpContainer();
	} else {
		hideEmailContainer();
		fillEditEmailValue(emailValue);
	}
}
initialize();
