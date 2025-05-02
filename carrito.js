// Carrito de compras
let cart = [];
let cartCount = 0;

// Elementos del DOM
const cartItemsContainer = document.getElementById('cartItems');
const cartCountElement = document.querySelector('.cart-count');
const subtotalElement = document.getElementById('subtotal');
const ivaElement = document.getElementById('iva');
const totalElement = document.getElementById('total');
const cartOverlay = document.getElementById('cartOverlay');

// Función para añadir productos al carrito
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));

        // Verificar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                quantity: 1
            });
        }

        cartCount += 1;
        updateCart();
        showCartNotification(name);
    });
});

// Función para actualizar el carrito
function updateCart() {
    // Actualizar contador
    cartCountElement.textContent = cartCount;

    // Actualizar lista de productos
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío</p>';
    } else {
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} MXN x ${item.quantity}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });
    }

    // Calcular totales
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    subtotalElement.textContent = `$${subtotal.toFixed(2)} MXN`;
    ivaElement.textContent = `$${iva.toFixed(2)} MXN`;
    totalElement.textContent = `$${total.toFixed(2)} MXN`;
}

// Función para eliminar productos del carrito
function removeFromCart(id) {
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        cartCount -= cart[itemIndex].quantity;
        cart.splice(itemIndex, 1);
        updateCart();
    }
}

// Función para mostrar/ocultar el carrito
function toggleCart() {
    cartOverlay.classList.toggle('active');
}

// Función para mostrar notificación al añadir producto
function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `¡${productName} añadido al carrito!`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Función para proceder al pago (simulada)
function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    // Guardar los productos del carrito en localStorage
    localStorage.setItem('cartItems', JSON.stringify(cart));
    
    // Calcular totales
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    
    // Guardar totales en localStorage
    localStorage.setItem('orderTotals', JSON.stringify({
        subtotal: subtotal.toFixed(2),
        iva: iva.toFixed(2),
        total: total.toFixed(2)
    }));
    
    // Redirigir a la página de pago
    window.location.href = 'pago.html';
}

// Estilos dinámicos para la notificación
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .cart-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #d4a373;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1001;
    }
    .cart-notification.show {
        opacity: 1;
    }
`;
document.head.appendChild(notificationStyles);