const $ = (id) => document.getElementById(id);

const educationContainer = $("educationContainer");
const projectsContainer = $("projectsContainer");
const experienceContainer = $("experienceContainer");
const certificationsContainer = $("certificationsContainer");

const DRAFT_KEY = "resumeCraftDraft";

function safeText(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

function safeLink(url) {
  if (!url) return "#";

  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
}

function createRemoveButton(card) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "remove-btn";
  button.textContent = "Remove";

  button.addEventListener("click", () => {
    card.remove();
    updatePreview();
  });

  return button;
}

function addInputListeners(card) {
  card.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", updatePreview);
  });
}

/* ---------------- EDUCATION ---------------- */

function addEducation(data = {}) {
  const card = document.createElement("div");
  card.className = "dynamic-card education-card";

  card.innerHTML = `
    <div class="grid">
      <label class="full">
        Degree / Course
        <input type="text" class="edu-degree" placeholder="Example: B.Tech – Computer Science & Information Technology" value="${safeText(data.degree || "")}" />
      </label>

      <label class="full">
        College / School Name
        <input type="text" class="edu-institute" placeholder="Enter institute or school name" value="${safeText(data.institute || "")}" />
      </label>

      <label>
        Duration / Year
        <input type="text" class="edu-duration" placeholder="Example: 2024 – 2028" value="${safeText(data.duration || "")}" />
      </label>

      <label>
        CGPA / Percentage / Details
        <input type="text" class="edu-score" placeholder="Example: CGPA: 8.82 / 10" value="${safeText(data.score || "")}" />
      </label>
    </div>
  `;

  card.prepend(createRemoveButton(card));
  educationContainer.appendChild(card);
  addInputListeners(card);
}

/* ---------------- PROJECTS ---------------- */

function addProject(data = {}) {
  const card = document.createElement("div");
  card.className = "dynamic-card project-card";

  card.innerHTML = `
    <div class="grid">
      <label>
        Project Name
        <input type="text" class="project-name" placeholder="Enter project name" value="${safeText(data.name || "")}" />
      </label>

      <label>
        Technologies Used
        <input type="text" class="project-tech" placeholder="Example: HTML, CSS, JavaScript" value="${safeText(data.tech || "")}" />
      </label>

      <label>
        GitHub Link
        <input type="url" class="project-github" placeholder="https://github.com/username/project" value="${safeText(data.github || "")}" />
      </label>

      <label>
        Live Demo Link
        <input type="url" class="project-live" placeholder="https://your-project.netlify.app" value="${safeText(data.live || "")}" />
      </label>

      <label class="full">
        Project Description
        <textarea class="project-description" rows="3" placeholder="Describe what the project does, features, and your contribution...">${safeText(data.description || "")}</textarea>
      </label>
    </div>
  `;

  card.prepend(createRemoveButton(card));
  projectsContainer.appendChild(card);
  addInputListeners(card);
}

/* ---------------- EXPERIENCE ---------------- */

function addExperience(data = {}) {
  const card = document.createElement("div");
  card.className = "dynamic-card experience-card";

  card.innerHTML = `
    <div class="grid">
      <label>
        Role
        <input type="text" class="exp-role" placeholder="Example: Web Development Intern" value="${safeText(data.role || "")}" />
      </label>

      <label>
        Company / Organization
        <input type="text" class="exp-company" placeholder="Enter organization name" value="${safeText(data.company || "")}" />
      </label>

      <label>
        Duration
        <input type="text" class="exp-duration" placeholder="Example: December-2025" value="${safeText(data.duration || "")}" />
      </label>

      <label>
        Certificate Link (Optional)
        <input type="url" class="exp-certificate" placeholder="https://certificate-link.com" value="${safeText(data.certificate || "")}" />
      </label>

      <label class="full">
        Description
        <textarea class="exp-description" rows="3" placeholder="Describe your responsibilities, work, and impact...">${safeText(data.description || "")}</textarea>
      </label>
    </div>
  `;

  card.prepend(createRemoveButton(card));
  experienceContainer.appendChild(card);
  addInputListeners(card);
}

/* ---------------- CERTIFICATIONS ---------------- */

function addCertification(data = {}) {
  const card = document.createElement("div");
  card.className = "dynamic-card certification-card";

  card.innerHTML = `
    <div class="grid">
      <label>
        Certificate / Achievement Name
        <input type="text" class="cert-name" placeholder="Enter certificate or achievement name" value="${safeText(data.name || "")}" />
      </label>

      <label>
        Issuing Organization
        <input type="text" class="cert-org" placeholder="Example: AWS Academy" value="${safeText(data.organization || "")}" />
      </label>

      <label>
        Certificate Link (Optional)
        <input type="url" class="cert-link" placeholder="https://credential-link.com" value="${safeText(data.link || "")}" />
      </label>

      <label class="full">
        Description / Details
        <textarea class="cert-details" rows="2" placeholder="Briefly mention what you learned or achieved...">${safeText(data.details || "")}</textarea>
      </label>
    </div>
  `;

  card.prepend(createRemoveButton(card));
  certificationsContainer.appendChild(card);
  addInputListeners(card);
}

/* ---------------- GET FORM DATA ---------------- */

function getFormData() {
  return {
    personal: {
      fullName: $("fullName").value,
      jobTitle: $("jobTitle").value,
      phone: $("phone").value,
      email: $("email").value,
      linkedin: $("linkedin").value,
      github: $("github").value,
      leetcode: $("leetcode").value,
      objective: $("objective").value,
      languages: $("languages").value,
      webTech: $("webTech").value,
      database: $("database").value,
      tools: $("tools").value,
      coreConcepts: $("coreConcepts").value,
      softSkills: $("softSkills").value
    },

    education: [...document.querySelectorAll(".education-card")].map((card) => ({
      degree: card.querySelector(".edu-degree").value,
      institute: card.querySelector(".edu-institute").value,
      duration: card.querySelector(".edu-duration").value,
      score: card.querySelector(".edu-score").value
    })),

    projects: [...document.querySelectorAll(".project-card")].map((card) => ({
      name: card.querySelector(".project-name").value,
      tech: card.querySelector(".project-tech").value,
      github: card.querySelector(".project-github").value,
      live: card.querySelector(".project-live").value,
      description: card.querySelector(".project-description").value
    })),

    experience: [...document.querySelectorAll(".experience-card")].map((card) => ({
      role: card.querySelector(".exp-role").value,
      company: card.querySelector(".exp-company").value,
      duration: card.querySelector(".exp-duration").value,
      certificate: card.querySelector(".exp-certificate").value,
      description: card.querySelector(".exp-description").value
    })),

    certifications: [...document.querySelectorAll(".certification-card")].map((card) => ({
      name: card.querySelector(".cert-name").value,
      organization: card.querySelector(".cert-org").value,
      link: card.querySelector(".cert-link").value,
      details: card.querySelector(".cert-details").value
    })),

    sectionOrder: [...document.querySelectorAll(".draggable-section")].map(
      (section) => section.dataset.section
    )
  };
}

/* ---------------- SAVE / LOAD DRAFT ---------------- */

function saveDraft() {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(getFormData()));

  const button = $("saveDraftBtn");
  const originalText = button.textContent;

  button.textContent = "Draft Saved ✓";

  setTimeout(() => {
    button.textContent = originalText;
  }, 1600);
}

function restoreSectionOrder(order = []) {
  const parent = $("resumeSections");

  order.forEach((sectionName) => {
    const section = parent.querySelector(`[data-section="${sectionName}"]`);
    if (section) parent.appendChild(section);
  });
}

function loadDraft() {
  const savedDraft = localStorage.getItem(DRAFT_KEY);

  if (!savedDraft) {
    addEducation();
    addProject();
    return;
  }

  try {
    const draft = JSON.parse(savedDraft);
    const personal = draft.personal || {};

    $("fullName").value = personal.fullName || "";
    $("jobTitle").value = personal.jobTitle || "";
    $("phone").value = personal.phone || "";
    $("email").value = personal.email || "";
    $("linkedin").value = personal.linkedin || "";
    $("github").value = personal.github || "";
    $("leetcode").value = personal.leetcode || "";
    $("objective").value = personal.objective || "";
    $("languages").value = personal.languages || "";
    $("webTech").value = personal.webTech || "";
    $("database").value = personal.database || "";
    $("tools").value = personal.tools || "";
    $("coreConcepts").value = personal.coreConcepts || "";
    $("softSkills").value = personal.softSkills || "";

    educationContainer.innerHTML = "";
    projectsContainer.innerHTML = "";
    experienceContainer.innerHTML = "";
    certificationsContainer.innerHTML = "";

    if (draft.education?.length) draft.education.forEach(addEducation);
    else addEducation();

    if (draft.projects?.length) draft.projects.forEach(addProject);
    else addProject();

    if (draft.experience?.length) draft.experience.forEach(addExperience);
    if (draft.certifications?.length) draft.certifications.forEach(addCertification);

    restoreSectionOrder(draft.sectionOrder);
  } catch {
    addEducation();
    addProject();
  }
}

function clearDraft() {
  const confirmed = confirm(
    "Clear your saved draft and all current form details?"
  );

  if (!confirmed) return;

  localStorage.removeItem(DRAFT_KEY);
  window.location.reload();
}

/* ---------------- PREVIEW: SKILLS ---------------- */

function updateSkillsPreview() {
  const languages = $("languages").value.trim();
  const webTech = $("webTech").value.trim();
  const database = $("database").value.trim();
  const tools = $("tools").value.trim();
  const coreConcepts = $("coreConcepts").value.trim();
  const softSkills = $("softSkills").value.trim();

  let html = "";

  if (languages) {
    html += `<p class="skill-row"><strong>Languages:</strong> ${safeText(languages)}</p>`;
  }

  if (webTech) {
    html += `<p class="skill-row"><strong>Web Development:</strong> ${safeText(webTech)}</p>`;
  }

  if (database) {
    html += `<p class="skill-row"><strong>Database:</strong> ${safeText(database)}</p>`;
  }

  if (tools) {
    html += `<p class="skill-row"><strong>Tools & Platforms:</strong> ${safeText(tools)}</p>`;
  }

  if (coreConcepts) {
    html += `<p class="skill-row"><strong>Core Concepts:</strong> ${safeText(coreConcepts)}</p>`;
  }

  if (softSkills) {
    html += `<p class="skill-row"><strong>Soft Skills:</strong> ${safeText(softSkills)}</p>`;
  }

  $("previewSkills").innerHTML =
    html || `<p class="empty-note">Add your technical skills.</p>`;
}

/* ---------------- PREVIEW: EDUCATION ---------------- */

function updateEducationPreview() {
  let html = "";

  document.querySelectorAll(".education-card").forEach((card) => {
    const degree = card.querySelector(".edu-degree").value.trim();
    const institute = card.querySelector(".edu-institute").value.trim();
    const duration = card.querySelector(".edu-duration").value.trim();
    const score = card.querySelector(".edu-score").value.trim();

    if (degree || institute || duration || score) {
      html += `
        <div class="education-item">
          <div class="item-title-row">
            <span>${safeText(degree || "Degree / Course")}</span>
            <span>${safeText(duration)}</span>
          </div>
          <div class="item-subtitle">
            ${safeText(institute)}
            ${score ? ` | ${safeText(score)}` : ""}
          </div>
        </div>
      `;
    }
  });

  $("previewEducation").innerHTML =
    html || `<p class="empty-note">Add your education details.</p>`;
}

/* ---------------- PREVIEW: PROJECTS ---------------- */

function updateProjectsPreview() {
  let html = "";

  document.querySelectorAll(".project-card").forEach((card) => {
    const name = card.querySelector(".project-name").value.trim();
    const tech = card.querySelector(".project-tech").value.trim();
    const github = card.querySelector(".project-github").value.trim();
    const live = card.querySelector(".project-live").value.trim();
    const description = card.querySelector(".project-description").value.trim();

    if (name || tech || github || live || description) {
      let links = "";

      if (github) {
        links += `<a href="${safeLink(github)}" target="_blank" rel="noopener">GitHub</a>`;
      }

      if (live) {
        links += `<a href="${safeLink(live)}" target="_blank" rel="noopener">Live Demo</a>`;
      }

      html += `
        <div class="project-item">
          <div class="item-title-row">
            <span>
              ${safeText(name || "Project Name")}
              ${tech ? `<em>(${safeText(tech)})</em>` : ""}
            </span>

            ${links ? `<span class="item-links">${links}</span>` : ""}
          </div>

          <p>${safeText(description)}</p>
        </div>
      `;
    }
  });

  $("previewProjects").innerHTML =
    html || `<p class="empty-note">Add your projects.</p>`;
}

/* ---------------- PREVIEW: EXPERIENCE ---------------- */

function updateExperiencePreview() {
  let html = "";

  document.querySelectorAll(".experience-card").forEach((card) => {
    const role = card.querySelector(".exp-role").value.trim();
    const company = card.querySelector(".exp-company").value.trim();
    const duration = card.querySelector(".exp-duration").value.trim();
    const certificate = card.querySelector(".exp-certificate").value.trim();
    const description = card.querySelector(".exp-description").value.trim();

    if (role || company || duration || certificate || description) {
      const certificateText = certificate
        ? `<a href="${safeLink(certificate)}" target="_blank" rel="noopener">[View Certificate]</a>`
        : "";

      html += `
        <div class="experience-item">
          <div class="item-title-row">
            <span>
              ${safeText(role || "Role")}
              ${company ? ` – ${safeText(company)}` : ""}
              ${certificateText ? ` ${certificateText}` : ""}
            </span>

            <span>${safeText(duration)}</span>
          </div>

          <p>${safeText(description)}</p>
        </div>
      `;
    }
  });

  $("previewExperience").innerHTML =
    html || `<p class="empty-note">Add your experience.</p>`;
}

/* ---------------- PREVIEW: CERTIFICATIONS ---------------- */

function updateCertificationsPreview() {
  let html = "";

  document.querySelectorAll(".certification-card").forEach((card) => {
    const name = card.querySelector(".cert-name").value.trim();
    const organization = card.querySelector(".cert-org").value.trim();
    const link = card.querySelector(".cert-link").value.trim();
    const details = card.querySelector(".cert-details").value.trim();

    if (name || organization || link || details) {
      const certificateLink = link
        ? `<a href="${safeLink(link)}" target="_blank" rel="noopener">View Certificate</a>`
        : "";

      html += `
        <div class="certification-item">
          <div class="item-title-row">
            <span>
              <strong>${safeText(name || "Certificate Name")}</strong>
              ${organization ? ` – ${safeText(organization)}` : ""}
            </span>

            ${certificateLink ? `<span>${certificateLink}</span>` : ""}
          </div>

          ${details ? `<p>${safeText(details)}</p>` : ""}
        </div>
      `;
    }
  });

  $("previewCertifications").innerHTML =
    html || `<p class="empty-note">Add certifications or achievements.</p>`;
}


/* ---------------- MAIN PREVIEW ---------------- */

function updatePreview() {
  $("previewName").textContent =
    $("fullName").value.trim() || "YOUR NAME";

  $("previewTitle").textContent =
    $("jobTitle").value.trim() || "Your Professional Title";

  $("previewPhone").textContent =
    $("phone").value.trim() || "Phone Number";

  $("previewEmail").textContent =
    $("email").value.trim() || "Email Address";

  $("previewLinkedin").href = safeLink($("linkedin").value.trim());
  $("previewGithub").href = safeLink($("github").value.trim());
  $("previewLeetcode").href = safeLink($("leetcode").value.trim());

  $("previewObjective").textContent =
    $("objective").value.trim() ||
    "Your career objective will appear here.";

  updateSkillsPreview();
  updateEducationPreview();
  updateProjectsPreview();
  updateExperiencePreview();
  updateCertificationsPreview();
  calculateResumeScore();
}

/* ---------------- SECTION ORDER ---------------- */

function moveResumeSection(button, direction) {
  const section = button.closest(".draggable-section");
  const parent = $("resumeSections");

  if (direction === "up" && section.previousElementSibling) {
    parent.insertBefore(section, section.previousElementSibling);
  }

  if (direction === "down" && section.nextElementSibling) {
    parent.insertBefore(section.nextElementSibling, section);
  }
}

document.querySelectorAll(".move-up-btn").forEach((button) => {
  button.addEventListener("click", () => moveResumeSection(button, "up"));
});

document.querySelectorAll(".move-down-btn").forEach((button) => {
  button.addEventListener("click", () => moveResumeSection(button, "down"));
});

/* ---------------- BUTTON EVENTS ---------------- */

$("addEducationBtn").addEventListener("click", () => {
  addEducation();
  updatePreview();
});

$("addProjectBtn").addEventListener("click", () => {
  addProject();
  updatePreview();
});

$("addExperienceBtn").addEventListener("click", () => {
  addExperience();
  updatePreview();
});

$("addCertificationBtn").addEventListener("click", () => {
  addCertification();
  updatePreview();
});

$("saveDraftBtn").addEventListener("click", saveDraft);
$("clearDraftBtn").addEventListener("click", clearDraft);

[
  "fullName",
  "jobTitle",
  "phone",
  "email",
  "linkedin",
  "github",
  "leetcode",
  "objective",
  "languages",
  "webTech",
  "database",
  "tools",
  "coreConcepts",
  "softSkills"
].forEach((id) => {
  $(id).addEventListener("input", updatePreview);
});

$("downloadBtn").addEventListener("click", () => window.print());

loadDraft();
updatePreview();