/* ═══════════════════════════════════════════════════════════════
   CivicFix AI Assistant – Bilingual Smart City Conversational Chatbot
   Project: CivicFix AI
   Tagline: "Report it. Fix it. Prove it."
   Supported Languages: ONLY English & Tamil (தமிழ்)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Bilingual Localization Dictionary ──
  const I18N = {
    en: {
      botName: 'CivicFix AI Assistant',
      tagline: '“Report it. Fix it. Prove it.”',
      bannerStatus: 'AI Grievance Engine Online · Bilingual 24/7',
      inputPlaceholder: 'Type in English, Tamil, or Tanglish...',
      sendBtn: 'Send ✈️',
      skipPhoto: '⏭️ Skip Photo',
      uploadPhoto: '📸 Upload Photo / Evidence',
      detectLocation: '📍 Auto-Detect My Location',
      locating: 'Acquiring GPS fix...',
      confirmSubmit: '✅ Confirm & Submit',
      editDetails: '✏️ Edit Details',
      cancelReport: '❌ Cancel',
      trackInPortal: '🔍 Track in Grievance Portal',
      reportAnother: '➕ Report Another Issue',
      copyId: '📋 Copy ID',
      copied: 'Copied!',
      greeting: "👋 Hello! I am your <b>CivicFix AI Assistant</b>.<br><br>My mission is <i>“Report it. Fix it. Prove it.”</i> — helping citizens report urban civic issues, ensuring rapid assignment to municipal engineers, and tracking verifiable proof of resolution.<br><br><b>What civic problem would you like to report today?</b>",
      askLocation: "I can help you report this <b>{category}</b> issue. What is the <b>exact location or landmark</b>?",
      askTime: "Location noted: <b>{location}</b> 📍<br><br><b>When did you first notice this problem?</b>",
      askSeverity: "Recorded! <b>How severe is this problem?</b> Please select the impact level:",
      askPhoto: "Do you have a <b>photo or evidence</b> of this issue? Photos help civic crews verify and resolve grievances 3x faster.",
      reviewSummary: "Please review your <b>Complaint Summary</b> below. Shall I submit and dispatch this to municipal authorities?",
      submittedSuccess: "🎉 <b>Complaint Registered Successfully!</b><br>Your issue has been auto-triaged and dispatched to the field crew.",
      cancelledMsg: "Complaint reporting cancelled. How else can I assist you with city services today?",
      restartMsg: "Sure! What new problem would you like to report?",
      departments: {
        roads: 'Department of Highways & Pavements (Zone 4)',
        garbage: 'Solid Waste Management & Sanitation Wing',
        drainage: 'Metro Water & Stormwater Drainage Board',
        streetlight: 'Municipal Electrical & Lighting Division',
        water: 'Metro Water Supply & Sewerage Board',
        traffic: 'Smart Traffic Enforcement & Mobility Wing',
        toilets: 'Public Health & Sanitation Directorate',
        other: 'Central Ward Rapid Grievance Cell'
      },
      categories: {
        roads: 'Potholes / Damaged Roads',
        garbage: 'Garbage Accumulation',
        drainage: 'Drainage & Sewage Overflow',
        streetlight: 'Streetlight & Lamp Breakdown',
        water: 'Water Supply & Pipeline Leakage',
        traffic: 'Traffic & Parking Obstruction',
        toilets: 'Public Toilet Maintenance',
        other: 'Other Smart City Grievance'
      },
      timeOptions: ['Today', '2-3 Days Ago', 'Over a Week', 'Recurring Problem'],
      severityOptions: [
        { key: 'low', label: '🟢 Low — Minor inconvenience' },
        { key: 'medium', label: '🟡 Medium — Disrupting local area' },
        { key: 'high', label: '🟠 High — Serious hazard / hardship' },
        { key: 'critical', label: '🔴 Critical — Emergency public safety risk' }
      ]
    },
    ta: {
      botName: 'CivicFix AI உதவி மையம்',
      tagline: '“புகார் செய்யுங்கள். சரிசெய்யுங்கள். நிரூபியுங்கள்.”',
      bannerStatus: 'AI குடிமக்கள் உதவி மையம் · 24/7 நேரடி சேவை',
      inputPlaceholder: 'உங்கள் புகாரை தமிழில் அல்லது Tanglish-ல் எழுதவும்...',
      sendBtn: 'அனுப்பு ✈️',
      skipPhoto: '⏭️ புகைப்படம் தேவையில்லை',
      uploadPhoto: '📸 புகைப்படம் / சான்று பதிவேற்று',
      detectLocation: '📍 என் இருப்பிடத்தை கண்டறி',
      locating: 'GPS மூலம் இருப்பிடத்தை பெறுகிறது...',
      confirmSubmit: '✅ உறுதிசெய்து சமர்ப்பி',
      editDetails: '✏️ விவரங்களை மாற்று',
      cancelReport: '❌ ரத்து செய்',
      trackInPortal: '🔍 புகார் நிலையை காண்க',
      reportAnother: '➕ மற்றொரு புகார் பதிவு செய்க',
      copyId: '📋 எண்ணை நகலெடு',
      copied: 'நகலெடுக்கப்பட்டது!',
      greeting: "👋 வணக்கம்! நான் உங்கள் <b>CivicFix AI Assistant</b>.<br><br>எங்கள் நோக்கம்: <i>“புகார் செய்யுங்கள். சரிசெய்யுங்கள். நிரூபியுங்கள்.”</i> — உங்கள் பகுதியிலுள்ள பொதுப் பிரச்சினைகளை பதிவு செய்து, மாநகராட்சி பொறியாளர்கள் மூலம் விரைந்து தீர்வு காண உதவுகிறேன்.<br><br><b>இன்று நீங்கள் என்ன பிரச்சினை தெரிவிக்க விரும்புகிறீர்கள்?</b>",
      askLocation: "நான் உங்கள் <b>{category}</b> புகாரை பதிவு செய்ய உதவுகிறேன். அந்த இடத்தின் <b>சரியான முகவரி அல்லது landmark</b> என்ன?",
      askTime: "இடம் பதிவு செய்யப்பட்டது: <b>{location}</b> 📍<br><br><b>இந்த பிரச்சினையை நீங்கள் எப்போது கவனித்தீர்கள்?</b>",
      askSeverity: "பதிவு செய்யப்பட்டது! <b>இதன் தீவிரத்தன்மை எவ்வளவு?</b> தாக்க நிலையை தேர்வு செய்யவும்:",
      askPhoto: "இந்த பிரச்சினைக்கான <b>புகைப்படம் அல்லது சான்று</b> உள்ளதா? புகைப்பட சான்று இருந்தால் அதிகாரிகள் 3 மடங்கு விரைவாக சரிசெய்வார்கள்.",
      reviewSummary: "கீழே உள்ள உங்கள் <b>புகார் விவர சுருக்கத்தை</b> சரிபார்க்கவும். மாநகராட்சி அதிகாரிகளுக்கு இதை அனுப்பி வைக்கலாமா?",
      submittedSuccess: "🎉 <b>புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது!</b><br>AI மூலம் வகைப்படுத்தப்பட்டு சம்பந்தப்பட்ட வார்டு அதிகாரியிடம் ஒப்படைக்கப்பட்டுள்ளது.",
      cancelledMsg: "புகார் பதிவு ரத்து செய்யப்பட்டது. உங்களுக்கு வேறு ஏதேனும் மாநகராட்சி சேவை விவரங்கள் தேவையா?",
      restartMsg: "நிச்சயமாக! நீங்கள் தெரிவிக்க விரும்பும் புதிய பிரச்சினை என்ன?",
      departments: {
        roads: 'நெடுஞ்சாலை மற்றும் சாலைகள் பராமரிப்பு துறை',
        garbage: 'திடக்கழிவு மேலாண்மை மற்றும் தூய்மை பணி பிரிவு',
        drainage: 'குடிநீர் வடிகால் மற்றும் கழிவுநீர் வாரியம்',
        streetlight: 'மாநகராட்சி மின் துறை & தெருவிளக்கு பிரிவு',
        water: 'குடிநீர் வழங்கல் & பராமரிப்பு வாரியம்',
        traffic: 'போக்குவரத்து & ஸ்மார்ட் மொபிலிட்டி பிரிவு',
        toilets: 'பொது சுகாதார மற்றும் கழிப்பறை பராமரிப்பு பிரிவு',
        other: 'மத்திய வார்டு அவசர புகார் பிரிவு'
      },
      categories: {
        roads: 'குண்டும் குழியுமான சாலைகள்',
        garbage: 'குப்பை தேக்கம்',
        drainage: 'சாக்கடை / வடிகால் அடைப்பு',
        streetlight: 'தெருவிளக்கு பிரச்சனை',
        water: 'குடிநீர் விநியோக பிரச்சனை',
        traffic: 'போக்குவரத்து & பார்க்கிங் பிரச்சனை',
        toilets: 'பொதுக் கழிப்பறை பராமரிப்பு',
        other: 'பிற ஸ்மார்ட் சிட்டி பிரச்சனைகள்'
      },
      timeOptions: ['இன்று', '2-3 நாட்களுக்கு முன்', 'ஒரு வாரத்திற்கும் மேலாக', 'தொடர் பிரச்சனை'],
      severityOptions: [
        { key: 'low', label: '🟢 குறைவு — சாதாரணமானது' },
        { key: 'medium', label: '🟡 நடுத்தரம் — உள்ளூர் இடையூறு' },
        { key: 'high', label: '🟠 அதிகம் — தீவிர பாதிப்பு' },
        { key: 'critical', label: '🔴 மிக அதிகம் — உடனடி பாதுகாப்பு ஆபத்து' }
      ]
    }
  };

  // ── Problem NLU Classifier (English, Tamil script, and Tanglish) ──
  const CATEGORY_RULES = [
    {
      key: 'roads',
      regex: /pothole|crater|damaged?\s*road|broken\s*road|road\s*crack|tar|asphalt|bump|pit|kuzhi|pallam|salai|road.*sari.*illa|road.*damage|road.*broke|குழி|பள்ளம்|சாலை|ரோடு|தார்\s*சாலை/i
    },
    {
      key: 'garbage',
      regex: /garbage|trash|waste|dump|bin|litter|smell|stink|kuppai|kuppa|kuppai.*kottu|kuppai.*edukala|clean.*panla|waste.*accumulat|dumper|debris|குப்பை|கழிவு|துர்நாற்றம்|அழுக்கு/i
    },
    {
      key: 'drainage',
      regex: /drain|drainage|sewer|sewage|gutter|overflow|clog|stagnant|waterlog|saakadai|sakadai|vadi\s*kaal|drainage.*block|water.*block|manhole|வடிகால்|சாக்கடை|கழிவுநீர்|நீர்\s*தேக்கம்/i
    },
    {
      key: 'streetlight',
      regex: /light|lamp|streetlight|dark|pole|bulb|street.*light|eriyala|eriyavillai|theru\s*vilakku|light.*off|no\s*light|blackout|vilakku|தெருவிளக்கு|மின்விளக்கு|விளக்கு|வெளிச்சம்\s*இல்லை/i
    },
    {
      key: 'water',
      regex: /water|drinking\s*water|water\s*supply|pipe|burst|leak|leakage|pressure|tannir|thanni|thanni.*varala|pipe.*odanju|kudineer|water.*cut|குடிநீர்|தண்ணீர்|குழாய்\s*உடைப்பு|நீர்\s*இல்லை/i
    },
    {
      key: 'traffic',
      regex: /traffic|parking|jam|congestion|signal|vehicle|obstruction|bus|auto|vandi.*park|park.*panranga|no.*parking|pokkuvarathu|நெரிசல்|போக்குவரத்து|பார்க்கிங்|சிக்னல்/i
    },
    {
      key: 'toilets',
      regex: /toilet|restroom|urinal|lavatory|washroom|public\s*toilet|cleanliness|sanitation|kazhivarai|toilet.*clean.*illa|toilet.*bad|கழிப்பறை|பொதுக்\s*கழிப்பறை|கழிவறை/i
    }
  ];

  // ── Chatbot State Controller ──
  class CivicFixBot {
    constructor() {
      this.currentLang = 'en'; // STRICTLY 'en' or 'ta'
      this.stage = 'ASK_PROBLEM'; // ASK_PROBLEM, ASK_LOCATION, ASK_TIME, ASK_SEVERITY, ASK_PHOTO, CONFIRM, SUBMITTED
      this.complaint = {
        categoryKey: null,
        categoryName: '',
        description: '',
        location: '',
        timeNoticed: '',
        severity: 'medium',
        photoData: null,
        department: '',
        complaintId: null,
        timestamp: null
      };

      this.initDOMElements();
      this.bindEvents();
      this.renderWelcome();
    }

    initDOMElements() {
      // Find or build dialogue container
      this.dialog = document.getElementById('civicfix-dialog') || document.getElementById('copilot-dialog');
      this.fab = document.getElementById('civicfix-fab') || document.getElementById('copilot-fab');
      this.closeBtn = document.getElementById('civicfix-close') || document.getElementById('copilot-close');
      this.expandBtn = document.getElementById('civicfix-expand');
      this.body = document.getElementById('civicfix-chat') || document.getElementById('cop-chat');
      this.chipsContainer = document.getElementById('civicfix-chips') || document.getElementById('cop-suggest');
      this.input = document.getElementById('civicfix-input') || document.getElementById('cop-input');
      this.sendBtn = document.getElementById('civicfix-send') || document.getElementById('cop-send');
      this.langEnBtn = document.getElementById('civicfix-lang-en');
      this.langTaBtn = document.getElementById('civicfix-lang-ta');
      this.titleEl = document.getElementById('civicfix-title') || document.getElementById('copilot-title');
      this.taglineEl = document.getElementById('civicfix-tagline');
      this.bannerEl = document.getElementById('civicfix-banner-text');

      // Hidden file input for photo upload
      this.fileInput = document.getElementById('civicfix-file-input');
      if (!this.fileInput) {
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.id = 'civicfix-file-input';
        this.fileInput.accept = 'image/*';
        this.fileInput.style.display = 'none';
        document.body.appendChild(this.fileInput);
      }

      this.previewBox = document.getElementById('civicfix-attach-preview');
    }

    bindEvents() {
      // FAB open
      if (this.fab) {
        this.fab.onclick = () => {
          this.playAudio('click');
          this.open();
        };
      }

      // External Launch Buttons (e.g. from CivicAI page)
      document.querySelectorAll('#btn-launch-copilot, .launch-civicfix-btn').forEach(btn => {
        btn.onclick = () => {
          this.playAudio('click');
          this.open();
        };
      });

      // Close
      if (this.closeBtn) {
        this.closeBtn.onclick = () => this.close();
      }

      // Expand toggle
      if (this.expandBtn) {
        this.expandBtn.onclick = () => {
          this.dialog.classList.toggle('is-expanded');
          this.expandBtn.textContent = this.dialog.classList.contains('is-expanded') ? '⤓' : '⛶';
        };
      }

      // Language Switcher: English
      if (this.langEnBtn) {
        this.langEnBtn.onclick = () => this.setLanguage('en');
      }

      // Language Switcher: Tamil
      if (this.langTaBtn) {
        this.langTaBtn.onclick = () => this.setLanguage('ta');
      }

      // Send Button
      if (this.sendBtn) {
        this.sendBtn.onclick = () => this.handleUserSubmit();
      }

      // Input Enter
      if (this.input) {
        this.input.onkeydown = (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleUserSubmit();
          }
        };
      }

      // Photo file input handler
      if (this.fileInput) {
        this.fileInput.onchange = (e) => {
          const file = e.target.files && e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (re) => {
              this.complaint.photoData = re.target.result;
              this.renderPhotoSelected(file.name);
            };
            reader.readAsDataURL(file);
          }
        };
      }
    }

    open() {
      if (this.dialog) {
        if (typeof this.dialog.showModal === 'function' && !this.dialog.open) {
          this.dialog.showModal();
        } else {
          this.dialog.setAttribute('open', '');
          this.dialog.style.display = 'flex';
        }
        if (this.input) this.input.focus();
        this.scrollToBottom();
      }
    }

    close() {
      if (this.dialog) {
        if (typeof this.dialog.close === 'function') {
          this.dialog.close();
        } else {
          this.dialog.removeAttribute('open');
          this.dialog.style.display = 'none';
        }
      }
    }

    playAudio(type) {
      if (window.Sound && typeof window.Sound.play === 'function') {
        try { window.Sound.play(type); } catch (e) {}
      }
    }

    setLanguage(lang) {
      if (lang !== 'en' && lang !== 'ta') return;
      this.currentLang = lang;

      // Update button styles
      if (this.langEnBtn && this.langTaBtn) {
        this.langEnBtn.classList.toggle('active', lang === 'en');
        this.langTaBtn.classList.toggle('active', lang === 'ta');
      }

      // Update header & inputs
      const dict = I18N[this.currentLang];
      if (this.titleEl) this.titleEl.textContent = dict.botName;
      if (this.taglineEl) this.taglineEl.textContent = dict.tagline;
      if (this.bannerEl) this.bannerEl.textContent = dict.bannerStatus;
      if (this.input) this.input.placeholder = dict.inputPlaceholder;
      if (this.sendBtn) this.sendBtn.textContent = dict.sendBtn;

      this.playAudio('click');

      // Refresh current step prompt chips to the selected language
      this.renderChipsForCurrentStage();
    }

    renderWelcome() {
      if (!this.body) return;
      this.body.innerHTML = '';
      const dict = I18N[this.currentLang];
      this.addMessage(dict.greeting, 'bot');
      this.renderChipsForCurrentStage();
    }

    renderChipsForCurrentStage() {
      if (!this.chipsContainer) return;
      this.chipsContainer.innerHTML = '';
      const dict = I18N[this.currentLang];

      if (this.stage === 'ASK_PROBLEM') {
        const catKeys = ['roads', 'garbage', 'drainage', 'streetlight', 'water', 'traffic', 'toilets', 'other'];
        const icons = {
          roads: '🕳️',
          garbage: '🗑️',
          drainage: '🚰',
          streetlight: '💡',
          water: '💧',
          traffic: '🚦',
          toilets: '🚻',
          other: '🏙️'
        };

        catKeys.forEach(k => {
          this.createChip(`${icons[k]} ${dict.categories[k]}`, () => {
            this.handleUserTextSelection(dict.categories[k]);
          });
        });
      } else if (this.stage === 'ASK_LOCATION') {
        // Location auto-detect chip
        this.createChip(`📍 ${dict.detectLocation}`, () => {
          this.detectUserGPS();
        }, true);
      } else if (this.stage === 'ASK_TIME') {
        dict.timeOptions.forEach(opt => {
          this.createChip(`⏱️ ${opt}`, () => {
            this.handleUserTextSelection(opt);
          });
        });
      } else if (this.stage === 'ASK_SEVERITY') {
        dict.severityOptions.forEach(sev => {
          this.createChip(sev.label, () => {
            this.handleUserTextSelection(sev.label, sev.key);
          });
        });
      } else if (this.stage === 'ASK_PHOTO') {
        this.createChip(`📸 ${dict.uploadPhoto}`, () => {
          if (this.fileInput) this.fileInput.click();
        }, true);

        this.createChip(`⏭️ ${dict.skipPhoto}`, () => {
          this.handleUserTextSelection(dict.skipPhoto);
        });
      } else if (this.stage === 'CONFIRM') {
        this.createChip(`✅ ${dict.confirmSubmit}`, () => {
          this.submitComplaint();
        }, true);

        this.createChip(`✏️ ${dict.editDetails}`, () => {
          this.restartForm();
        });

        this.createChip(`❌ ${dict.cancelReport}`, () => {
          this.cancelComplaint();
        });
      } else if (this.stage === 'SUBMITTED') {
        this.createChip(`🔍 ${dict.trackInPortal}`, () => {
          this.close();
          window.location.hash = `#/track?id=${this.complaint.complaintId}`;
        }, true);

        this.createChip(`➕ ${dict.reportAnother}`, () => {
          this.restartForm();
        });
      }
    }

    createChip(label, onClick, isPrimary = false) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'civicfix-chip' + (isPrimary ? ' civicfix-chip--primary' : '');
      chip.innerHTML = label;
      chip.onclick = () => {
        this.playAudio('click');
        onClick();
      };
      this.chipsContainer.appendChild(chip);
    }

    addMessage(htmlContent, sender = 'bot', meta = null) {
      const msg = document.createElement('div');
      msg.className = `civicfix-msg ${sender}`;

      const avatar = document.createElement('div');
      avatar.className = 'civicfix-msg__avatar';
      avatar.innerHTML = sender === 'bot' ? '🤖' : '👤';

      const content = document.createElement('div');
      content.className = 'civicfix-msg__content';

      const bubble = document.createElement('div');
      bubble.className = 'civicfix-bubble';
      bubble.innerHTML = htmlContent;

      content.appendChild(bubble);

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const metaEl = document.createElement('div');
      metaEl.className = 'civicfix-msg__meta';
      metaEl.textContent = meta || (sender === 'bot' ? `${I18N[this.currentLang].botName} · ${timeStr}` : timeStr);
      content.appendChild(metaEl);

      msg.appendChild(avatar);
      msg.appendChild(content);

      this.body.appendChild(msg);
      this.scrollToBottom();
    }

    showTypingIndicator() {
      const typingEl = document.createElement('div');
      typingEl.className = 'civicfix-msg bot civicfix-typing-msg';
      typingEl.id = 'civicfix-typing-indicator';
      typingEl.innerHTML = `
        <div class="civicfix-msg__avatar">🤖</div>
        <div class="civicfix-msg__content">
          <div class="civicfix-bubble civicfix-typing">
            <span class="civicfix-typing__dot"></span>
            <span class="civicfix-typing__dot"></span>
            <span class="civicfix-typing__dot"></span>
          </div>
        </div>
      `;
      this.body.appendChild(typingEl);
      this.scrollToBottom();
    }

    hideTypingIndicator() {
      const el = document.getElementById('civicfix-typing-indicator');
      if (el) el.remove();
    }

    scrollToBottom() {
      if (this.body) {
        this.body.scrollTop = this.body.scrollHeight;
      }
    }

    // ── Input Submission Processing ──
    async handleUserSubmit() {
      if (!this.input) return;
      const text = this.input.value.trim();
      if (!text) return;

      this.input.value = '';
      this.handleUserTextSelection(text);
    }

    async handleUserTextSelection(userText, explicitKey = null) {
      this.addMessage(userText, 'user');
      this.showTypingIndicator();

      // Check with backend AI API first (secure proxy endpoint)
      const aiResponse = await this.queryBackendAI(userText);

      this.hideTypingIndicator();

      if (aiResponse && aiResponse.handled) {
        this.addMessage(aiResponse.reply, 'bot');
        if (aiResponse.nextStage) {
          this.stage = aiResponse.nextStage;
        }
        this.renderChipsForCurrentStage();
        return;
      }

      // Step-by-step CivicFix Natural Language & Dialog Flow Engine
      this.advanceDialogFlow(userText, explicitKey);
    }

    // ── Dialog State Machine Engine ──
    advanceDialogFlow(userText, explicitKey = null) {
      const dict = I18N[this.currentLang];

      if (this.stage === 'ASK_PROBLEM') {
        // Detect category from English, Tamil script, or Tanglish
        let matchedCategory = explicitKey || null;

        if (!matchedCategory) {
          for (const rule of CATEGORY_RULES) {
            if (rule.regex.test(userText)) {
              matchedCategory = rule.key;
              break;
            }
          }
        }

        if (!matchedCategory) {
          matchedCategory = 'other';
        }

        this.complaint.categoryKey = matchedCategory;
        this.complaint.categoryName = dict.categories[matchedCategory];
        this.complaint.description = userText;
        this.complaint.department = dict.departments[matchedCategory];

        // Transition to Step 2: ASK_LOCATION
        this.stage = 'ASK_LOCATION';
        const reply = dict.askLocation.replace('{category}', this.complaint.categoryName);
        this.addMessage(reply, 'bot');
        this.renderChipsForCurrentStage();
        this.playAudio('click');
        return;
      }

      if (this.stage === 'ASK_LOCATION') {
        this.complaint.location = userText;

        // Transition to Step 3: ASK_TIME
        this.stage = 'ASK_TIME';
        const reply = dict.askTime.replace('{location}', this.complaint.location);
        this.addMessage(reply, 'bot');
        this.renderChipsForCurrentStage();
        this.playAudio('click');
        return;
      }

      if (this.stage === 'ASK_TIME') {
        this.complaint.timeNoticed = userText;

        // Transition to Step 4: ASK_SEVERITY
        this.stage = 'ASK_SEVERITY';
        this.addMessage(dict.askSeverity, 'bot');
        this.renderChipsForCurrentStage();
        this.playAudio('click');
        return;
      }

      if (this.stage === 'ASK_SEVERITY') {
        let sev = 'medium';
        const lower = userText.toLowerCase();
        if (lower.includes('critical') || lower.includes('அவசர') || lower.includes('emergency') || lower.includes('மிக அதிகம்')) {
          sev = 'critical';
        } else if (lower.includes('high') || lower.includes('அதிக') || lower.includes('severe')) {
          sev = 'high';
        } else if (lower.includes('low') || lower.includes('குறைவு') || lower.includes('minor')) {
          sev = 'low';
        }

        this.complaint.severity = sev;

        // Transition to Step 5: ASK_PHOTO
        this.stage = 'ASK_PHOTO';
        this.addMessage(dict.askPhoto, 'bot');
        this.renderChipsForCurrentStage();
        this.playAudio('click');
        return;
      }

      if (this.stage === 'ASK_PHOTO') {
        // Skipped or noted photo
        this.stage = 'CONFIRM';
        this.renderSummaryCard();
        return;
      }

      if (this.stage === 'CONFIRM') {
        const lower = userText.toLowerCase();
        if (lower.includes('confirm') || lower.includes('submit') || lower.includes('உறுதி') || lower.includes('yes') || lower.includes('ஆம்')) {
          this.submitComplaint();
        } else if (lower.includes('edit') || lower.includes('மாற்று')) {
          this.restartForm();
        } else {
          this.cancelComplaint();
        }
        return;
      }

      // Default or General Inquiries
      this.handleGeneralCivicInquiry(userText);
    }

    detectUserGPS() {
      const dict = I18N[this.currentLang];
      this.addMessage(dict.locating, 'bot');

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude.toFixed(4);
            const lng = pos.coords.longitude.toFixed(4);
            const mockAddress = `GPS (${lat}, ${lng}) · Anna Salai Main Road, Ward 114`;
            this.handleUserTextSelection(mockAddress);
          },
          () => {
            const fallback = `Gandhi Road, Zone 5 (Near Central Hospital)`;
            this.handleUserTextSelection(fallback);
          },
          { timeout: 5000 }
        );
      } else {
        this.handleUserTextSelection('Kamarajar Salai, Ward 88');
      }
    }

    renderPhotoSelected(fileName) {
      const dict = I18N[this.currentLang];
      const thumb = this.complaint.photoData
        ? `<div style="margin-top:6px"><img src="${this.complaint.photoData}" style="width:120px;height:80px;object-fit:cover;border-radius:8px;border:1px solid #1d6fe8" alt="Evidence"></div>`
        : '';

      this.addMessage(`📸 <b>${fileName}</b> ${this.currentLang === 'ta' ? 'சான்றாக இணைக்கப்பட்டது' : 'attached as visual evidence'}.${thumb}`, 'user');
      this.stage = 'CONFIRM';
      this.renderSummaryCard();
    }

    renderSummaryCard() {
      const dict = I18N[this.currentLang];
      const c = this.complaint;
      const isTa = this.currentLang === 'ta';

      const sevBadge = `<span class="civicfix-badge civicfix-badge--${c.severity}">${c.severity.toUpperCase()}</span>`;
      const photoHtml = c.photoData
        ? `<img src="${c.photoData}" style="width:70px;height:50px;object-fit:cover;border-radius:6px" alt="Evidence">`
        : (isTa ? 'இணைக்கப்படவில்லை' : 'None provided');

      const cardHtml = `
        <div class="civicfix-card">
          <div class="civicfix-card__title">
            <span>📋</span> ${isTa ? 'புகார் சுருக்கம் & சரிபார்ப்பு' : 'Complaint Summary & Triage'}
          </div>
          <div class="civicfix-card__row">
            <span class="civicfix-card__label">${isTa ? 'வகை' : 'Category'}</span>
            <span class="civicfix-card__value">${c.categoryName}</span>
          </div>
          <div class="civicfix-card__row">
            <span class="civicfix-card__label">${isTa ? 'விவரம்' : 'Problem'}</span>
            <span class="civicfix-card__value" style="max-width:220px">${c.description}</span>
          </div>
          <div class="civicfix-card__row">
            <span class="civicfix-card__label">${isTa ? 'இடம்' : 'Location'}</span>
            <span class="civicfix-card__value">${c.location}</span>
          </div>
          <div class="civicfix-card__row">
            <span class="civicfix-card__label">${isTa ? 'கவனித்த நேரம்' : 'Noticed'}</span>
            <span class="civicfix-card__value">${c.timeNoticed}</span>
          </div>
          <div class="civicfix-card__row">
            <span class="civicfix-card__label">${isTa ? 'தீவிரத்தன்மை' : 'Severity'}</span>
            <span class="civicfix-card__value">${sevBadge}</span>
          </div>
          <div class="civicfix-card__row">
            <span class="civicfix-card__label">${isTa ? 'ஒதுக்கப்பட்ட துறை' : 'Assigned Dept'}</span>
            <span class="civicfix-card__value" style="font-size:0.75rem">${c.department}</span>
          </div>
          <div class="civicfix-card__row">
            <span class="civicfix-card__label">${isTa ? 'சான்று' : 'Photo'}</span>
            <span class="civicfix-card__value">${photoHtml}</span>
          </div>
        </div>
        <p style="margin:10px 0 0;font-size:0.85rem">
          ${dict.reviewSummary}
        </p>
      `;

      this.addMessage(cardHtml, 'bot');
      this.renderChipsForCurrentStage();
      this.playAudio('click');
    }

    submitComplaint() {
      const isTa = this.currentLang === 'ta';
      const dict = I18N[this.currentLang];

      // Generate Unique Complaint ID
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const complaintId = `CF-2026-${randomDigits}`;
      this.complaint.complaintId = complaintId;
      this.complaint.timestamp = new Date().toISOString();

      // Save to window.Store / localStorage for cross-app synchronization
      this.persistComplaint();

      // Render Docket & Live Timeline
      const docketHtml = `
        <div class="civicfix-docket">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <span style="font-size:0.75rem;font-weight:700;color:#2fbf71;text-transform:uppercase;letter-spacing:0.04em">
              ● ${isTa ? 'பதிவு செய்யப்பட்டது · நேரடி நிலை' : 'Registered · Live Status'}
            </span>
            <span style="font-size:0.75rem;color:#1d6fe8;font-weight:600">CivicFix AI</span>
          </div>

          <div class="civicfix-docket__id-box">
            <div>
              <div style="font-size:0.68rem;color:#6b8ba3;text-transform:uppercase;font-weight:600">
                ${isTa ? 'புகார் அடையாள எண்' : 'Official Complaint ID'}
              </div>
              <div class="civicfix-docket__id" id="docket-id-val">${complaintId}</div>
            </div>
            <button class="civicfix-chip" id="btn-copy-docket-id" style="margin:0;padding:4px 10px;font-size:0.72rem">
              ${dict.copyId}
            </button>
          </div>

          <div style="font-size:0.78rem;color:#0a2236;line-height:1.5;margin-bottom:8px">
            <b>${isTa ? 'பொறுப்பான அதிகாரி' : 'Assigned Team'}:</b> ${this.complaint.department}<br>
            <b>${isTa ? 'எதிர்பார்க்கப்படும் தீர்வு' : 'Target SLA'}:</b> ${isTa ? '24 - 48 மணி நேரம்' : '24 - 48 Hours'}
          </div>

          <div class="civicfix-timeline">
            <div class="civicfix-timeline__item done">
              <span>${isTa ? '1. புகார் பெறப்பட்டு AI வகைப்படுத்தப்பட்டது' : '1. Reported & AI Triaged'}</span>
              <span style="font-size:0.7rem;color:#2fbf71">${isTa ? 'முடிந்தது' : 'Done'}</span>
            </div>
            <div class="civicfix-timeline__item current">
              <span>${isTa ? '2. வார்டு களப்பணியாளருக்கு அனுப்பப்பட்டது' : '2. Dispatched to Field Crew'}</span>
              <span style="font-size:0.7rem;color:#1d6fe8">${isTa ? 'நடப்பில்' : 'Active'}</span>
            </div>
            <div class="civicfix-timeline__item">
              <span>${isTa ? '3. பழுது நீக்கும் பணி தொடக்கம்' : '3. Work In Progress'}</span>
              <span>—</span>
            </div>
            <div class="civicfix-timeline__item">
              <span>${isTa ? '4. புகைப்படம் மூலம் நிரூபிக்கப்பட்டு நிறைவு' : '4. Prove It: Resolution Verified'}</span>
              <span>—</span>
            </div>
          </div>
        </div>

        <p style="margin:12px 0 0;font-size:0.8rem;color:#1d6fe8;font-weight:600;text-align:center">
          ${dict.tagline}
        </p>
      `;

      this.addMessage(docketHtml, 'bot');
      this.stage = 'SUBMITTED';
      this.renderChipsForCurrentStage();
      this.playAudio('award');

      // Bind copy button
      setTimeout(() => {
        const copyBtn = document.getElementById('btn-copy-docket-id');
        if (copyBtn) {
          copyBtn.onclick = () => {
            navigator.clipboard.writeText(complaintId).then(() => {
              copyBtn.textContent = `✓ ${dict.copied}`;
              setTimeout(() => { copyBtn.textContent = dict.copyId; }, 2000);
            });
          };
        }
      }, 100);
    }

    persistComplaint() {
      try {
        const c = this.complaint;
        const entry = {
          id: c.complaintId,
          cat: c.categoryName,
          category: c.categoryName,
          desc: c.description,
          location: c.location,
          zone: 'Zone 4',
          step: 1,
          status: 'Assigned',
          severity: c.severity,
          department: c.department,
          time: new Date().toISOString(),
          photo: c.photoData || null
        };

        // If window.store is available
        if (window.store && window.store.complaints) {
          window.store.complaints[c.complaintId] = entry;
        }

        // Save in localStorage
        const stored = JSON.parse(localStorage.getItem('civic_complaints') || '[]');
        stored.unshift(entry);
        localStorage.setItem('civic_complaints', JSON.stringify(stored));

        // Toast notification if available
        if (typeof window.toast === 'function') {
          window.toast('success', `CivicFix: ${c.complaintId}`, `${c.categoryName} registered successfully!`);
        }
      } catch (e) {
        console.warn('Could not persist complaint to localStorage:', e);
      }
    }

    restartForm() {
      this.stage = 'ASK_PROBLEM';
      this.complaint = {
        categoryKey: null,
        categoryName: '',
        description: '',
        location: '',
        timeNoticed: '',
        severity: 'medium',
        photoData: null,
        department: '',
        complaintId: null,
        timestamp: null
      };
      this.addMessage(I18N[this.currentLang].restartMsg, 'bot');
      this.renderChipsForCurrentStage();
    }

    cancelComplaint() {
      this.stage = 'ASK_PROBLEM';
      this.addMessage(I18N[this.currentLang].cancelledMsg, 'bot');
      this.renderChipsForCurrentStage();
    }

    handleGeneralCivicInquiry(text) {
      const isTa = this.currentLang === 'ta';
      const lower = text.toLowerCase();

      let reply = '';
      if (lower.includes('hospital') || lower.includes('மருத்துவமனை')) {
        reply = isTa
          ? `🏥 அவசர சிகிச்சை மையம்: <b>அரசு பொது மருத்துவமனை</b> (24/7 அவசர ஊர்தி எண்: 108). அருகில் உள்ள மருத்துவமனைகளை அறிய <a href="#/services">Smart Services</a> பக்கத்தை பார்க்கவும்.`
          : `🏥 Nearest Emergency Hospital: <b>City Multi-Speciality Hospital</b> (24/7 Emergency: Dial 108). View full directory under <a href="#/services">Smart Services</a>.`;
      } else if (lower.includes('track') || lower.includes('நிலை') || lower.includes('cf-') || lower.includes('cl-') || lower.includes('cc-')) {
        reply = isTa
          ? `🔍 உங்கள் புகாரை கண்காணிக்க <a href="#/track">Grievance Tracker</a> செல்லவும், அல்லது உங்கள் புகார் எண்ணை (எ.கா. CF-2026-4821) என்னிடம் பகிருங்கள்.`
          : `🔍 To track a complaint, please provide your complaint ID (e.g. CF-2026-4821) or visit the <a href="#/track">Grievance Tracker</a>.`;
      } else {
        reply = isTa
          ? `நான் உங்களுக்கு உதவ தயாராக உள்ளேன்! குண்டும் குழியுமான சாலைகள், தெருவிளக்குகள், குடிநீர் மற்றும் குப்பை பிரச்சினைகளை பதிவு செய்ய கீழேயுள்ள பட்டன்களை பயன்படுத்தவும்.`
          : `I can help you report urban civic issues, track progress, or check municipal service hours. Use the quick buttons below or describe any city problem!`;
      }

      this.addMessage(reply, 'bot');
      this.renderChipsForCurrentStage();
    }

    // ── Secure Backend AI API Request ──
    async queryBackendAI(message) {
      try {
        const payload = {
          message: message,
          language: this.currentLang,
          stage: this.stage,
          complaint: {
            category: this.complaint.categoryName,
            location: this.complaint.location,
            severity: this.complaint.severity
          }
        };

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.reply) {
            return {
              handled: true,
              reply: data.reply,
              nextStage: data.nextStage || null
            };
          }
        }
      } catch (err) {
        // Silent graceful fallback to local NLU engine
      }
      return null;
    }
  }

  // ── Auto-Initialization on DOM Ready ──
  function initCivicFix() {
    window.CivicFixAssistant = new CivicFixBot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCivicFix);
  } else {
    initCivicFix();
  }
})();
