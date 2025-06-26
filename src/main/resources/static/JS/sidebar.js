// Get elements
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const hamburgerIcon = document.getElementById('hamburgerIcon');
        const closeIcon = document.getElementById('closeIcon');

        let isSidebarOpen = false;

        // Toggle sidebar function
        function toggleSidebar() {
            isSidebarOpen = !isSidebarOpen;
            
            if (isSidebarOpen) {
                // Open sidebar
                sidebar.classList.remove('-translate-x-full');
                sidebar.classList.add('translate-x-0');
                overlay.classList.remove('hidden');
                hamburgerIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            } else {
                // Close sidebar
                sidebar.classList.remove('translate-x-0');
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
                hamburgerIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
                document.body.style.overflow = ''; // Restore scrolling
            }
        }

        // Event listeners
        menuToggle.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', toggleSidebar);

        // Close sidebar when clicking on navigation links
        const navLinks = sidebar.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                //e.preventDefault(); // Remove this in production
                toggleSidebar(); // Close sidebar after clicking a link
                
                // Add active state
                navLinks.forEach(l => l.classList.remove('bg-blue-50', 'text-blue-600'));
                this.classList.add('bg-blue-50', 'text-blue-600');
            });
        });

        // Handle escape key to close sidebar
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isSidebarOpen) {
                toggleSidebar();
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (isSidebarOpen) {
                toggleSidebar(); // Close sidebar on resize
            }
        });