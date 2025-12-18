 let photoDataURLs = [];
        let videoDataURL = '';
        function updatePreview() {
            const preview = document.getElementById('preview');
            preview.innerHTML = '';
            if (photoDataURLs[0]) {
                const img1 = document.createElement('img');
                img1.src = photoDataURLs[0];
                img1.alt = 'Front Photo';
                preview.appendChild(img1);
            }
            if (photoDataURLs[1]) {
                const img2 = document.createElement('img');
                img2.src = photoDataURLs[1];
                img2.alt = 'Back Photo';
                preview.appendChild(img2);
            }
            if (videoDataURL) {
                const vid = document.createElement('video');
                vid.src = videoDataURL;
                vid.controls = true;
                preview.appendChild(vid);
            }
        }
        document.getElementById('frontPhoto').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                photoDataURLs[0] = evt.target.result;
                updatePreview();
            };
            reader.readAsDataURL(file);
        });
        document.getElementById('backPhoto').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                photoDataURLs[1] = evt.target.result;
                updatePreview();
            };
            reader.readAsDataURL(file);
        });
        document.getElementById('video').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) {
                videoDataURL = '';
                updatePreview();
                return;
            }
            const reader = new FileReader();
            reader.onload = function(evt) {
                videoDataURL = evt.target.result;
                updatePreview();
            };
            reader.readAsDataURL(file);
        });

        const currencySymbols = {
            USD: '$',
            INR: '₹',
            EUR: '€',
            GBP: '£'
        };

        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        function updateCartCount() {
            document.getElementById('cartCount').textContent = cart.length;
        }
        function addToCart(product) {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
        }
        function removeFromCart(index) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            renderCartModal();
        }

        function renderCartModal() {
            const cartModal = document.getElementById('cartModal');
            const cartItemsList = document.getElementById('cartItemsList');
            const cartModalEmpty = document.getElementById('cartModalEmpty');
            const cartModalBuy = document.getElementById('cartModalBuy');
            cartItemsList.innerHTML = '';
            if (cart.length === 0) {
                cartModalEmpty.style.display = '';
                cartModalBuy.style.display = 'none';
                return;
            }
            cartModalEmpty.style.display = 'none';
            cartModalBuy.style.display = '';
            cart.forEach((item, idx) => {
                let symbol = currencySymbols[item.currency] || '$';
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <span class="cart-item-title">${item.title}</span>
                    <span style="white-space:nowrap;">${symbol}${item.price}</span>
                    <button class="cart-item-remove" title="Remove" data-idx="${idx}">&times;</button>
                `;
                cartItemsList.appendChild(div);
            });
            cartItemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.onclick = function(e) {
                    e.stopPropagation();
                    removeFromCart(Number(btn.getAttribute('data-idx')));
                };
            });
        }
        document.getElementById('cartModalClose').onclick = function() {
            document.getElementById('cartModal').style.display = 'none';
        };
        document.getElementById('cartModal').onclick = function(e) {
            if (e.target === this) this.style.display = 'none';
        };
        document.getElementById('cartModalBuy').onclick = function() {
            if (cart.length === 0) return;
            alert('Thank you for your purchase!\n\n' + cart.map((p, i) => `${i+1}. ${p.title}`).join('\n'));
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            renderCartModal();
            document.getElementById('cartModal').style.display = 'none';
        };

        (function addCartButton() {
            let cartContainer = document.getElementById('cartContainer');
            if (!cartContainer) {
                cartContainer = document.createElement('div');
                cartContainer.id = 'cartContainer';
                cartContainer.style.position = 'fixed';
                cartContainer.style.top = '100px';
                cartContainer.style.right = '32px';
                cartContainer.style.zIndex = '1001';
                cartContainer.style.display = 'flex';
                cartContainer.style.flexDirection = 'column';
                cartContainer.style.alignItems = 'flex-end';
                document.body.appendChild(cartContainer);
            }
            const cartBtn = document.createElement('button');
            cartBtn.id = 'cartBtn';
            cartBtn.style.background = '#fff';
            cartBtn.style.border = '1px solid #007bff';
            cartBtn.style.color = '#007bff';
            cartBtn.style.borderRadius = '50px';
            cartBtn.style.width = '110px';
            cartBtn.style.height = '40px';
            cartBtn.style.fontSize = '14px';
            cartBtn.style.cursor = 'pointer';
            cartBtn.style.display = 'flex';
            cartBtn.style.alignItems = 'center';
            cartBtn.style.justifyContent = 'center';
            cartBtn.style.gap = '4px';
            cartBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            cartBtn.innerHTML = `🛒 <span style="margin-left:2px;">Cart (<span id="cartCount">0</span>)</span>`;
            cartContainer.appendChild(cartBtn);
            updateCartCount();
            cartBtn.onclick = function() {
                renderCartModal();
                document.getElementById('cartModal').style.display = 'flex';
            };
        })();

        function createModal() {
            let modal = document.getElementById('productModal');
            if (modal) return modal;
            modal = document.createElement('div');
            modal.id = 'productModal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            modal.style.background = 'rgba(0,0,0,0.4)';
            modal.style.display = 'none';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '2000';
            modal.innerHTML = `
                <div id="modalContent" style="background:#fff; border-radius:10px; max-width:420px; width:95vw; padding:24px; position:relative; box-shadow:0 4px 32px rgba(0,0,0,0.18);">
                    <button id="closeModal" style="position:absolute; top:12px; right:16px; background:none; border:none; font-size:22px; cursor:pointer;">&times;</button>
                    <div id="modalBody"></div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('#closeModal').onclick = () => { modal.style.display = 'none'; };
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
            return modal;
        }

        function addProductCard(product) {
            const productsList = document.getElementById('productsList');
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.cursor = 'pointer';

            let frontImg = product.photos && product.photos[0] ? product.photos[0] : 'https://via.placeholder.com/240x140?text=Front+View';
            let symbol = currencySymbols[product.currency] || '$';

            card.innerHTML = `
                <img src="${frontImg}" alt="Front View" style="width:100%; height:140px;">
                <div class="product-title">${product.title}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">${symbol}${product.price}</div>
            `;

            card.addEventListener('click', function(e) {
                const modal = createModal();
                let backImg = product.photos && product.photos[1] ? product.photos[1] : 'https://via.placeholder.com/240x140?text=Back+View';
                let videosHTML = '';
                if (product.videos && product.videos.length) {
                    videosHTML = product.videos.map(
                        v => `<video controls width="100%" style="margin-top:8px; border-radius:4px;" class="product-video"><source src="${v}" type="video/mp4">Your browser does not support the video tag.</video>`
                    ).join('');
                }
                modal.querySelector('#modalBody').innerHTML = `
                    <div style="display:flex; gap:8px; margin-bottom:10px;">
                        <img src="${frontImg}" alt="Front View" style="width:48%; height:100px;">
                        <img src="${backImg}" alt="Back View" style="width:48%; height:100px;">
                    </div>
                    <div class="product-title" style="font-size:20px;">${product.title}</div>
                    <div class="product-category">${product.category}</div>
                    <div class="product-price" style="font-size:18px; margin-bottom:8px;">${symbol}${product.price}</div>
                    <div class="product-desc" style="margin-bottom:8px;">${product.description || ''}</div>
                    ${videosHTML}
                    <div style="display:flex; gap:10px; margin-top:16px;">
                        <button style="background:#28a745; color:#fff; flex:1; padding:10px 0; border:none; border-radius:4px; font-size:16px; cursor:pointer;" id="modalAddCart">Add to Cart</button>
                        <button style="background:#ffc107; color:#222; flex:1; padding:10px 0; border:none; border-radius:4px; font-size:16px; cursor:pointer;" id="modalBuyNow">Buy Now</button>
                    </div>
                `;
                modal.style.display = 'flex';

                modal.querySelector('#modalAddCart').onclick = function(ev) {
                    ev.stopPropagation();
                    addToCart(product);
                    modal.style.display = 'none';
                };
                modal.querySelector('#modalBuyNow').onclick = function(ev) {
                    ev.stopPropagation();
                    alert('Proceeding to buy: ' + product.title);
                    modal.style.display = 'none';
                };
            });

            productsList.prepend(card);
        }

        const initialProducts = [
            {
                category: 'Laptop',
                title: 'HP Pavilion 14',
                description: 'Good condition, 8GB RAM, 256GB SSD.',
                price: 35000,
                currency: 'INR',
                photos: [
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'
                ],
                videos: ['https://www.w3schools.com/html/mov_bbb.mp4']
            },
            {
                category: 'Mobile',
                title: 'iPhone 12',
                description: 'Blue, 128GB, minor scratches.',
                price: 500,
                currency: 'USD',
                photos: [
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=400&q=80'
                ],
                videos: ['https://www.w3schools.com/html/movie.mp4']
            },
            {
                category: 'PC',
                title: 'Custom Gaming PC',
                description: 'Ryzen 5, GTX 1660, 16GB RAM.',
                price: 650,
                currency: 'EUR',
                photos: [
                    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'
                ],
                videos: []
            },
            {
                category: 'Accessories',
                title: 'Logitech MX Master 3 Mouse',
                description: 'Wireless, ergonomic, barely used.',
                price: 55,
                currency: 'GBP',
                photos: [
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=400&q=80'
                ],
                videos: []
            }
        ];

        initialProducts.forEach(addProductCard);

        document.getElementById('sellForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const category = document.getElementById('category').value;
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const price = document.getElementById('price').value;
            const currency = document.getElementById('currency').value;
            const photos = [photoDataURLs[0] || '', photoDataURLs[1] || ''];
            const videos = videoDataURL ? [videoDataURL] : [];

            addProductCard({ category, title, description, price, currency, photos, videos });

            alert('Your product has been added to the marketplace!');
            this.reset();
            photoDataURLs = [];
            videoDataURL = '';
            updatePreview();
        });