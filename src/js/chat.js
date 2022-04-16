import { properties } from "./../properties.js";
const msgChats = document.getElementsByClassName("msger-chat")
const INFO_NAME = "Shobhit", INFO_TIME = "12:24"

const DEFAULT_MSG = "hi! some messages from JS in loop"
const DEFAULT_BANNER = "Some random banner text messages for some random information!"
const queryParams = Object.fromEntries(new URLSearchParams(location.search));

const jwtToken = localStorage.getItem("jwtToken") || ""
console.log(localStorage)
const email = localStorage.getItem('userEmail') || ""

const getRecords = async () => {
  let data = await fetch(`${properties.LOCAL}/records/get-records`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${jwtToken}`,
		},
    body: JSON.stringify({
      eventId: queryParams.eventId.replace('event_', ''),
      limit: 1000,
      offset: 0,
    })
	});
	data = await data.json();

  for (let i in data?.fetchedData) {
    let msg = data.fetchedData?.[i]
    console.log(msg)
    if (!msg) continue;

    if (msg.type === 'TAG') {
      msgChats[0].insertAdjacentHTML('beforeend', generateBanner(msg.message))
    } else if (msg.type === 'MESSAGE') {
      msgChats[0].insertAdjacentHTML('beforeend', generateMessage(msg.message.message, email === msg.message.sender.email ? 'right': 'left', msg.message.sender.name, msg.timestamp))
    }
  }
}
getRecords()

const generateBanner = (msg) => {
  const html =
  `
  <div class="msg msg-banner">
    <div class="msg-banner-text">
      ${msg}
    </div>
  </div>
  `
  return html;
}

const generateMessage = (msg, senderLoc = 'right', name = 'User', time = '1650132551542') => {
  const html = 
  `
  <div class="msg msg-${senderLoc}">
    <div class="msg-img" style="background-image:url(https://blog.1a23.com/wp-content/uploads/sites/2/2020/02/pattern-28.svg);"></div>
    <div class="msg-bubble">
      <div class="msg-info">
        <div class="msg-info-name">${name}</div>
        <div class="msg-info-time">${time}</div>
      </div>
      <div class="msg-text">${msg}</div>
    </div>
  </div>`
  return html;
}
// msgChats[0].insertAdjacentHTML('beforeend', generateMessage(DEFAULT_MSG))

document.getElementsByClassName("msger-inputarea")[0].addEventListener("submit", (event) => {
  event.preventDefault();
  const msg = document.getElementsByClassName("msger-input")[0].value
  document.getElementsByClassName("msger-input")[0].value = ""
  sendMessage(msg)
  msgChats[0].insertAdjacentHTML('beforeend', generateMessage(msg))
  msgChats[0].scrollTop += 500
})

document.getElementsByClassName('msger-split-btn')[0].addEventListener("click", (event) => {
  event.preventDefault();
  // msgChats[0].insertAdjacentHTML('beforeend', generateBanner(DEFAULT_BANNER))
  // msgChats[0].scrollTop += 500
  window.location.href = `./split.html?eventId=${queryParams.eventId.replace('event_', '')}`;
})

const sendMessage = async (msg) => {
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
