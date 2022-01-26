const msgChats = document.getElementsByClassName("msger-chat")
const INFO_NAME = "Shobhit", INFO_TIME = "12:24"

const DEFAULT_MSG = "hi! some messages from JS in loop"
const DEFAULT_BANNER = "Some random banner text messages for some random information!"

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

const generateMessage = (msg) => {
  const html = 
  `
  <div class="msg msg-right">
    <div class="msg-img" style="background-image:url(https://blog.1a23.com/wp-content/uploads/sites/2/2020/02/pattern-28.svg);"></div>
    <div class="msg-bubble">
      <div class="msg-info">
        <div class="msg-info-name">${INFO_NAME}</div>
        <div class="msg-info-time">${INFO_TIME}</div>
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
  msgChats[0].insertAdjacentHTML('beforeend', generateMessage(msg))
  msgChats[0].scrollTop += 500
})

document.getElementsByClassName('msger-split-btn')[0].addEventListener("click", (event) => {
  event.preventDefault();
  msgChats[0].insertAdjacentHTML('beforeend', generateBanner(DEFAULT_BANNER))
  msgChats[0].scrollTop += 500
})
