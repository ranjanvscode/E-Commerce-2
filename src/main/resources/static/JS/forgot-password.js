 // Dark mode functionality
        const darkModeToggle = document.getElementById('darkModeToggle');
        const html = document.documentElement;
        
        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            html.classList.add('dark');
        }

        darkModeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            const theme = html.classList.contains('dark') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });

        // Form elements
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        const otpVerificationForm = document.getElementById('otpVerificationForm');
        const successMessage = document.getElementById('successMessage');
        const emailForm = document.getElementById('emailForm');
        const otpForm = document.getElementById('otpForm');
        const emailInput = document.getElementById('email');
        const otpInputs = document.querySelectorAll('.otp-input');
        const headerDescription = document.getElementById('headerDescription');
        const sentToEmail = document.getElementById('sentToEmail');

        // Progress indicators
        const step1Circle = document.getElementById('step1Circle');
        const step1Text = document.getElementById('step1Text');
        const step2Circle = document.getElementById('step2Circle');
        const step2Text = document.getElementById('step2Text');
        const progressBar = document.getElementById('progressBar');

        // Buttons
        const sendCodeBtn = document.getElementById('sendCodeBtn');
        const verifyCodeBtn = document.getElementById('verifyCodeBtn');
        const resendCodeBtn = document.getElementById('resendCodeBtn');
        const backToEmailBtn = document.getElementById('backToEmailBtn');
        const continueBtn = document.getElementById('continueBtn');

        // Error elements
        const emailError = document.getElementById('emailError');
        const otpError = document.getElementById('otpError');

        // Timer elements
        const resendTimer = document.getElementById('resendTimer');
        const timerCount = document.getElementById('timerCount');

        let resendCountdown;

        // Email validation
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        // Show loading state
        function showLoading(button, textElement, spinnerElement) {
            button.disabled = true;
            textElement.classList.add('hidden');
            spinnerElement.classList.remove('hidden');
        }

        // Hide loading state
        function hideLoading(button, textElement, spinnerElement) {
            button.disabled = false;
            textElement.classList.remove('hidden');
            spinnerElement.classList.add('hidden');
        }

        // Update progress
        function updateProgress(step) {
            if (step === 2) {
                // Update step 1 to completed
                step1Circle.classList.remove('bg-blue-600');
                step1Circle.classList.add('bg-green-600');
                step1Circle.innerHTML = '✓';
                step1Text.classList.remove('text-blue-600', 'dark:text-blue-400');
                step1Text.classList.add('text-green-600', 'dark:text-green-400');

                // Update step 2 to active
                step2Circle.classList.remove('bg-gray-300', 'dark:bg-gray-600', 'text-gray-500', 'dark:text-gray-400');
                step2Circle.classList.add('bg-blue-600', 'text-white');
                step2Text.classList.remove('text-gray-500', 'dark:text-gray-400');
                step2Text.classList.add('text-blue-600', 'dark:text-blue-400');

                // Update progress bar
                progressBar.style.width = '100%';
            }
        }

        // Reset progress
        function resetProgress() {
            // Reset step 1
            step1Circle.classList.remove('bg-green-600');
            step1Circle.classList.add('bg-blue-600');
            step1Circle.innerHTML = '1';
            step1Text.classList.remove('text-green-600', 'dark:text-green-400');
            step1Text.classList.add('text-blue-600', 'dark:text-blue-400');

            // Reset step 2
            step2Circle.classList.remove('bg-blue-600', 'text-white');
            step2Circle.classList.add('bg-gray-300', 'dark:bg-gray-600', 'text-gray-500', 'dark:text-gray-400');
            step2Text.classList.remove('text-blue-600', 'dark:text-blue-400');
            step2Text.classList.add('text-gray-500', 'dark:text-gray-400');

            // Reset progress bar
            progressBar.style.width = '0%';
        }

        // Start resend timer
        function startResendTimer() {
            let timeLeft = 60;
            resendCodeBtn.disabled = true;
            resendTimer.classList.remove('hidden');
            
            resendCountdown = setInterval(() => {
                timeLeft--;
                timerCount.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(resendCountdown);
                    resendCodeBtn.disabled = false;
                    resendTimer.classList.add('hidden');
                }
            }, 1000);
        }
    
        // Handle email form submission
        emailForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            await sendOtpToEmail(email);
        });

        //Send OTP to email function-copilot
        async function sendOtpToEmail(email) {
            // Clear previous errors
            emailError.classList.add('hidden');
            emailInput.classList.remove('border-red-500');

            // Validate email
            if (!email) {
                emailError.textContent = 'Email address is required';
                emailError.classList.remove('hidden');
                emailInput.classList.add('border-red-500');
                return false;
            }
            if (!validateEmail(email)) {
                emailError.textContent = 'Please enter a valid email address';
                emailError.classList.remove('hidden');
                emailInput.classList.add('border-red-500');
                return false;
            }

            // Show loading
            showLoading(sendCodeBtn, document.getElementById('sendCodeText'), document.getElementById('sendCodeSpinner'));

            try {
                const response = await fetch('/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await response.json();

                hideLoading(sendCodeBtn, document.getElementById('sendCodeText'), document.getElementById('sendCodeSpinner'));

                if (response.ok && data.success) {
                    sentToEmail.textContent = email;
                    headerDescription.textContent = 'Enter the 6-digit code we sent to your email';
                    forgotPasswordForm.classList.add('hidden');
                    otpVerificationForm.classList.remove('hidden');
                    otpVerificationForm.classList.add('animate-slide-in');
                    updateProgress(2);
                    otpInputs[0].focus();
                    startResendTimer();
                    return true;
                } else {
                    emailError.textContent = data.message || 'Failed to send verification code. Please try again.';
                    emailError.classList.remove('hidden');
                    emailInput.classList.add('border-red-500');
                    return false;
                }
            } catch (err) {
                hideLoading(sendCodeBtn, document.getElementById('sendCodeText'), document.getElementById('sendCodeSpinner'));
                emailError.textContent = 'Server error. Please try again later.EEE';
                emailError.classList.remove('hidden');
                emailInput.classList.add('border-red-500');
                return false;
            }
        }//Otp close-2


        // Handle OTP input
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                
                // Only allow numbers
                if (!/^\d*$/.test(value)) {
                    e.target.value = '';
                    return;
                }
                
                // Move to next input
                if (value && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
                
                // Clear error when user starts typing
                otpError.classList.add('hidden');
                otpInputs.forEach(inp => inp.classList.remove('border-red-500'));
            });
            
            input.addEventListener('keydown', (e) => {
                // Move to previous input on backspace
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
            
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
                
                for (let i = 0; i < Math.min(pastedData.length, otpInputs.length - index); i++) {
                    otpInputs[index + i].value = pastedData[i];
                }
                
                // Focus next empty input or last input
                const nextEmptyIndex = Array.from(otpInputs).findIndex((inp, i) => i > index && !inp.value);
                if (nextEmptyIndex !== -1) {
                    otpInputs[nextEmptyIndex].focus();
                } else {
                    otpInputs[otpInputs.length - 1].focus();
                }
            });
        });

        // Handle OTP form submission
        otpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const otpValue = Array.from(otpInputs).map(input => input.value).join('');

            // Clear previous errors
            otpError.classList.add('hidden');
            otpInputs.forEach(input => input.classList.remove('border-red-500'));

            // Validate OTP
            if (otpValue.length !== 6) {
                otpError.textContent = 'Please enter the complete 6-digit code';
                otpError.classList.remove('hidden');
                otpInputs.forEach(input => {
                    if (!input.value) input.classList.add('border-red-500');
                });
                return;
            }

            // Show loading
            showLoading(verifyCodeBtn, document.getElementById('verifyCodeText'), document.getElementById('verifyCodeSpinner'));

            // Call backend to verify OTP
            try {
                const email = sentToEmail.textContent || emailInput.value.trim();
                const response = await fetch('/auth/verify-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp: otpValue })
                });
                const data = await response.json();

                hideLoading(verifyCodeBtn, document.getElementById('verifyCodeText'), document.getElementById('verifyCodeSpinner'));

                if (response.ok && data.success) {
                    // Success
                    otpVerificationForm.classList.add('hidden');
                    successMessage.classList.remove('hidden');
                    successMessage.classList.add('animate-fade-in');

                    // Clear timer
                    if (resendCountdown) {
                        clearInterval(resendCountdown);
                    }
                } else {
                    // Error
                    otpError.textContent = data.message || 'Invalid verification code. Please try again.';
                    otpError.classList.remove('hidden');
                    otpInputs.forEach(input => input.classList.add('border-red-500'));

                    // Clear inputs and focus first
                    otpInputs.forEach(input => input.value = '');
                    otpInputs[0].focus();
                }
            } catch (err) {
                hideLoading(verifyCodeBtn, document.getElementById('verifyCodeText'), document.getElementById('verifyCodeSpinner'));
                otpError.textContent = 'Server error. Please try again later.';
                otpError.classList.remove('hidden');
                otpInputs.forEach(input => input.classList.add('border-red-500'));
            }
        });

        resendCodeBtn.addEventListener('click', async () => {
            if (resendCodeBtn.disabled) return;
            const email = sentToEmail.textContent || emailInput.value.trim();

            // Show loading state on button
            const originalText = resendCodeBtn.textContent;
            resendCodeBtn.textContent = 'Sending...';
            resendCodeBtn.disabled = true;

            const success = await sendOtpToEmail(email);

            if (success) {
                resendCodeBtn.textContent = 'Code Sent!';
                // Only start timer if resend was successful
                startResendTimer();
                setTimeout(() => {
                    resendCodeBtn.textContent = originalText;
                }, 2000);
            } else {
                resendCodeBtn.textContent = originalText;
                resendCodeBtn.disabled = false;
            }
        });

        // Handle back to email
        backToEmailBtn.addEventListener('click', () => {
            // Clear OTP inputs
            otpInputs.forEach(input => {
                input.value = '';
                input.classList.remove('border-red-500');
            });
            
            // Clear errors
            otpError.classList.add('hidden');
            
            // Clear timer
            if (resendCountdown) {
                clearInterval(resendCountdown);
            }
            resendTimer.classList.add('hidden');
            
            // Switch back to email form
            otpVerificationForm.classList.add('hidden');
            forgotPasswordForm.classList.remove('hidden');
            
            // Reset progress
            resetProgress();
            
            // Update header
            headerDescription.textContent = 'Enter your email address and we\'ll send you a verification code';
            
            // Focus email input
            emailInput.focus();
        });

        // Handle continue button - UPDATE THIS SECTION
        continueBtn.addEventListener('click', () => {
            // Switch to new password form
            successMessage.classList.add('hidden');
            newPasswordForm.classList.remove('hidden');
            newPasswordForm.classList.add('animate-fade-in');
            
            // Update header
            headerDescription.textContent = 'Create a strong password for your account';
            
            // Focus new password input
            newPasswordInput.focus();
        });

        // Add new form elements
        const newPasswordForm = document.getElementById('newPasswordForm');
        const passwordForm = document.getElementById('passwordForm');
        const finalSuccessMessage = document.getElementById('finalSuccessMessage');
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const resetPasswordBtn = document.getElementById('resetPasswordBtn');
        const signInBtn = document.getElementById('signInBtn');
        const backToHomeBtn = document.getElementById('backToHomeBtn');

        // Password requirement elements
        const reqLength = document.getElementById('req-length');
        const reqUppercase = document.getElementById('req-uppercase');
        const reqLowercase = document.getElementById('req-lowercase');
        const reqNumber = document.getElementById('req-number');
        const reqSpecial = document.getElementById('req-special');

        // Error elements
        const newPasswordError = document.getElementById('newPasswordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');

        // Password validation functions
        function validatePassword(password) {
            const requirements = {
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /\d/.test(password),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
            };
            
            return requirements;
        }

        function updatePasswordRequirements(password) {
            const requirements = validatePassword(password);
            
            // Update requirement indicators
            updateRequirement(reqLength, requirements.length);
            updateRequirement(reqUppercase, requirements.uppercase);
            updateRequirement(reqLowercase, requirements.lowercase);
            updateRequirement(reqNumber, requirements.number);
            updateRequirement(reqSpecial, requirements.special);
            
            return Object.values(requirements).every(req => req);
        }

        function updateRequirement(element, isValid) {
            const icon = element.querySelector('svg');
            const text = element;
            
            if (isValid) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>';
                icon.classList.remove('text-gray-400');
                icon.classList.add('text-green-500');
                text.classList.remove('text-gray-600', 'dark:text-gray-400');
                text.classList.add('text-green-600', 'dark:text-green-400');
            } else {
                icon.innerHTML = '<circle cx="12" cy="12" r="10"></circle>';
                icon.classList.remove('text-green-500');
                icon.classList.add('text-gray-400');
                text.classList.remove('text-green-600', 'dark:text-green-400');
                text.classList.add('text-gray-600', 'dark:text-gray-400');
            }
        }

        // Password toggle functionality
        function setupPasswordToggle(toggleBtn, passwordInput, eyeIcon, eyeOffIcon) {
            toggleBtn.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                if (type === 'text') {
                    eyeIcon.classList.add('hidden');
                    eyeOffIcon.classList.remove('hidden');
                } else {
                    eyeIcon.classList.remove('hidden');
                    eyeOffIcon.classList.add('hidden');
                }
            });
        }

        // Setup password toggles
        setupPasswordToggle(
            document.getElementById('toggleNewPassword'),
            newPasswordInput,
            document.getElementById('eyeIconNew'),
            document.getElementById('eyeOffIconNew')
        );

        setupPasswordToggle(
            document.getElementById('toggleConfirmPassword'),
            confirmPasswordInput,
            document.getElementById('eyeIconConfirm'),
            document.getElementById('eyeOffIconConfirm')
        );

        // Password input validation
        newPasswordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            updatePasswordRequirements(password);
            
            // Clear errors
            newPasswordError.classList.add('hidden');
            newPasswordInput.classList.remove('border-red-500');
            
            // Check confirm password match if it has value
            if (confirmPasswordInput.value) {
                if (password !== confirmPasswordInput.value) {
                    confirmPasswordError.textContent = 'Passwords do not match';
                    confirmPasswordError.classList.remove('hidden');
                    confirmPasswordInput.classList.add('border-red-500');
                } else {
                    confirmPasswordError.classList.add('hidden');
                    confirmPasswordInput.classList.remove('border-red-500');
                }
            }
        });

        confirmPasswordInput.addEventListener('input', (e) => {
            const confirmPassword = e.target.value;
            const password = newPasswordInput.value;
            
            // Clear errors
            confirmPasswordError.classList.add('hidden');
            confirmPasswordInput.classList.remove('border-red-500');
            
            // Check password match
            if (confirmPassword && password !== confirmPassword) {
                confirmPasswordError.textContent = 'Passwords do not match';
                confirmPasswordError.classList.remove('hidden');
                confirmPasswordInput.classList.add('border-red-500');
            }
        });   
    
    
        // Handle password form submission
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const email = sentToEmail.textContent || emailInput.value.trim();

            // Clear previous errors
            newPasswordError.classList.add('hidden');
            confirmPasswordError.classList.add('hidden');
            newPasswordInput.classList.remove('border-red-500');
            confirmPasswordInput.classList.remove('border-red-500');
            
            let hasErrors = false;
            
            // Validate new password
            if (!newPassword) {
                newPasswordError.textContent = 'New password is required';
                newPasswordError.classList.remove('hidden');
                newPasswordInput.classList.add('border-red-500');
                hasErrors = true;
            } else if (!updatePasswordRequirements(newPassword)) {
                newPasswordError.textContent = 'Password does not meet requirements';
                newPasswordError.classList.remove('hidden');
                newPasswordInput.classList.add('border-red-500');
                hasErrors = true;
            }
            
            // Validate confirm password
            if (!confirmPassword) {
                confirmPasswordError.textContent = 'Please confirm your password';
                confirmPasswordError.classList.remove('hidden');
                confirmPasswordInput.classList.add('border-red-500');
                hasErrors = true;
            } else if (newPassword !== confirmPassword) {
                confirmPasswordError.textContent = 'Passwords do not match';
                confirmPasswordError.classList.remove('hidden');
                confirmPasswordInput.classList.add('border-red-500');
                hasErrors = true;
            }
            
            if (hasErrors) return;
            
            // Show loading
            showLoading(resetPasswordBtn, document.getElementById('resetPasswordText'), document.getElementById('resetPasswordSpinner'));
            
            try {
                const response = await fetch('/auth/save-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password: newPassword })
                });
                const data = await response.json();

                hideLoading(resetPasswordBtn, document.getElementById('resetPasswordText'), document.getElementById('resetPasswordSpinner'));

                if (response.ok && data.success) {
                    // Show final success message
                    newPasswordForm.classList.add('hidden');
                    finalSuccessMessage.classList.remove('hidden');
                    finalSuccessMessage.classList.add('animate-fade-in');
                    // Update header
                    headerDescription.textContent = 'Your password has been successfully reset';
                } else {
                    newPasswordError.textContent = data.message || 'Failed to reset password. Please try again.';
                    newPasswordError.classList.remove('hidden');
                    newPasswordInput.classList.add('border-red-500'); 
                }
            } catch (err) {
                hideLoading(resetPasswordBtn, document.getElementById('resetPasswordText'), document.getElementById('resetPasswordSpinner'));
                newPasswordError.textContent = 'Server error. Please try again later.';
                newPasswordError.classList.remove('hidden');
                newPasswordInput.classList.add('border-red-500');
            }
        });

        // // Handle sign in button
        // signInBtn.addEventListener('click', () => {
        //     // In a real application, this would redirect to sign in page
        //     alert('Redirecting to sign in page...');
        // });

        // // Handle back to home button
        // backToHomeBtn.addEventListener('click', () => {
        //     // In a real application, this would redirect to home page
        //     alert('Redirecting to home page...');
        // });

        // Initialize focus
        emailInput.focus();