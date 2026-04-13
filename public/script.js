// Loading Screen Management
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                initRevealAnimations();
                animateCounters();
            }, 600);
        }
    }, 800);
});

// Cursor Glow Effect (Desktop)
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.innerWidth >= 1024) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button visibility
    const backToTop = document.getElementById('backToTop');
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Back to Top functionality
document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Mobile Navigation
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNavPanel = document.getElementById('mobileNavPanel');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobileNavClose = document.getElementById('mobileNavClose');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

function toggleMobileNav() {
    mobileNavPanel.classList.toggle('open');
    mobileNavOverlay.classList.toggle('open');
    document.body.style.overflow = mobileNavPanel.classList.contains('open') ? 'hidden' : '';
}

hamburgerBtn?.addEventListener('click', toggleMobileNav);
mobileNavClose?.addEventListener('click', toggleMobileNav);
mobileNavOverlay?.addEventListener('click', toggleMobileNav);
mobileNavLinks.forEach(link => {
    link.addEventListener('click', toggleMobileNav);
});

// Search Bar & Filtering
const searchToggle = document.getElementById('searchToggle');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');

function openSearch() {
    searchOverlay.classList.add('open');
    setTimeout(() => searchInput.focus(), 200);
}

function closeSearch() {
    // Just close the bar — do NOT clear filter or input
    searchOverlay.classList.remove('open');
}

function clearSearch() {
    searchInput.value = '';
    // Reset product visibility
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
    // Hide the active filter indicator
    const indicator = document.getElementById('activeFilterIndicator');
    if (indicator) indicator.style.display = 'none';
    // Update clear button visibility
    if (searchClear) searchClear.style.display = 'none';
}

searchToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    // Toggle search bar open/close
    if (searchOverlay.classList.contains('open')) {
        closeSearch();
    } else {
        openSearch();
    }
});
searchClose?.addEventListener('click', () => {
    clearSearch();
    closeSearch();
});
searchClear?.addEventListener('click', clearSearch);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay?.classList.contains('open')) {
        closeSearch();
    }
});

// Search functionality — live filtering
searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const productCards = document.querySelectorAll('.product-card');
    const indicator = document.getElementById('activeFilterIndicator');
    const indicatorText = document.getElementById('filterQueryText');
    
    if (query.length === 0) {
        // Show all products
        productCards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        if (indicator) indicator.style.display = 'none';
        if (searchClear) searchClear.style.display = 'none';
        return;
    }
    
    // Show clear button
    if (searchClear) searchClear.style.display = 'flex';

    let matchCount = 0;
    productCards.forEach(card => {
        const title = card.querySelector('.product-name').textContent.toLowerCase();
        if (title.includes(query)) {
            card.style.display = 'block';
            matchCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show active filter indicator below the product section header
    if (indicator) {
        indicator.style.display = 'flex';
        indicatorText.textContent = `"${e.target.value}" — ${matchCount} result${matchCount !== 1 ? 's' : ''}`;
    }
    
    // Jump to products section when typing
    document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
});

// Scroll Reveal Animations
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const speed = 200;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText.replace(/\D/g, '');
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc) + (counter.innerText.includes('k') ? 'k+' : '+');
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target + (counter.innerText.includes('k') ? 'k+' : '+');
            }
        };
        updateCount();
    });
}

// Toast Notification System
let cartCount = 3;
const cartBadge = document.getElementById('cartBadge');

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('.toast-icon');
    
    toastMessage.textContent = message;
    
    if (type === 'success') {
        toastIcon.className = 'bx bx-check-circle toast-icon';
        toastIcon.style.color = 'var(--success)';
    } else if (type === 'heart') {
        toastIcon.className = 'bx bxs-heart toast-icon';
        toastIcon.style.color = 'var(--primary)';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Old local updateCartCount and static item interactions removed in favor of robust array-based Drawer management down below

// Category Filtration
const filterBtns = document.querySelectorAll('.category-pill');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        productCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Quick View Modal
const quickViewModal = document.getElementById('quickViewModal');
const closeQuickView = document.getElementById('closeQuickView');
const qvImage = document.getElementById('qvImage');
const qvName = document.getElementById('qvName');
const qvPrice = document.getElementById('qvPrice');

document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const productCard = this.closest('.product-card');
        const imgSrc = productCard.querySelector('img').src;
        const name = productCard.querySelector('.product-name').textContent;
        const priceHTML = productCard.querySelector('.product-price').innerHTML;
        
        qvImage.src = imgSrc;
        qvName.textContent = name;
        qvPrice.innerHTML = priceHTML;
        
        quickViewModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Reset Qty
        document.querySelector('.qty-value').textContent = '1';
    });
});

function closeQV() {
    quickViewModal.classList.remove('open');
    document.body.style.overflow = '';
}

closeQuickView?.addEventListener('click', closeQV);
quickViewModal?.addEventListener('click', (e) => {
    if (e.target === quickViewModal) closeQV();
});

// Quantity Selector in Quick View
const qtyMinus = document.querySelector('.qty-minus');
const qtyPlus = document.querySelector('.qty-plus');
const qtyValue = document.querySelector('.qty-value');

if (qtyMinus && qtyPlus && qtyValue) {
    qtyMinus.addEventListener('click', () => {
        let val = parseInt(qtyValue.textContent);
        if (val > 1) qtyValue.textContent = val - 1;
    });
    
    qtyPlus.addEventListener('click', () => {
        let val = parseInt(qtyValue.textContent);
        if (val < 10) qtyValue.textContent = val + 1;
    });
}

// Newsletter Form
const newsletterBtn = document.getElementById('newsletterBtn');
const newsletterEmail = document.getElementById('newsletterEmail');

newsletterBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (newsletterEmail.value && newsletterEmail.value.includes('@')) {
        const originalText = newsletterBtn.textContent;
        newsletterBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i>';
        
        setTimeout(() => {
            newsletterBtn.textContent = 'Subscribed!';
            newsletterBtn.style.background = 'var(--success)';
            newsletterEmail.value = '';
            showToast('Welcome to Kumo insiders!', 'success');
            
            setTimeout(() => {
                newsletterBtn.textContent = originalText;
                newsletterBtn.style.background = '';
            }, 3000);
        }, 1500);
    } else {
        newsletterEmail.style.borderColor = 'var(--primary)';
        newsletterEmail.focus();
        setTimeout(() => {
            newsletterEmail.style.borderColor = '';
        }, 2000);
    }
});

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== DARK MODE TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const icon = themeToggle?.querySelector('i');

// Check local storage for theme
const savedTheme = localStorage.getItem('kumoTheme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    if (icon) icon.className = 'bx bx-sun';
}

themeToggle?.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    
    // Switch icon
    if (icon) {
        icon.className = isDark ? 'bx bx-sun' : 'bx bx-moon';
        // Add spin animation
        icon.style.transform = 'rotate(360deg)';
        icon.style.transition = 'transform 0.5s ease';
        setTimeout(() => icon.style.transform = '', 500);
    }
    
    // Save to local storage
    localStorage.setItem('kumoTheme', isDark ? 'dark' : 'light');
});

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all others
        faqItems.forEach(faq => faq.classList.remove('active'));
        
        // Toggle current
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== VIDEO MODAL =====
const watchStoryBtn = document.getElementById('watchStoryBtn');
const videoModal = document.getElementById('videoModal');
const closeVideoBtn = document.getElementById('closeVideoBtn');

watchStoryBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
});

closeVideoBtn?.addEventListener('click', () => {
    videoModal.classList.remove('open');
    document.body.style.overflow = '';
});

videoModal?.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        videoModal.classList.remove('open');
        document.body.style.overflow = '';
    }
});

// ===== CART DRAWER LOGIC =====
const cartDrawerBtn = document.getElementById('cartDrawerBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const cartItemCount = document.getElementById('cartItemCount');

let cartData = [];

function toggleCart() {
    cartDrawer.classList.toggle('open');
    cartDrawerOverlay.classList.toggle('open');
    document.body.style.overflow = cartDrawer.classList.contains('open') ? 'hidden' : '';
}

cartDrawerBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleCart();
});
closeCartBtn?.addEventListener('click', toggleCart);
cartDrawerOverlay?.addEventListener('click', toggleCart);

// Intercept Add to Cart buttons to actually add items
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    // Clone node to drop original event listeners so we don't double trigger
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const card = this.closest('.product-card');
        const id = card.getAttribute('data-id') || Math.random().toString();
        const title = card.querySelector('.product-name').textContent;
        const img = card.querySelector('img').src;
        let priceText = card.querySelector('.product-price').getAttribute('data-price');
        let price = parseFloat(priceText) || 0;
        
        addToCart({ id, title, img, price, quantity: 1 });
        
        // Button animation
        const originalHtml = this.innerHTML;
        this.innerHTML = '<i class="bx bx-check"></i>';
        this.style.background = 'var(--success)';
        this.style.color = 'white';
        
        showToast('Successfully added to cart!', 'success');
        
        setTimeout(() => {
            this.innerHTML = originalHtml;
            this.style.background = '';
            this.style.color = '';
        }, 1500);
    });
});

function addToCart(item) {
    const existing = cartData.find(i => i.id === item.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cartData.push(item);
    }
    renderCart();
}

function removeFromCart(id) {
    cartData = cartData.filter(i => i.id !== id);
    renderCart();
}

function updateCartQuantity(id, newQty) {
    const item = cartData.find(i => i.id === id);
    if (item && newQty > 0) {
        item.quantity = newQty;
    }
    renderCart();
}

function renderCart() {
    // Update Badge
    const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.transform = 'scale(1.5)';
        setTimeout(() => cartBadge.style.transform = '', 300);
    }
    if (cartItemCount) cartItemCount.textContent = totalItems;
    
    // Update HTML
    if (cartData.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-msg">
                <i class='bx bx-shopping-bag' style="font-size: 3rem; color: var(--text-muted); opacity: 0.5;"></i>
                <p>Your cart is empty.</p>
                <button class="hero-cta" style="padding: 10px 20px !important; margin-top: 15px;" onclick="document.getElementById('closeCartBtn').click(); window.location.href='#products-section';">Start Shopping</button>
            </div>
        `;
        cartSubtotalEl.textContent = '$0.00';
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    cartData.forEach(item => {
        subtotal += item.price * item.quantity;
        html += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <div class="qty-selector" style="transform: scale(0.85); transform-origin: left;">
                            <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">−</button>
                            <span class="qty-value">${item.quantity}</span>
                            <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                        <i class='bx bx-trash cart-item-remove' onclick="removeFromCart('${item.id}')"></i>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    cartSubtotalEl.textContent = '$' + subtotal.toFixed(2);
}

// Reset initial cart rendering
renderCart();

// ===== WISHLIST LOGIC =====
const wishlistDrawerBtn = document.getElementById('wishlistDrawerBtn');
const wishlistDrawer = document.getElementById('wishlistDrawer');
const closeWishlistBtn = document.getElementById('closeWishlistBtn');
const wishlistItemsContainer = document.getElementById('wishlistItemsContainer');
const wishlistFooter = document.getElementById('wishlistFooter');
const wishlistCountElements = [document.getElementById('wishlistCount'), document.getElementById('wishlistCountNav')];

let wishlistData = [];

function toggleWishlist() {
    wishlistDrawer.classList.toggle('open');
    cartDrawerOverlay.classList.toggle('open');
    document.body.style.overflow = wishlistDrawer.classList.contains('open') ? 'hidden' : '';
}

wishlistDrawerBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleWishlist();
});
closeWishlistBtn?.addEventListener('click', toggleWishlist);

// Re-map wishlist buttons correctly
document.querySelectorAll('.wishlist-btn, .wishlist-toggle').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const card = this.closest('.product-card');
        const id = card.getAttribute('data-id') || Math.random().toString();
        const title = card.querySelector('.product-name').textContent;
        const img = card.querySelector('img').src;
        let priceText = card.querySelector('.product-price').getAttribute('data-price');
        let price = parseFloat(priceText) || 0;

        const isOverlayBtn = this.classList.contains('wishlist-toggle');
        const icon = isOverlayBtn ? this.querySelector('i') : this;
        
        // Remove from wishlist
        if (icon.classList.contains('bxs-heart')) {
            icon.classList.replace('bxs-heart', 'bx-heart');
            icon.style.color = '';
            if (!isOverlayBtn) this.classList.remove('active');
            
            wishlistData = wishlistData.filter(i => i.id !== id);
            renderWishlist();
        } else {
            // Add to wishlist
            icon.classList.replace('bx-heart', 'bxs-heart');
            icon.style.color = 'var(--primary)';
            if (!isOverlayBtn) this.classList.add('active');
            
            if (!wishlistData.find(i => i.id === id)) {
                wishlistData.push({ id, title, img, price });
            }
            showToast('Added to wishlist!', 'heart');
            renderWishlist();
        }
    });
});

function removeWishlistItem(id) {
    wishlistData = wishlistData.filter(i => i.id !== id);
    renderWishlist();
    // Also reset UI heart icons
    document.querySelectorAll('.product-card').forEach(card => {
        if (card.getAttribute('data-id') === id) {
            card.querySelectorAll('.bx-heart, .bxs-heart').forEach(icon => {
                icon.className = 'bx bx-heart';
                icon.style.color = '';
            });
        }
    });
}

function renderWishlist() {
    wishlistCountElements.forEach(el => {
        if (el) el.textContent = wishlistData.length;
    });

    if (wishlistData.length === 0) {
        wishlistItemsContainer.innerHTML = `
            <div class="empty-cart-msg">
                <i class='bx bx-heart' style="font-size: 3rem; color: var(--text-muted); opacity: 0.5;"></i>
                <p>Your wishlist is empty.</p>
                <button class="hero-cta" style="padding: 10px 20px !important; margin-top: 15px;" onclick="document.getElementById('closeWishlistBtn').click(); window.location.href='#products-section';">Discover Products</button>
            </div>
        `;
        if (wishlistFooter) wishlistFooter.style.display = 'none';
        return;
    }
    
    if (wishlistFooter) wishlistFooter.style.display = 'block';
    
    let html = '';
    wishlistData.forEach(item => {
        html += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-actions" style="margin-top:10px;">
                        <button class="hero-cta" style="padding: 4px 12px !important; border-radius: 4px !important; font-size: 0.8rem;" onclick="addSingleWishToCart('${item.id}');">Add to Cart</button>
                        <i class='bx bx-trash cart-item-remove' onclick="removeWishlistItem('${item.id}')"></i>
                    </div>
                </div>
            </div>
        `;
    });
    wishlistItemsContainer.innerHTML = html;
}

window.addSingleWishToCart = function(id) {
    const item = wishlistData.find(i => i.id === id);
    if (item) {
        addToCart({ ...item, quantity: 1 });
        removeWishlistItem(id);
        showToast('Moved to cart!', 'success');
    }
};

window.moveAllToCart = function() {
    if (wishlistData.length === 0) return;
    wishlistData.forEach(item => addToCart({ ...item, quantity: 1 }));
    wishlistData = [];
    renderWishlist();
    // Reset all heart icons in UI
    document.querySelectorAll('.bxs-heart:not(.toast-icon)').forEach(icon => {
        icon.className = 'bx bx-heart';
        icon.style.color = '';
    });
    showToast('All items added to cart!', 'success');
    toggleWishlist();
    setTimeout(toggleCart, 500); // Open cart to show items
};


// ===== PROFILE / AUTH MODAL LOGIC =====
const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const closeProfileBtn = document.getElementById('closeProfileBtn');
const authContent = document.getElementById('authContent');
const profileContent = document.getElementById('profileContent');

let isLoggedIn = localStorage.getItem('kumoLoggedIn') === 'true';

function updateProfileModalView() {
    if (isLoggedIn) {
        authContent.classList.add('hidden');
        profileContent.classList.remove('hidden');
    } else {
        authContent.classList.remove('hidden');
        profileContent.classList.add('hidden');
    }
}

profileBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    updateProfileModalView();
    profileModal.classList.add('open');
    document.body.style.overflow = 'hidden';
});

closeProfileBtn?.addEventListener('click', () => {
    profileModal.classList.remove('open');
    document.body.style.overflow = '';
});

document.getElementById('signInBtn')?.addEventListener('click', () => {
    const btn = document.getElementById('signInBtn');
    btn.innerHTML = '<i class="bx bx-loader-alt bx-spin mr-2"></i> Signing in...';
    setTimeout(() => {
        isLoggedIn = true;
        localStorage.setItem('kumoLoggedIn', 'true');
        btn.innerHTML = 'Sign In automatically';
        updateProfileModalView();
        showToast('Welcome back, Guest!', 'success');
    }, 1000);
});

document.getElementById('signOutBtn')?.addEventListener('click', () => {
    isLoggedIn = false;
    localStorage.setItem('kumoLoggedIn', 'false');
    updateProfileModalView();
    showToast('Signed out successfully.', 'success');
    profileModal.classList.remove('open');
    document.body.style.overflow = '';
});

// Profile Tabs Logic
const profileTabBtns = document.querySelectorAll('.profile-tab-btn');
const profileTabContents = document.querySelectorAll('.profile-tab-content');

profileTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Reset ALL buttons
        profileTabBtns.forEach(b => {
            b.classList.remove('border-[var(--primary)]', 'text-[var(--primary)]', 'active');
            b.classList.add('border-transparent', 'text-gray-500');
        });
        // Activate clicked button
        btn.classList.add('border-[var(--primary)]', 'text-[var(--primary)]', 'active');
        btn.classList.remove('border-transparent', 'text-gray-500');
        
        // Hide ALL contents
        profileTabContents.forEach(content => content.classList.add('hidden'));
        
        // Show target content
        const targetId = btn.getAttribute('data-tab');
        document.getElementById(targetId).classList.remove('hidden');
    });
});

// Save Profile Settings Logic
const saveProfileBtn = document.getElementById('saveProfileBtn');
const editProfileName = document.getElementById('editProfileName');
const editProfileEmail = document.getElementById('editProfileEmail');
const profileNameDisplay = document.getElementById('profileNameDisplay');
const profileEmailDisplay = document.getElementById('profileEmailDisplay');

// Retrieve custom profile details if they exist
const savedName = localStorage.getItem('kumoProfileName');
const savedEmail = localStorage.getItem('kumoProfileEmail');
if(savedName) {
    if(profileNameDisplay) profileNameDisplay.textContent = savedName;
    if(editProfileName) editProfileName.value = savedName;
}
if(savedEmail) {
    if(profileEmailDisplay) profileEmailDisplay.textContent = savedEmail;
    if(editProfileEmail) editProfileEmail.value = savedEmail;
}

saveProfileBtn?.addEventListener('click', () => {
    const newName = editProfileName.value;
    const newEmail = editProfileEmail.value;
    
    // Save
    localStorage.setItem('kumoProfileName', newName);
    localStorage.setItem('kumoProfileEmail', newEmail);
    
    // Update Display
    profileNameDisplay.textContent = newName;
    profileEmailDisplay.textContent = newEmail;
    
    const originalText = saveProfileBtn.textContent;
    saveProfileBtn.innerHTML = '<i class="bx bx-check"></i> Saved!';
    saveProfileBtn.style.background = 'var(--success)';
    saveProfileBtn.style.color = 'white';
    
    showToast('Profile updated successfully!', 'success');
    
    setTimeout(() => {
        saveProfileBtn.textContent = originalText;
        saveProfileBtn.style.background = '';
        saveProfileBtn.style.color = '';
    }, 2000);
});

// QUICK VIEW ADD TO CART FIX
const qvAddToCartBtn = document.getElementById('qvAddToCartBtn');
qvAddToCartBtn?.addEventListener('click', () => {
    const name = document.getElementById('qvName').textContent;
    const img = document.getElementById('qvImage').src;
    const priceText = document.getElementById('qvPrice').textContent.replace('$', '');
    const price = parseFloat(priceText) || 0;
    const qty = parseInt(document.querySelector('.qty-value').textContent) || 1;
    
    const id = "qv_" + Math.random().toString().substr(2, 6);
    
    addToCart({ id, title: name, img, price, quantity: qty });
    
    const originalText = qvAddToCartBtn.innerHTML;
    qvAddToCartBtn.innerHTML = '<i class="bx bx-check mr-2"></i> Added!';
    qvAddToCartBtn.style.background = 'var(--success)';
    qvAddToCartBtn.style.color = 'white';
    
    showToast(`${qty}x ${name} added to cart!`, 'success');
    
    setTimeout(() => {
        qvAddToCartBtn.innerHTML = originalText;
        qvAddToCartBtn.style.background = '';
        qvAddToCartBtn.style.color = '';
        closeQV();
    }, 1200);
});

// ===== CHECKOUT MODAL LOGIC =====
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
const checkoutProcess = document.getElementById('checkoutProcess');
const checkoutSuccess = document.getElementById('checkoutSuccess');
const checkoutProgress = document.getElementById('checkoutProgress');

checkoutBtn?.addEventListener('click', () => {
    if (cartData.length === 0) {
        showToast('Your cart is empty', 'warning');
        return;
    }
    
    // Close cart, open checkout
    toggleCart(); 
    
    // Reset Process
    checkoutProcess.classList.remove('hidden');
    checkoutSuccess.classList.add('hidden');
    checkoutProgress.style.width = '0%';
    closeCheckoutBtn.style.display = 'none'; // Deny closing during fake sync
    
    checkoutModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        checkoutProgress.style.width = '100%';
    }, 100);
    
    // Simulate transaction Complete
    setTimeout(() => {
        checkoutProcess.classList.add('hidden');
        checkoutSuccess.classList.remove('hidden');
        closeCheckoutBtn.style.display = 'block';
        
        // Empty Cart exactly on success
        cartData = [];
        renderCart();
    }, 3200);
});

closeCheckoutBtn?.addEventListener('click', () => {
    checkoutModal.classList.remove('open');
    document.body.style.overflow = '';
});

window.closeCheckoutForce = function() {
    checkoutModal.classList.remove('open');
    document.body.style.overflow = '';
};
