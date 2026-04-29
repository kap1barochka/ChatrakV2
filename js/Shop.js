// ==========================================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ==========================================================
let cart = [];

// ==========================================================
// ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ (Один блок для всего скрипта)
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ИНИЦИАЛИЗАЦИЯ ТОВАРОВ ---
    const cards = document.querySelectorAll('.store-box');
    cards.forEach(card => {
        const getItem = () => {
            if (window.ChatrakI18n && window.ChatrakI18n.getCardItem) {
                const item = window.ChatrakI18n.getCardItem(card);
                item.category = card.getAttribute('data-category') || '';
                return item;
            }
            const name = card.getAttribute('data-name') || 'Unknown Item';
            const priceAttr = card.getAttribute('data-price');
            const imgEl = card.querySelector('img');
            return {
                name,
                sourceName: name,
                price: priceAttr ? parseFloat(priceAttr) : 0,
                desc: card.getAttribute('data-desc') || '',
                img: imgEl ? imgEl.src : '',
                category: card.getAttribute('data-category') || ''
            };
        };

        // Открытие окна деталей при клике на саму карточку
        card.onclick = () => {
            openDetails(getItem());
        };

        // Добавление в корзину при клике на кнопку
        const btn = card.querySelector('.buy-btn');
        if (btn) {
            btn.onclick = (e) => {
                e.stopPropagation(); // Запрещаем открытие окна деталей
                add(getItem()); 
            };
        }
    });

    // --- 2. ЖИВОЙ ПОИСК ---
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (searchInput && searchResults) {
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });

        searchInput.addEventListener('input', (e) => {
            const searchValue = e.target.value.toLowerCase().trim();
            searchResults.innerHTML = ''; 

            if (searchValue === '') {
                searchResults.style.display = 'none';
                cards.forEach(box => box.style.display = '');
                return;
            }

            let hasResults = false;

            cards.forEach(box => {
                const titleEl = box.querySelector('h3');
                const title = titleEl ? titleEl.innerText : '';
                const imgEl = box.querySelector('img');
                const imgSrc = imgEl ? imgEl.src : '';
                
                if (title.toLowerCase().includes(searchValue)) {
                    hasResults = true;
                    box.style.display = ''; 

                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'search-result-item';
                    itemDiv.innerHTML = `<img src="${imgSrc}" alt="${title}"><h4>${title}</h4>`;
                    
                    itemDiv.addEventListener('click', () => {
                        cards.forEach(b => b.style.display = '');
                        searchResults.style.display = 'none';
                        searchInput.value = '';
                        setTimeout(() => {
                            box.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            box.style.transition = "0.4s";
                            box.style.boxShadow = "0 0 25px rgba(127, 88, 21, 0.8)";
                            setTimeout(() => { box.style.boxShadow = "none"; }, 2000);
                        }, 50);
                    });

                    searchResults.appendChild(itemDiv);
                } else {
                    box.style.display = 'none';
                }
            });

            if (hasResults) {
                searchResults.style.display = 'flex';
            } else {
                searchResults.innerHTML = `<div style="padding: 1.5rem; font-size: 1.4rem; color: #888; text-align: center;">${window.chatrakT ? window.chatrakT('No items found') : 'No items found'}</div>`;
                searchResults.style.display = 'flex';
            }
        });
    }

    // --- 3. ФИЛЬТРЫ КАТЕГОРИЙ ---
    const catBoxes = document.querySelectorAll('.cat-box');
    if (catBoxes.length > 0 && cards.length > 0) {
        function filterItems(filterValue) {
            cards.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        catBoxes.forEach(box => {
            box.onclick = () => {
                catBoxes.forEach(b => b.classList.remove('active'));
                box.classList.add('active');
                filterItems(box.getAttribute('data-filter'));
            };
        });
    }

    // --- 4. НАВИГАЦИЯ ПО ХЭШУ (#hash) ---
    const hash = window.location.hash.substring(1); 
    if (hash) {
        const targetBtn = document.querySelector(`.cat-box[data-filter="${hash}"]`);
        if (targetBtn) {
            targetBtn.click();
            setTimeout(() => {
                const grid = document.getElementById('item-grid');
                if (grid) {
                    const offsetPosition = grid.getBoundingClientRect().top + window.pageYOffset - 100;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
            }, 300);
        }
    }

    // --- 5. ЗАКРЫТИЕ КОРЗИНЫ ---
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // --- 6. ЗАКРЫТИЕ ОКНА ОПЛАТЫ ---
    const closeCheckout = document.getElementById('close-checkout');
    if (closeCheckout) {
        closeCheckout.onclick = () => document.getElementById('checkout-modal').style.display = 'none';
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', finishOrder);
    }

    // --- 7. FAQ МОДАЛКА И АККОРДЕОН ---
    const faqBtn = document.getElementById('open-faq-btn');
    const faqModal = document.getElementById('faq-modal');
    const closeFaqBtn = document.getElementById('close-faq-btn');

    if (faqBtn && faqModal) faqBtn.onclick = () => { faqModal.style.display = 'flex'; };
    if (closeFaqBtn && faqModal) closeFaqBtn.onclick = () => { faqModal.style.display = 'none'; };

    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(accordion => {
        const heading = accordion.querySelector('.accordion-heading');
        if (heading) {
            heading.onclick = () => {
                accordions.forEach(acc => { if (acc !== accordion) acc.classList.remove('active'); });
                accordion.classList.toggle('active');
            };
        }
    });
});

// ==========================================================
// ГЛОБАЛЬНЫЕ ФУНКЦИИ (ДЕТАЛИ, КОРЗИНА, ОПЛАТА)
// ==========================================================

function openDetails(item) {
    document.getElementById('det-img').src = item.img;
    document.getElementById('det-title').innerText = item.name;
    document.getElementById('det-desc').innerText = item.desc;
    
    const amd = (item.price * 400).toLocaleString();
    const eur = (item.price * 0.92).toFixed(2);
    
    document.getElementById('det-prices').innerHTML = `
        <p style="margin-bottom: .5rem;">USD: $${item.price.toFixed(2)}</p>
        <p style="margin-bottom: .5rem;">EUR: €${eur}</p>
        <p>AMD: ֏${amd}</p>
    `;
    
    const buyTrigger = document.getElementById('det-buy-trigger');
    if (buyTrigger) {
        buyTrigger.onclick = () => { add(item); closeDetails(); };
    }
    
    const modal = document.getElementById('details-modal');
    if (modal) modal.style.display = 'block';
}

function closeDetails() { 
    const modal = document.getElementById('details-modal');
    if (modal) modal.style.display = 'none'; 
}

function add(item) {
    if (typeof auth !== 'undefined' && auth && !auth.currentUser) {
        const authModal = document.getElementById('auth-modal');
        if (authModal) authModal.style.display = 'flex';
        return; 
    }

    cart.push(item);
    const countEl = document.getElementById('count');
    if (countEl) countEl.innerText = cart.length;
    
    renderCart(); 
    // Строчку openCart(); мы отсюда удалили!
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    if (!container || !totalEl) return; 

    container.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align: center; margin-top: 5rem; font-size: 1.5rem; color: #888;">${window.chatrakT ? window.chatrakT('Your cart is currently empty.') : 'Your cart is currently empty.'}</p>`;
        totalEl.innerText = '0.00';
    } else {
        cart.forEach((i, index) => {
            total += i.price;
            container.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:1.5rem 0; border-bottom:1px solid #eee;">
                    <img src="${i.img}" style="width: 5rem; height: 5rem; object-fit: contain; margin-right: 1.5rem; border-radius: 5px;" alt="Product">
                    <span style="flex: 1; font-size: 1.4rem; color: var(--dark-brown); font-weight: 500;">${i.name}</span>
                    <strong style="margin-right: 1.5rem; font-size: 1.5rem; color: var(--main-color);">$${i.price.toFixed(2)}</strong>
                    <i class="fas fa-trash" style="color: #d9534f; cursor: pointer; font-size: 1.6rem; transition: 0.2s;" onclick="removeItem(${index})" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"></i>
                </div>`;
        });
        totalEl.innerText = total.toFixed(2);
    }
}

function removeItem(index) {
    cart.splice(index, 1); 
    const countEl = document.getElementById('count');
    if (countEl) countEl.innerText = cart.length; 
    renderCart(); 
}

function openCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar) sidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
}

function closeCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

function startCheck(e) {
    if (e) e.preventDefault();

    if (cart.length === 0) {
        alert(window.chatrakT ? window.chatrakT("Your basket is empty! Add some items first.") : "Your basket is empty! Add some items first.");
        return;
    }

    closeCart();
    renderCheckoutSummary();
    prefillCheckoutUser();

    const checkoutModal = document.getElementById('checkout-modal');
    const fill = document.getElementById('fill');
    if (checkoutModal) {
        checkoutModal.style.display = 'flex';
        if (fill) {
            fill.style.width = '0';
            setTimeout(() => { fill.style.width = '35%'; }, 100);
        }
    }
}

function renderCheckoutSummary() {
    const summary = document.getElementById('checkout-summary');
    const total = document.getElementById('checkout-total');
    if (!summary || !total) return;

    let totalValue = 0;
    summary.innerHTML = cart.map(item => {
        totalValue += item.price;
        return `<div class="checkout-summary-item"><span>${item.name}</span><strong>$${item.price.toFixed(2)}</strong></div>`;
    }).join('');
    total.innerText = totalValue.toFixed(2);
}

function prefillCheckoutUser() {
    if (typeof auth !== 'undefined' && auth && auth.currentUser) {
        const nameField = document.getElementById('order-name');
        const emailField = document.getElementById('order-email');
        if (nameField && auth.currentUser.displayName) nameField.value = auth.currentUser.displayName;
        if (emailField && auth.currentUser.email) emailField.value = auth.currentUser.email;
    }
}

function buildOrderItems() {
    const grouped = new Map();

    cart.forEach((item) => {
        const unitPrice = Number(item.price) || 0;
        const sourceName = item.sourceName || item.name || 'Unknown Item';
        const key = `${sourceName}__${unitPrice}`;

        if (!grouped.has(key)) {
            grouped.set(key, {
                name: item.name || sourceName,
                sourceName,
                category: item.category || '',
                unitPrice,
                quantity: 0,
                subtotal: 0,
                image: item.img || ''
            });
        }

        const groupedItem = grouped.get(key);
        groupedItem.quantity += 1;
        groupedItem.subtotal = Number((groupedItem.quantity * unitPrice).toFixed(2));
    });

    return Array.from(grouped.values());
}

function buildOrderRecord(customer) {
    const items = buildOrderItems();
    const totalUSD = Number(items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));

    return {
        orderId: `CH-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        status: 'new',
        source: 'shop-checkout',
        language: window.ChatrakI18n ? window.ChatrakI18n.currentLang() : document.documentElement.getAttribute('data-lang') || 'en',
        customer,
        user: (typeof auth !== 'undefined' && auth && auth.currentUser) ? {
            uid: auth.currentUser.uid || null,
            email: auth.currentUser.email || null,
            displayName: auth.currentUser.displayName || null
        } : null,
        items,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        totalUSD,
        totalEUR: Number((totalUSD * 0.92).toFixed(2)),
        totalAMD: Math.round(totalUSD * 400),
        createdAt: new Date().toISOString()
    };
}

function backupOrderLocally(orderRecord) {
    const previousOrders = JSON.parse(localStorage.getItem('chatrakOrders') || '[]');
    previousOrders.push(orderRecord);
    localStorage.setItem('chatrakOrders', JSON.stringify(previousOrders));
}

async function saveOrderToFirebase(orderRecord) {
    if (typeof firebase === 'undefined' || !firebase.firestore) {
        throw new Error('Firebase Firestore is not loaded.');
    }

    const firestoreRecord = {
        ...orderRecord,
        createdAtClient: orderRecord.createdAt,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    const db = firebase.firestore();
    const ref = await db.collection('orders').add(firestoreRecord);
    return ref.id;
}

async function finishOrder(e) {
    if (e) e.preventDefault();

    if (cart.length === 0) {
        alert(window.chatrakT ? window.chatrakT("Your basket is empty! Add some items first.") : "Your basket is empty! Add some items first.");
        return;
    }

    const name = document.getElementById('order-name').value.trim();
    const email = document.getElementById('order-email').value.trim();
    const phone = document.getElementById('order-phone').value.trim();
    const addr = document.getElementById('order-address').value.trim();
    const note = document.getElementById('order-note').value.trim();

    if (!name || !email || !phone || !addr) {
        alert(window.chatrakT ? window.chatrakT("Please complete all required order fields.") : "Please complete all required order fields.");
        return;
    }

    const form = document.getElementById('checkout-form');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    const originalBtnText = submitBtn ? submitBtn.innerText : '';
    const fill = document.getElementById('fill');

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = window.chatrakT ? window.chatrakT('Sending...') : 'Sending...';
    }
    if (fill) fill.style.width = '100%';

    const orderRecord = buildOrderRecord({
        name,
        email,
        phone,
        address: addr,
        note
    });

    try {
        const firebaseDocId = await saveOrderToFirebase(orderRecord);
        backupOrderLocally({ ...orderRecord, firebaseDocId });

        alert(window.chatrakT ? window.chatrakT("Your order request has been successfully submitted. Chatrak team will contact you soon.") : "Your order request has been successfully submitted. Chatrak team will contact you soon.");

        cart = [];
        const countEl = document.getElementById('count');
        if (countEl) countEl.innerText = 0;
        if (form) form.reset();

        const checkoutModal = document.getElementById('checkout-modal');
        if (checkoutModal) checkoutModal.style.display = 'none';
        if (fill) fill.style.width = '0';

        renderCart();
    } catch (error) {
        console.error("Error saving order to Firebase:", error);
        backupOrderLocally({ ...orderRecord, firebaseError: error.message || String(error) });

        alert(window.chatrakT ? window.chatrakT("Unable to submit the request right now. Please try again.") : "Unable to submit the request right now. Please try again.");
        if (fill) fill.style.width = '35%';
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    }
}


document.addEventListener('chatrak:languagechange', () => {
    renderCart();
    if (document.getElementById('checkout-modal') && document.getElementById('checkout-modal').style.display !== 'none') {
        renderCheckoutSummary();
    }
});
