// --- DYNAMIC CONTENT RENDERING FROM SUPABASE ---

// !!! IMPORTANT: Replace with your actual Supabase details !!!
const SUPABASE_URL = 'https://hzduwqstaowpllqmuwrc.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZHV3cXN0YW93cGxscW11d3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NjM4NDgsImV4cCI6MjA3NDIzOTg0OH0.V0QQ_au79MtQ7T6p6uDn_c2xkMrIt2L5QwqF_InN9eM'; 

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', function() {
    
    // --- SUPABASE TABLE NAMES (Must match Admin Panel) ---
    const IMAGE_TABLE = 'crypticLegionImages';
    const VIDEO_TABLE = 'crypticLegionVideos';
    const TESTIMONIAL_TABLE = 'crypticLegionTestimonials';

    // Helper function to fetch data from Supabase
    const fetchSupabaseData = async (tableName) => {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            console.error(`Error fetching ${tableName}:`, error);
            return [];
        }
        return data;
    };

    // Function to render header images
    const renderHeaderImages = async () => {
        const images = await fetchSupabaseData(IMAGE_TABLE);
        const slider = document.getElementById('slider');
        if (!slider) return;

        // Clear existing slider content
        slider.innerHTML = ''; 

        // 1. Recreate the 'slide' container for text
        const textSlide = document.createElement('div');
        textSlide.className = 'slide';
        textSlide.innerHTML = `
            <div class="container header-container">
                <div class="header-left scrool">
                    <h1>Where Passion Meets the Beautiful Game</h1>
                    <p>From grassroots to the grand stage, football unites us all.
                    Dive into stories, highlights, and insights that bring the game to life.
                    Every match, every moment, every heartbeat captured here</p>
                    <a href="IndexNews.html" class="btn">Join the Match</a>
                </div>
            </div>
        `;
        slider.appendChild(textSlide);

        // 2. Add dynamic images
        images.forEach((image, index) => {
            const img = document.createElement('img');
            img.src = image.src; // 'src' column holds the Supabase public URL
            img.alt = `Header Image ${index + 1}`;
            slider.appendChild(img);
        });

        // 3. Initialize Image Carousel
        const carouselImages = slider.querySelectorAll('img');
        if (carouselImages.length > 0) {
            let currentImageIndex = 0;
            // The image should be after the text slide, so we target index 0 of the images array
            carouselImages[currentImageIndex].classList.add('active');
            
            function showNextImage() {
                carouselImages[currentImageIndex].classList.remove('active');
                currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
                carouselImages[currentImageIndex].classList.add('active');
            }
            setInterval(showNextImage, 5000); // 5 seconds interval
        }
    };

    // Function to render videos (Highlights)
    const renderVideos = async () => {
        const videos = await fetchSupabaseData(VIDEO_TABLE);
        // Corrected selector to .team-container
        const videosContainer = document.querySelector('.team-container'); 
        if (!videosContainer || videos.length === 0) return;

        videosContainer.innerHTML = ''; // Clear existing videos

        videos.forEach(video => {
            const videoArticle = document.createElement('article');
            videoArticle.className = 'team-member'; 
            videoArticle.innerHTML = `
                <div class="team-member-video">
                    <video src="${video.src}" controls width="100%" height="200" loop></video>
                </div>
                <div class="team-member-info">
                    <h4></h4>
                    <p>${video.description}</p>
                </div>
            `;
            videosContainer.appendChild(videoArticle);
        });
    };

    // Function to render testimonials
    const renderTestimonials = async () => {
        const testimonials = await fetchSupabaseData(TESTIMONIAL_TABLE);
        const testimonialsContainer = document.querySelector('.mySwiper .swiper-wrapper');
        if (!testimonialsContainer || testimonials.length === 0) return;

        testimonialsContainer.innerHTML = ''; // Clear existing testimonials

        testimonials.forEach(testimonial => {
            const slide = document.createElement('article');
            slide.className = 'testimonial swiper-slide';
            slide.innerHTML = `
                <div class="avatar">
                    <img src="${testimonial.avatarSrc}" alt="">
                </div>
                <div class="testimonial-info">
                    <h5>${testimonial.name}</h5>
                    <small>${testimonial.role}</small>
                </div>
                <div class="testimonial-body">
                    <p>${testimonial.body}</p>
                </div>
            `;
            testimonialsContainer.appendChild(slide);
        });
        
        // Initialize Swiper after content is loaded
        initializeSwiper();
    };
    
    // Swiper Initialization
    const initializeSwiper = () => {
        new Swiper(".mySwiper", {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            grabCursor: true,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            autoplay: {
                delay: 7000,
                disableOnInteraction: false,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2, // 2 slides side by side on tablets
                },
                1024: {
                    slidesPerView: 3, // 3 slides side by side on desktops
                }
            }
        });
    }

    // Call the rendering functions on page load
    renderHeaderImages();
    renderVideos();
    renderTestimonials();


    //------------- NAV SCROLL ------------------//
    window.addEventListener('scroll', () => {
        document.querySelector('nav').classList.toggle
        ('window-scroll', window.scrollY > 0);
    })

    // Menu Bar Toggle
    const menu = document.querySelector(".nav-menu");
    const menuBtn = document.querySelector("#open-menu-btn");
    const closeBtn = document.querySelector("#close-menu-btn");

    menuBtn.addEventListener('click', () => {
        menu.style.display = "flex";
        closeBtn.style.display = "inline-block";
        menuBtn.style.display = "none";
    })

    const closeNav = () => {
        menu.style.display = "none";
        closeBtn.style.display = "none";
        menuBtn.style.display = "inline-block";
    }

    closeBtn.addEventListener('click', closeNav);

    // Scrool Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show');
            }
        });
    });

    const scroolElements = document.querySelectorAll('.scrool');
    scroolElements.forEach((el) => observer.observe(el));

    const vibeElements = document.querySelectorAll('.vibe');
    vibeElements.forEach((el) => observer.observe(el));

    const popElements = document.querySelectorAll('.pop');
    popElements.forEach((el) => observer.observe(el));

    // --- COUNT ANIMATIONS ---
    function startCounter(countId, plusId, target, interval) {
        const countElement = document.getElementById(countId);
        const plusElement = document.getElementById(plusId);

        if (!countElement) return;

        function animatePlusSign() {
            if (plusElement) {
                plusElement.style.opacity = "1";
                plusElement.style.transform = "scale(1)";
            }
        }

        let currentCount = 0;
        const counterInterval = setInterval(() => {
            currentCount++;
            countElement.textContent = currentCount;

            if (currentCount === target) {
                clearInterval(counterInterval);
                setTimeout(animatePlusSign, 500);
            }
        }, interval);
    }
    
    startCounter("count", "plus", 75, 75);
    startCounter("coun", "plu", 1000, 5.5);
    startCounter("cou", "pl", 25, 250);
});