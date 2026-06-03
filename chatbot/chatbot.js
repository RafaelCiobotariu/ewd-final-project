const questionBank = [
  {
    question: "What technologies do you use?",
    answer:
      "I primarily work with HTML5, CSS3 (including Grid and Flexbox), JavaScript (ES2022), React 18, Node.js, and Git. I'm currently learning TypeScript, Next.js, and PostgreSQL.",
  },
  {
    question: "Tell me about your projects",
    answer:
      "I've built several projects including WeatherNow (a weather dashboard using REST APIs), TaskBoard (a Kanban board with React), and a ReadMe Generator CLI tool. Check out my Projects page for full details!",
  },
  {
    question: "What's your experience level?",
    answer:
      "I'm a junior front-end developer and a 2nd-year Computer Science student at UVT Timișoara. I have experience from a 3-month internship at TechStart and freelance work for local businesses and NGOs.",
  },
  {
    question: "How can I contact you?",
    answer:
      "You can reach me via email at rafael.ciobotariu@example.com or check out my GitHub at github.com/RafaelCiobotariu. Feel free to use the Contact page on this site as well!",
  },
  {
    question: "What are you learning now?",
    answer:
      "Right now I'm focusing on TypeScript for better type safety, Next.js for server-side rendering and routing, and PostgreSQL for backend database work. I'm also deepening my knowledge of web accessibility (WCAG 2.1).",
  },
  {
    question: "Do you do freelance work?",
    answer:
      "Yes! I've done freelance projects including landing pages, accessibility improvements, and small web applications. I'm open to taking on new projects that align with my skills.",
  },
  {
    question: "What's your favorite tech stack?",
    answer:
      "I really enjoy working with React for the frontend, Node.js for the backend, and CSS Grid/Flexbox for layouts. I love the component-based architecture and the flexibility these tools provide.",
  },
  {
    question: "How did you learn web development?",
    answer:
      "I started learning HTML and CSS in high school, then expanded to JavaScript and React through online courses, university modules, and hands-on projects. I believe in learning by building real things!",
  },
];

const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const quickQuestionsContainer = document.getElementById(
  "quick-questions-container",
);

function initializeChatbot() {
  renderQuickQuestions();
}

function renderQuickQuestions() {
  quickQuestionsContainer.innerHTML = "";

  const quickQuestions = questionBank.slice(0, 4);

  quickQuestions.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quick-question-btn";
    button.textContent = item.question;
    button.setAttribute("aria-label", `Ask: ${item.question}`);

    button.addEventListener("click", () => {
      handleQuickQuestion(item.question);
    });

    quickQuestionsContainer.appendChild(button);
  });
}

function handleQuickQuestion(question) {
  addMessage(question, "user");

  const answer = findAnswer(question);
  setTimeout(() => {
    addMessage(answer, "bot");
  }, 500);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const userQuestion = userInput.value.trim();

  if (userQuestion === "") {
    return;
  }

  addMessage(userQuestion, "user");

  userInput.value = "";

  const answer = findAnswer(userQuestion);
  setTimeout(() => {
    addMessage(answer, "bot");
  }, 500);
});

function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}-message`;

  const avatarDiv = document.createElement("div");
  avatarDiv.className = "message-avatar";
  avatarDiv.textContent = sender === "bot" ? "🤖" : "👤";

  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";

  const paragraph = document.createElement("p");
  paragraph.textContent = text;

  contentDiv.appendChild(paragraph);
  messageDiv.appendChild(avatarDiv);
  messageDiv.appendChild(contentDiv);

  chatMessages.appendChild(messageDiv);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function findAnswer(userQuestion) {
  const lowerQuestion = userQuestion.toLowerCase();

  for (const item of questionBank) {
    if (lowerQuestion === item.question.toLowerCase()) {
      return item.answer;
    }
  }

  if (
    lowerQuestion.includes("technology") ||
    lowerQuestion.includes("tech") ||
    lowerQuestion.includes("stack") ||
    lowerQuestion.includes("use")
  ) {
    return questionBank[0].answer;
  }

  if (lowerQuestion.includes("project")) {
    return questionBank[1].answer;
  }

  if (
    lowerQuestion.includes("experience") ||
    lowerQuestion.includes("background") ||
    lowerQuestion.includes("about you")
  ) {
    return questionBank[2].answer;
  }

  if (
    lowerQuestion.includes("contact") ||
    lowerQuestion.includes("email") ||
    lowerQuestion.includes("reach")
  ) {
    return questionBank[3].answer;
  }

  if (
    lowerQuestion.includes("learning") ||
    lowerQuestion.includes("studying")
  ) {
    return questionBank[4].answer;
  }

  if (
    lowerQuestion.includes("freelance") ||
    lowerQuestion.includes("hire") ||
    lowerQuestion.includes("available")
  ) {
    return questionBank[5].answer;
  }

  if (lowerQuestion.includes("favorite") || lowerQuestion.includes("prefer")) {
    return questionBank[6].answer;
  }

  if (lowerQuestion.includes("learn") || lowerQuestion.includes("start")) {
    return questionBank[7].answer;
  }

  return "That's an interesting question! I don't have a specific answer for that yet, but feel free to check out the About page or Projects page for more information. You can also reach out via the Contact page!";
}

initializeChatbot();
