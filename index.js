console.log(document);

function getElement(id){
    const element = document.getElementById(id);
    return element;
}

//delegation
getElement("product-box").addEventListener("click", function (e) {
  if (e.target.className.includes("cart-btn")) {
    // alert("card clicked");
    const cartButton = e.target;

    const productImg = cartButton.parentNode.parentNode.children[0].children[0].src;
    const productTitle = cartButton.parentNode.parentNode.children[1].children[0].innerText;
    const productPrice = cartButton.parentNode.parentNode.children[1].children[2].children[0].innerText;

    // console.log(productPrice);

const totalPrice = getElement("total-price").innerText;
// console.log(totalPrice);    
const currentTotal = Number(productPrice) + Number(totalPrice);

getElement("total-price").innerText = currentTotal;
// console.log(currentTotal);

const cartContainer = getElement("cart-container");

const newCart = document.createElement("div");
newCart.innerHTML = `<div class="bg-gray-200 rounded-xl flex justify-between p-4 my-4">
<img src="${productImg}" alt="" class="w-10" />
                  <div class="">
                    <h2 class="font-bold">${productTitle}</h2>
                    <h2 class="">${productPrice} Tk</h2>
                  </div>
            </div>`;

cartContainer.append(newCart);

const quantity = getElement("total-quantity").innerText;
const currentQuantity = Number(quantity) + 1; 
getElement("total-quantity").innerText = currentQuantity;
  }
});


// // traverse technique
// const cartbtns = document.getElementsByClassName("cart-btn");
// console.log(cartbtns);

// for (let cartButton of cartbtns) {
//   // console.log(cartButton);
//   cartButton.addEventListener("click", function (){
//     // console.log("btn clicked");
//     const productImg = cartButton.parentNode.parentNode.children[0].children[0].src;
//     const productTitle = cartButton.parentNode.parentNode.children[1].children[0].innerText;
//     const productPrice = cartButton.parentNode.parentNode.children[1].children[2].children[0].innerText;

//     // console.log(productPrice);

// const totalPrice = getElement("total-price").innerText;
// // console.log(totalPrice);    
// const currentTotal = Number(productPrice) + Number(totalPrice);

// getElement("total-price").innerText = currentTotal;
// // console.log(currentTotal);

// const cartContainer = getElement("cart-container");

// const newCart = document.createElement("div");
// newCart.innerHTML = `<div class="bg-gray-200 rounded-xl flex justify-between p-4 my-4">
// <img src="${productImg}" alt="" class="w-10" />
//                   <div class="">
//                     <h2 class="font-bold">${productTitle}</h2>
//                     <h2 class="">${productPrice} Tk</h2>
//                   </div>
//             </div>`

// cartContainer.append(newCart);

// const quantity = getElement("total-quantity").innerText;
// const currentQuantity = Number(quantity) + 1; 
// getElement("total-quantity").innerText = currentQuantity;

  

  document.getElementById("btn-clear").addEventListener("click", function(){
    const cartContainer = getElement("cart-container");
    getElement("cart-container").innerHTML = "";
    getElement("total-quantity").innerText = 0;
    getElement("total-price").innerText = 0;
  })

// document.getElementById("card-btn-1").addEventListener("click",function () {
  
//     const title = getElement("card-title-1").innerText;
//     const price = getElement("card-price-1").innerText;
//     console.log(title, price);

//     const totalPrice = getElement("total-price").innerText;

//     currentTotal = Number(price) + Number(totalPrice);

//    getElement("total-price").innerText = currentTotal.toFixed(2);

// const cartContainer = getElement("cart-container");

// const newCart = document.createElement("div");
// newCart.innerHTML=
//  `<div class="bg-gray-200 rounded-xl flex justify-between p-4">
// <img src="./deshi-deals/assets/furniture-1.png" alt="" class="w-10" />
//                   <div class="">
//                     <h2 class="font-bold">${title}</h2>
//                     <h2 class="">${price} Tk</h2>
//                   </div>
//             </div>
//     `;

//  cartContainer.append(newCart);

// });
