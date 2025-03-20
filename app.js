 
 //variables
   const cartBtn = document.querySelector('.cart-btn');
   const closeCartBtn = document.querySelector('.close-cart'); 
   const clearCartBtn = document.querySelector('.clear-cart'); 
   const cartDOM = document.querySelector('.cart'); 
   const cartOverlay = document.querySelector('.cart-overlay'); 
   const cartItems= document.querySelector('.cart-items'); 
   const cartTotal= document.querySelector('.cart-total'); 
   const cartContent= document.querySelector('.cart-content'); 
   const productsDOM= document.querySelector('.products-center');
   const btns = document.querySelectorAll(".bag-btn");
   console.log(btns);

 //cart
 let cart=[];
 //buttons
 let buttonsDOM = [ ];

 //getting the products
 class Products{
    async getProducts() 
    { // 🔹 Déclare une fonction asynchrone
       try{ 
        let result = await fetch('products.json'); // 🔹 Attend que les données soient récupérées
        let data = await result.json(); // 🔹 Convertit la réponse en JSON
        let products = data.items;
        products = products.map(item => { 
            const {title,price}=item.fields;
            const {id}=item.sys
            const image=item.fields.image.fields.file.url;
            return{title,price,id,image}
             
        }) 
        return products; // 🔹 Retourne les produit 
        
         } 
       catch (error) {
        console.log("Erreur lors du chargement des produits :", error);
       }
    }
 }

 //display products
 class UI { 
   displayProducts(products){
      console.log(products)
       let result = '' // Initialise une variable pour stocker le HTML
       products.forEach(product => {
         result += //Ajoute chaque titre de produit à result 
          `  
      <!--single product-->
         <article class="product">
            <div class="img-container">
            <img 
            src=${product.image}  alt="product" class="product-img"/>
            <button class="bag-btn" data-id=${product.id}>
               <i class="fas fa-shopping-cart"> ADD TO Cart </i>
            </button>
            </div> 
            <h3>${product.title} </h3>
            <h4>$${product.price}</h4>
         </article>
      <!--end of single product--> `;
          
       });
       productsDOM.innerHTML=result;
   }

   getBagButtons()
   {
      const buttons = [...document.querySelectorAll(".bag-btn")];
      buttonsDOM = buttons;
      buttons.forEach(button=>{
      let id = button.dataset.id;
      let inCart = cart.find(item=> item.id === id );
      if(inCart){ 
         button.innerText ="In Cart";
         button.disabled= true; 
   } 
button.addEventListener("click", event => {
   event.target.innerText = "In Cart";
   event.target.disabled = true ;
   // get product from products
   let cartItem ={...Storage.getProduct(id),amount:1};
   console.log(cartItem);
   
   // add product to the cart
   cart=[...cart,cartItem];
   console.log(cart);    
   // save cart in local storage 
   Storage.saveCart(cart);
   // set cart values
     this.setCartValue(cart);
   // display cart item 
   this.addCartItem(cartItem);
   // show the cart 
   this.showCart()
});
   
 });
    }
      setCartValue(cart){
      let tempTotal = 0;
      let itemsTotal = 0;
      cart.map(item => { 
         tempTotal += item.price * item.amount;
         itemsTotal += item.amount
      })
      cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
      cartItems.innerText = itemsTotal; //Met à jour la quantité au-dessus de l'icône du panier.
      
     }
     addCartItem(item){
      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.innerHTML = `
         <img src="${item.image}" alt="product">
         <div>
               <h4>${item.title}</h4>
               <h5>$${item.price}</h5>
               <span class="remove-item" data-id=${item.id}>remove</span>
         </div>
         <div>
               <i class="fas fa-chevron-up" data-id=${item.id}></i>
               <p class="item-amount">${item.amount}</p>
               <i class="fas fa-chevron-down"data-id=${item.id}></i>
         </div>`
      cartContent.appendChild(div);//Ajoute un élément HTML (div) à l'intérieur d'un conteneur (cartContent)
       }
       showCart(){
         console.log("showCart() appelée !");
         cartOverlay.classList.add("transparentBcg");
         console.log(cartDOM);  // Ajoute cette ligne pour vérifier si cartDOM est sélectionné
         cartDOM.classList.add("showCart");
      }

       setupAPP(){ // affiche le panier.
         cart = Storage.getCart();   
         console.log(cart);           // Affiche le panier sauvegardé dans la console
         this.setCartValue(cart);   //met à jour le nombre d'articles au-dessus du panier.
         this.populateCart(cart);  // remet les produits du panier dans l'affichage.
         cartBtn.addEventListener("click",  () => {
            console.log("Bouton cartBtn cliqué !");
            this.showCart();
         });
          closeCartBtn.addEventListener("click", this.hideCart );
        }
        populateCart(cart){
         cart.forEach(item => this.addCartItem(item));
         console.log("Panier peuplé avec les articles :", cart);
        }
        hideCart(){ 
         console.log("hideCart() appelée !");
         cartOverlay.classList.remove("transparentBcg");
         cartDOM.classList.remove("showCart"); //cacher le  panier
        }
        cartLogic(){
         //clear cart button 
         clearCartBtn.addEventListener('click',()=>{this.clearCart();
      });
         //cart functionality
      cartContent.addEventListener("click",event => {
     if(event.target.classList.contains("remove-item")) 
      {
      let removeItem = event.target; //stock élement cliqué dans cette variable 
      let id = removeItem.dataset.id;
     cartContent.removeChild( 
     removeItem.parentElement.parentElement); 
      this.removeItem(id )
      }
       else if (event.target.classList.contains("fa-chevron-up")){
         let addAmount= event.target;
         let id= addAmount.dataset.id;
         let tempItem =cart.find(item => item.id===id);
         tempItem.amount = tempItem.amount + 1;
         

       }
      
     
      });
        }
        clearCart(){
         let cartItems = cart.map(item=>item.id);  //Crée un nouveau tableau (cartItems) contenant uniquement les id des articles dans le panier
         cartItems.forEach(id => this.removeItem(id)) // cela supprime chaque article du tableau 
         console.log(cartContent.children);
         while(cartContent.children.length>0) // supprimer chaque element dans cart un par un 
            {
            cartContent.removeChild(cartContent.children[0])
            }
         this.hideCart(); //cache le panier
         
         
         console.log(cartItems);
        }
        removeItem(id) {
         cart = cart.filter(item => item.id !==id ); //crée un nv tableau exclu ceux qui ne sont pas supprimé
         this.setCartValue(cart); //pour rendre le nouveau total de cart 
         Storage.saveCart(cart); // Sauvegarde le panier dans le localStorage
         let button = this.getSinglebutton(id); 
         button.disabled = false; 
         button.innerHTML= `<i class=fas fa-shopping-cart></i>add to cart`;// Met à jour le texte du bouton
         }
        getSinglebutton(id){
         return buttonsDOM.find(button => button.dataset.id === id);
        }
 };//end of class UI 
  
 // local Storage 
 class Storage {
    static saveProducts(products){
      localStorage.setItem("products",JSON.stringify(products));
      console.log("Produits sauvegardés dans le localStorage :", products);
   }
    static getProduct(id){
      let products = JSON.parse(localStorage.getItem('products'));
      return products.find(product=> product.id === id)

    }
    static saveCart(cart){
      localStorage.setItem('cart',JSON.stringify(cart));
    }
    static getCart(){
      return localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')):[]
    }
 }

 document.addEventListener("DOMContentLoaded",()=>{
   console.log("DOM entièrement chargé et analysé !");
  const ui = new UI();
  const products = new Products();
  //setup app
  ui.setupAPP();
//get all products
products.getProducts().then(products => {
      ui.displayProducts(products) ;
      Storage.saveProducts(products);
}).then(()=>{
   ui.getBagButtons(); 
   ui.cartLogic();
})
 });

 