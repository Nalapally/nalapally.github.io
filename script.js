const fruits = [
    { name: "Watermelon", price: 30, image: "images/watermelon.png" },
    { name: "Grapes", price: 70, image: "images/grapes.png" }
];

$(document).ready(function () {
    let cart = {};

    fruits.forEach((fruit, index) => {
        $("#fruit-list").append(`
            <div class="col-md-3">
                <div class="card">
                    <img src="${fruit.image}" class="card-img-top" alt="${fruit.name}">
                    <div class="card-body text-center">
                        <h5>${fruit.name}</h5>
                        <p>Price: ₹${fruit.price}</p>
                        <button class="btn btn-primary add-to-cart" data-index="${index}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `);
    });

    $(".add-to-cart").click(function () {
        let index = $(this).data("index");
        let fruit = fruits[index];

        if (cart[fruit.name]) {
            cart[fruit.name].quantity += 1;
        } else {
            cart[fruit.name] = { price: fruit.price, quantity: 1 };
        }

        displayCartSummary();
    });

    function displayCartSummary() {
        let summary = "<ul>";
        for (let fruit in cart) {
            summary += `<li>${fruit}: ${cart[fruit].quantity} x ₹${cart[fruit].price} = ₹${cart[fruit].quantity * cart[fruit].price}</li>`;
        }
        summary += "</ul>";
        $("#cart-summary").html(summary);
    }

    $("#orderButton").click(function () {
        let message = "Order Summary:\n";
        for (let fruit in cart) {
            message += `${fruit}: ${cart[fruit].quantity} x ₹${cart[fruit].price} = ₹${cart[fruit].quantity * cart[fruit].price}\n`;
        }
        let whatsappLink = `https://wa.me/917898912345?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, "_blank");
    });
});