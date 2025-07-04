  // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        const html = document.documentElement;

        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            html.classList.add('dark');
        }

        darkModeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        const contentSections = document.querySelectorAll('.content-section');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetSection = item.getAttribute('data-section');
                
                // Remove active class from all nav items
                navItems.forEach(nav => {
                    nav.classList.remove('bg-blue-50', 'dark:bg-blue-900/30', 'text-blue-700', 'dark:text-blue-300', 'font-medium');
                    nav.classList.add('text-gray-700', 'dark:text-gray-300');
                });
                
                // Add active class to clicked item
                item.classList.add('bg-blue-50', 'dark:bg-blue-900/30', 'text-blue-700', 'dark:text-blue-300', 'font-medium');
                item.classList.remove('text-gray-700', 'dark:text-gray-300');
                
                // Hide all content sections
                contentSections.forEach(section => {
                    section.classList.add('hidden');
                });
                
                // Show target section
                document.getElementById(targetSection).classList.remove('hidden');
            });
        });

        // Personal Information Edit Mode
        const editPersonalBtn = document.getElementById('editPersonalBtn');
        const savePersonalBtn = document.getElementById('savePersonalBtn');
        const cancelPersonalBtn = document.getElementById('cancelPersonalBtn');
        const personalViewMode = document.getElementById('personalViewMode');
        const personalEditMode = document.getElementById('personalEditMode');

        editPersonalBtn.addEventListener('click', () => {
            personalViewMode.classList.add('editing');
            personalEditMode.classList.add('active');
        });

        cancelPersonalBtn.addEventListener('click', () => {
            personalViewMode.classList.remove('editing');
            personalEditMode.classList.remove('active');
        });

        savePersonalBtn.addEventListener('click', () => {
            // Get values from edit form
            const firstName = document.getElementById('editFirstName').value;
            const lastName = document.getElementById('editLastName').value;
            const email = document.getElementById('editEmail').value;
            const phone = document.getElementById('editPhone').value;
            const dob = document.getElementById('editDob').value;

            // Update view mode
            document.getElementById('viewFirstName').textContent = firstName;
            document.getElementById('viewLastName').textContent = lastName;
            document.getElementById('viewEmail').textContent = email;
            document.getElementById('viewPhone').textContent = phone;
            
            // Format date
            const dobDate = new Date(dob);
            const formattedDob = dobDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            document.getElementById('viewDob').textContent = formattedDob;

            // Update sidebar display
            document.getElementById('displayName').textContent = `${firstName} ${lastName}`;
            document.getElementById('displayEmail').textContent = email;

            // Exit edit mode
            personalViewMode.classList.remove('editing');
            personalEditMode.classList.remove('active');

            // Show success message (you can customize this)
            showNotification('Profile updated successfully!', 'success');
        });

        // Toggle switches for preferences
        const toggleSwitches = document.querySelectorAll('#preferences button[class*="relative"]');
        toggleSwitches.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const isActive = toggle.classList.contains('bg-blue-500');
                const span = toggle.querySelector('span');
                
                if (isActive) {
                    toggle.classList.remove('bg-blue-500');
                    toggle.classList.add('bg-gray-200', 'dark:bg-gray-700');
                    span.classList.remove('translate-x-6');
                    span.classList.add('translate-x-1');
                } else {
                    toggle.classList.add('bg-blue-500');
                    toggle.classList.remove('bg-gray-200', 'dark:bg-gray-700');
                    span.classList.add('translate-x-6');
                    span.classList.remove('translate-x-1');
                }
            });
        });



        // Notification system
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
                type === 'success' ? 'bg-green-500 text-white' : 
                type === 'error' ? 'bg-red-500 text-white' : 
                'bg-blue-500 text-white'
            }`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            // Slide in
            setTimeout(() => {
                notification.classList.remove('translate-x-full');
            }, 100);
            
            // Slide out and remove
            setTimeout(() => {
                notification.classList.add('translate-x-full');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Fade in animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Initialize page
        window.addEventListener('load', () => {
            // Trigger initial animations
            setTimeout(() => {
                document.querySelectorAll('.fade-in').forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, index * 100);
                });
            }, 300);
        });

        window.addEventListener('DOMContentLoaded', async () => {
            try {
                const response = await fetch('/account/profile');
                if (!response.ok) throw new Error('Failed to fetch user info');
                const user = await response.json();

                // Split name into first and last (simple split, adjust as needed)
                const [firstName, ...lastNameArr] = (user.name || '').split(' ');
                const lastName = lastNameArr.join(' ');

                // View mode
                document.getElementById('viewFirstName').textContent = firstName || '';
                document.getElementById('viewLastName').textContent = lastName || '';
                document.getElementById('viewEmail').textContent = user.email || '';
                document.getElementById('viewPhone').textContent = user.phone || '';
                document.getElementById('displayName').textContent = user.name || '';
                document.getElementById('displayEmail').textContent = user.email || '';
                document.getElementById('profileAvatar').src = user.image || '/placeholder.svg?height=80&width=80';

                // Format date of birth if you have it (assuming user.dob exists)
                // if (user.dob) {
                //     const dobDate = new Date(user.dob);
                //     const formattedDob = dobDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                //     document.getElementById('viewDob').textContent = formattedDob;
                //     document.getElementById('editDob').value = user.dob;
                // }

                // Edit mode
                document.getElementById('editFirstName').value = firstName || '';
                document.getElementById('editLastName').value = lastName || '';
                document.getElementById('editEmail').value = user.email || '';
                document.getElementById('editPhone').value = user.phone || '';

                // You can also populate addresses, preferences, etc. here if needed

                // After fetching user info in DOMContentLoaded
                const addressList = document.getElementById('addressList');
                addressList.innerHTML = ''; // Clear previous content

                if (user.shipping && Array.isArray(user.shipping) && user.shipping.length > 0) {
                    user.shipping.forEach(address => {
                        const addressDiv = document.createElement('div');
                        addressDiv.className = 'border border-gray-200 dark:border-gray-700 rounded-lg p-4';
                        addressDiv.innerHTML = `
                            <div class="flex justify-between items-start">
                                <div>
                                    <div class="flex items-center mb-2">
                                        <h3 class="font-medium text-gray-900 dark:text-white">${address.label || 'Address'}</h3>
                                        ${address.default ? `<span class="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">Default</span>` : ''}
                                    </div>
                                    <p class="text-gray-600 dark:text-gray-300">${address.name || ''}</p>
                                    <p class="text-gray-600 dark:text-gray-300">${address.phone || ''}</p>
                                    <p class="text-gray-600 dark:text-gray-300">${address.address || ''}</p>
                                    <p class="text-gray-600 dark:text-gray-300">${address.city || ''}${address.state ? ', ' + address.state : ''} ${address.zip || ''}</p>
                                    <p class="text-gray-600 dark:text-gray-300">${address.country || ''}</p>
                                </div>
                                <div class="flex space-x-2">
                                    <button class="text-blue-500 hover:text-blue-700">Edit</button>
                                    <button class="text-red-500 hover:text-red-700">Delete</button>
                                </div>
                            </div>
                        `;
                        addressList.appendChild(addressDiv);
                    });
                } else {
                    addressList.innerHTML = `<p class="text-gray-500 dark:text-gray-400">No addresses found.</p>`;
                }

            } catch (err) {
                console.error('Error loading user info:', err);
                // Optionally show a notification or error message
            }
        });

        
        // Place this script after your HTML or inside your main <script> block

        async function updateUserProfile() {
            // Collect values from edit fields
            const firstName = document.getElementById('editFirstName').value.trim();
            const lastName = document.getElementById('editLastName').value.trim();
            const email = document.getElementById('editEmail').value.trim();
            const phone = document.getElementById('editPhone').value.trim();

            // Combine first and last name
            const name = `${firstName} ${lastName}`.trim();

            // Prepare FormData for multipart/form-data
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);

            //store the file globally when selected
            if (window.selectedProfileImageFile) {
                formData.append('image', window.selectedProfileImageFile);
            }

            try {
                const response = await fetch('/account/updateProfile', {
                    method: 'PUT',
                    body: formData
                });

                if (response.ok) {
                    showNotification('Profile updated successfully!', 'success');
                    // Optionally, refresh user info
                    // setTimeout(() => window.location.reload(), 1200);
                } else {
                    showNotification('Failed to update profile.', 'error');
                }
            } catch (err) {
                showNotification('An error occurred. Please try again.', 'error');
            }
        }

        // --- Hook up the save button ---
        document.getElementById('savePersonalBtn').addEventListener('click', async (e) => {
            e.preventDefault();
            await updateUserProfile();
        });

        // --- If you use avatar click to select image, store the file globally ---
        document.getElementById('profileAvatar').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    window.selectedProfileImageFile = file; // Store globally for updateUserProfile
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        document.getElementById('profileAvatar').src = e.target.result;
                        showNotification('Profile picture updated!', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });