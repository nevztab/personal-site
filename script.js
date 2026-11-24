/**
 * Nevzat Ulaş | Kişisel CV & Portfolyo
 * Codrya Marka Standartları Uyumlu Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Typewriter Animation Effect
    const typewriterElement = document.getElementById('typewriter');
    const words = [
        'Codrya Kurucusu',
        'Yazılım Geliştirici',
        'Siber Güvenlik Analisti',
        'EsCyberSec Başkan Yardımcısı',
        'Backend Geliştirici'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 95;

    function type() {
        if (!typewriterElement) return;

        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 90;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 450;
        }

        setTimeout(type, typeSpeed);
    }
    type();

    // 2. Navbar Scroll Style
    const nav = document.querySelector('nav.codrya-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 4. Scroll Reveal Animations (Intersection Observer)
    const reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        reveals.forEach(el => revealObserver.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('active'));
    }

    // 5. Contact Form Handler (İletişim Formu - FormSubmit AJAX Entegrasyonu)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalHtml = submitBtn.innerHTML;

            const nameInput = contactForm.querySelector('input[name="name"]');
            const emailInput = contactForm.querySelector('input[name="email"]');
            const subjectInput = contactForm.querySelector('input[name="subject"]');
            const messageInput = contactForm.querySelector('textarea[name="message"]');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const subject = subjectInput ? subjectInput.value.trim() : 'Genel İletişim';
            const message = messageInput ? messageInput.value.trim() : '';

            // Loading durumu
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';

            try {
                const response = await fetch('https://formsubmit.co/ajax/nevzat@codrya.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        _subject: `[Kişisel Site] ${subject} - ${name}`,
                        message: message,
                        _template: 'table',
                        _captcha: 'false'
                    })
                });

                const data = await response.json();

                if (response.ok || data.success === 'true' || data.success === true) {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Mesajınız Başarıyla İletildi!';
                    submitBtn.style.background = '#28a745';
                    submitBtn.style.borderColor = '#28a745';
                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalHtml;
                        submitBtn.style.background = '';
                        submitBtn.style.borderColor = '';
                    }, 4000);
                } else {
                    throw new Error(data.message || 'Gönderim başarısız.');
                }
            } catch (err) {
                console.error('İletişim formu gönderim hatası:', err);
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Hata Oluştu, Tekrar Deneyin';
                submitBtn.style.background = '#dc3545';
                submitBtn.style.borderColor = '#dc3545';

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHtml;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                }, 4000);
            }
        });
    }
});
