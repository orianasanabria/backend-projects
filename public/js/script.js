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
