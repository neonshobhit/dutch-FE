import { properties } from "./../properties.js";
let sum = 0,
	share = [];
let members = [], event;
const tableRef = document.getElementsByClassName("split-details-table")[0];
const jwtToken = localStorage.getItem("jwtToken")
	? localStorage.getItem("jwtToken")
	: "";

const queryParams = Object.fromEntries(new URLSearchParams(location.search));
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
let names = {}
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

const split = async () => {
  let splitIn = []
  let paidBy = []
	const checked = document.querySelectorAll(
		`.split-details-table input[name="split-details-paid-by"]:checked`,
	);
  console.log(members)
	checked.forEach((el, ind, array) => {
		if (el.checked) {
			console.log(el.value);
      console.log(members[ind]);
      splitIn.push({id: members[ind].userId})
		}
	});

  const amount = document.getElementsByClassName('split-details-amount')
  console.log(amount)
  let sum = 0
  for (let i=0; i<amount.length; ++i) {
    console.log(amount[i].value)
    let val = +amount[i].value
    if (!isNaN(val) && val !== 0) {
      sum += val
      paidBy.push({amount: val, id: members[i].userId})
    }
  }
  console.log(splitIn)
  console.log(paidBy)
  if (splitIn.length === 0 || paidBy.length === 0) {
    return alert('Make sure to check atleast one split in checkboxes and amount must not be 0')
  }
  let reqBody = {
    share: {
      splitIn,
      paidBy
    },
    event: {
      id: queryParams.eventId,
      name: event.name
    }
  }
  console.log(reqBody)

  let data = await fetch(`${properties.LOCAL}/records/transaction`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,

		},
    body: JSON.stringify(reqBody),
	});
	data = await data.json();
  console.log(data)

  const objectToName = (objects) => {
    let str = ''
    for (let i of objects) {
      console.log(i)
      str += (names[i.id] + ', ')
    }
    console.log(str)
    return str
  }
  const msg = `Made a trasaction of INR ${sum}, which is paid by ${objectToName(paidBy)}and will be split in ${objectToName(splitIn)}Thanks.`
  sendMessage(msg)

  alert('successfuly made a split!')

  window.location.href = `./chat.html?eventId=event_${queryParams.eventId.replace('event_', '')}`
};

const fetchEvent = async (eventId) => {
	let data = await fetch(`${properties.LOCAL}/events/display/${queryParams.eventId.replace('event_', '')}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,

		},
	});
	data = await data.json();
  console.log(data)
  event = data.data
  // let members = data.data.members
  members = data?.data?.members
  for (let i in members) {
    names[members[i].userId] = members[i].name
  }
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

var sendMessage = async (msg) => {
  console.log(msg)
  let data = await fetch(`${properties.LOCAL}/records/add-message`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwtToken}`,
		},
    body: JSON.stringify({
      eventId: queryParams.eventId.replace('event_', ''),
      newMessage: msg || ""
    })
	});

  return data.json();
}
