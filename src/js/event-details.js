const eventName = document.querySelector(`.event-name input[type="text"]`)
console.log(eventName.value)

const addUser = () => {
  console.log("added")
}
const copyInviteLink = () => {
  console.log("copy invited")

  alert("https://someurl.com")
}

const editName = () => {
  eventName.removeAttribute('readonly', false)
  eventName.value = ""
}

const removeMember = () => {
  console.log("remove member")
}

const generateMember = () => {
  const html =
  `
  <div class="event-member-options">
    <span class="event-member">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuHmklWCsY6sTDgS1Gxv-pZ4aEaCOgtvgOzg&usqp=CAU" alt=""  class="event-member-img"></img>
      <span class="event-member-name"> Shobhit</span>
    </span>
    <i class="fa fa-trash" onclick="removeMember()"></i>
  </div>
  `

  return html;
}

for (let i=0; i<3; ++i) {
  document.getElementsByClassName('event-members-list')[0].insertAdjacentHTML("beforeend", generateMember())
}
