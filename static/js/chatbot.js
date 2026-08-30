// Multi-Mode Floating AI Assistant Controller
(function() {
  var toggleBtn = document.getElementById('chatbot-toggle-btn');
  var closeBtn = document.getElementById('chatbot-close-btn');
  var clearBtn = document.getElementById('chatbot-clear-btn');
  var modal = document.getElementById('chatbot-modal');
  var form = document.getElementById('chatbot-form');
  var input = document.getElementById('chatbot-input');
  var messagesContainer = document.getElementById('chatbot-messages');
  var typingIndicator = document.getElementById('chatbot-typing');
  var typingLabel = document.getElementById('widget-typing-label');
  var chipsBar = document.getElementById('chatbot-starter-chips');
  var headerTitle = document.getElementById('chatbot-header-title');
  var modeButtons = document.querySelectorAll('.widget-mode-btn');

  var currentMode = 'advisor';
  var conversationHistories = {
    advisor: [],
    tutor: [],
    chat: []
  };

  var modeGreetings = {
    advisor: '👋 <strong>Campus Connect AI Advisor Active.</strong> Ask me about placement drives, eligibility criteria, or the PM Internship Scheme!',
    tutor: '💻 <strong>Technical Tutor Active.</strong> Ready to practice DSA problems, mock interviews, or explain CS concepts!',
    chat: '💬 <strong>AI Assistant Active.</strong> Ask me anything regarding programming, career paths, or general inquiries!'
  };

  if (!toggleBtn || !modal || !form) return;

  // Toggle open / close
  toggleBtn.addEventListener('click', function() {
    var isHidden = modal.getAttribute('aria-hidden') === 'true';
    if (isHidden) {
      openChatbot();
    } else {
      closeChatbot();
    }
  });

  closeBtn.addEventListener('click', closeChatbot);

  // Clear chat
  clearBtn.addEventListener('click', function() {
    conversationHistories[currentMode] = [];
    renderWidgetStream();
  });

  // Mode switching inside widget
  modeButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      modeButtons.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentMode = btn.getAttribute('data-mode') || 'advisor';
      
      if (headerTitle) {
        headerTitle.textContent = currentMode === 'tutor' ? 'AI Technical Tutor' : (currentMode === 'chat' ? 'AI Chat Assistant' : 'AI Career Advisor');
      }
      renderWidgetStream();
      input.focus();
    });
  });

  function openChatbot() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    toggleBtn.classList.add('active');
    setTimeout(function() { input.focus(); }, 150);
  }

  function closeChatbot() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    toggleBtn.classList.remove('active');
  }

  // Quick Chips
  if (chipsBar) {
    chipsBar.addEventListener('click', function(e) {
      var chip = e.target.closest('.chat-chip');
      if (chip) {
        var prompt = chip.getAttribute('data-prompt');
        if (prompt) {
          sendUserMessage(prompt);
        }
      }
    });
  }

  // Form submit
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    sendUserMessage(text);
  });

  function sendUserMessage(text) {
    var history = conversationHistories[currentMode];
    history.push({ role: 'user', content: text });
    appendMessage(text, 'user');

    typingIndicator.style.display = 'flex';
    if (typingLabel) {
      typingLabel.textContent = 'Gemini AI is analyzing...';
    }
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    var endpoint = '/api/ai/' + currentMode;

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      typingIndicator.style.display = 'none';
      if (data && data.response) {
        history.push({ role: 'model', content: data.response });
        appendMessage(data.response, 'bot');
      } else {
        appendMessage('I received an empty response. Please try again.', 'bot');
      }
    })
    .catch(function(err) {
      typingIndicator.style.display = 'none';
      console.error('Chat error:', err);
      appendMessage('Sorry, a connection issue occurred. Please try again.', 'bot');
    });
  }

  function renderWidgetStream() {
    messagesContainer.innerHTML = '';
    var welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'chat-msg chat-msg-bot';
    welcomeDiv.innerHTML = '<div class="chat-msg-bubble">' + modeGreetings[currentMode] + '</div><div class="chat-msg-time">Just now</div>';
    messagesContainer.appendChild(welcomeDiv);

    var history = conversationHistories[currentMode];
    history.forEach(function(m) {
      appendMessage(m.content, m.role === 'user' ? 'user' : 'bot');
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function appendMessage(content, sender) {
    var msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg chat-msg-' + sender;

    var bubble = document.createElement('div');
    bubble.className = 'chat-msg-bubble';

    if (sender === 'bot') {
      bubble.innerHTML = formatMarkdown(content);
    } else {
      bubble.textContent = content;
    }

    var timeDiv = document.createElement('div');
    timeDiv.className = 'chat-msg-time';
    var now = new Date();
    timeDiv.textContent = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    msgDiv.appendChild(bubble);
    msgDiv.appendChild(timeDiv);
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function formatMarkdown(text) {
    if (!text) return '';
    var html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="code-block-wrap"><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Bullet points
    html = html.replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    return html;
  }
})();
