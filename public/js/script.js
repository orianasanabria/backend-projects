const socket = io();
let prodList;

socket.on("data", ({ products, template }) => {
  prodList = Handlebars.compile(template);
  const prodTemplate = prodList({ products });
  document.getElementById("prodList").innerHTML = prodTemplate;
});

socket.on("newProd", (products) => {
  const prodTemplate = prodList({ products });
  document.getElementById("prodList").innerHTML = prodTemplate;
});

document.getElementById("prodForm").onsubmit = (e) => {
  e.preventDefault();
  const title = e.target[0].value;
  const price = e.target[1].value;
  const thumbnail = e.target[2].value;

  e.target[0].value = "";
  e.target[1].value = "";
  e.target[2].value = "";

  socket.emit("addProd", { title, price, thumbnail });
};

const chatInput = document.getElementById("chatInput");
document.getElementById("chatButton").addEventListener("click", () => {
  socket.emit("netText", chatInput.value);
  input.value = "";
});

socket.on("textArray", (allTexts) => {
  const textArrayHTML = allTexts
    .map((txt) => `

      <tr>
        <td style="max-width: 100px"> <img width="35px" style="margin-right: 20px" src="https://cdn1.iconfinder.com/data/icons/app-user-interface-flat/64/user_man_user_interface_app_person-256.png" /> ${txt.socketid} </td>
        <td><img width="35px" style="margin-right: 20px" src="https://cdn2.iconfinder.com/data/icons/flat-icons-web/40/Chat_Alert-256.png" />${txt.textData}</td>
      </tr>

    `)
    .join("");
  document.getElementById("chatTextBox").innerHTML = textArrayHTML;
});
