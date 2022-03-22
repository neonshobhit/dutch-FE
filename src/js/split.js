import { properties } from "./../properties.js";
let sum = 0,
	share = [];
const tableRef = document.getElementsByClassName("split-details-table")[0];
const jwtToken = localStorage.getItem("jwtToken")
	? localStorage.getItem("jwtToken")
	: "";

const generateSplitDetailsTable = (member, index) => {
	const html = `
  <tr>
    <td><div class="split-details-list-people">${member.name}</div></td>
    <td><input type="checkbox" name="split-details-paid-by" class="split-details-paid-by-checkbox" value="${index}" checked=true></td>
    <td><input type="text" name="split-details-amount" class="split-details-amount" placeholder="0" oninput="updateValue(${index})"></td>
  </tr>
  `;
	return html;
};
const showMembers = (members) => {
	for (let i = 0; i < members.length; ++i) {
		let newRow = tableRef.insertRow(tableRef.rows.length);
		newRow.innerHTML = generateSplitDetailsTable(members[i], i + 1);
		share.push(0);
	}
};

const updateValue = (index) => {
	let element = document.getElementsByClassName("split-details-table")[0]
		.rows[index].cells[2].firstChild;
	const el = +element.value;
	if (isNaN(el)) {
		alert("not a number");
		element.value = "" + (share[index] === 0 ? "" : share[index]);
		return;
	}
	sum -= share[index - 1];
	sum += el;
	share[index - 1] = el;
	const submitAmount = document.getElementById("split-submit-amount");
	submitAmount.innerText = sum;
};

const split = () => {
	const checked = document.querySelectorAll(
		`.split-details-table input[name="split-details-paid-by"]:checked`,
	);
	checked.forEach((el, ind, array) => {
		if (el.checked) {
			console.log(el.value);
		}
	});
};

const fetchEvent = async (eventId) => {
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
		showMembers(data.data.members);
	}
};

const getEventIdFromParams = () => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	return urlParams.get("eventId");
};

function initialize() {
	if (!jwtToken) {
		window.location.href = "./qrcodeverify.html";
		return;
	}
	const eventId = getEventIdFromParams();
	if (!eventId) {
		alert("Invalid eventId");
		return;
	}
	fetchEvent(eventId);
}
window.generateSplitDetailsTable = generateSplitDetailsTable;
window.showMembers = showMembers;
window.updateValue = updateValue;
window.split = split;
initialize();
