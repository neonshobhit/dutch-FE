import { properties } from "./../properties.js";

const currentEmailSpan = document.getElementById("currentEmailSpan");
let qrCodeImage = document.getElementById("qrCodeImage");

const secretKeyForm = document.getElementById("secretKeyForm");
const secretKeyInput = document.getElementById("secret");
const secretErrorMessage = document.getElementById("secretErrorMessage");
const jwtToken = localStorage.getItem("jwtToken")
	? localStorage.getItem("jwtToken")
	: "";

let currentEmailValue = localStorage.getItem("userEmail")
	? localStorage.getItem("userEmail")
	: "";

const checkIfEmailExistInLocalStorage = () => {
	if (currentEmailValue === "") {
		alert("You are not verified. Please verify yourself.");
		window.location.href = "./signup.html";
	}
};
const checkIfJwtTokenExistInLocalStorage = () => {
	if (jwtToken !== "") {
		alert("You are not verified. Please verify yourself.");
		window.location.href = "./signup.html";
	}
};

const getQrCode = async (email) => {
	const response = await fetch(`${properties.LOCAL}/users/getCode`, {
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

const verifySecretKey = async (secretKey) => {
	const response = await fetch(`${properties.LOCAL}/users/signin`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: currentEmailValue,
			verificationOtp: secretKey,
		}),
	});
	const data = await response.json();
	return data;
};

async function initialize() {
	checkIfEmailExistInLocalStorage();
	checkIfJwtTokenExistInLocalStorage();
	currentEmailSpan.innerText = currentEmailValue;
	let result = await getQrCode(currentEmailValue);
	if (result && result.statusCode === 200) {
		let qrCode = result.image_url;
		qrCodeImage.src = `${qrCode}`;
	}
}

initialize();

secretKeyForm.addEventListener("submit", async function (e) {
	e.preventDefault();
	let secretKeyInputValue = secretKeyInput.value;
	if (secretKeyInputValue.length === 0) {
		secretErrorMessage.classList.remove("hide");
		secretErrorMessage.classList.add("show");
		secretKeyInput.classList.add("input-border-error");
	} else {
		secretErrorMessage.classList.add("hide");
		secretKeyInput.classList.remove("input-border-error");
		let result = await verifySecretKey(secretKeyInputValue);
		if (result && result.statusCode === 200) {
			alert("Secret Key is Verified.");
			localStorage.setItem("jwtToken", result.token);
			window.location.href = "./../index.html";
		} else {
			secretErrorMessage.classList.remove("hide");
			secretErrorMessage.classList.add("show");
			secretKeyInput.classList.add("input-border-error");
		}
	}
});
