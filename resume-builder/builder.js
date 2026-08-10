
const $ = (id) => document.getElementById(id);

const educationContainer = $("educationContainer");
const projectsContainer = $("projectsContainer");
const experienceContainer = $("experienceContainer");
const certificationsContainer = $("certificationsContainer");

const DRAFT_KEY = "resumeCraftDraft";

/* =========================================================
   SAFE HELPERS
========================================================= */

function safeText(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

function safeLink(url) {
  if (!url) return "#";

  const value = url.trim();

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `https://${value}`;
}

/* =========================================================
   VALIDATION
========================================================= */

/*
  IMPORTANT:
  Validation is done on BLUR.
  It is NOT done while typing.
  It is NOT done while downloading/printing.
*/

function showValidationError(input, message) {
  alert(message);

  // After OK, return the user to the field
  setTimeout(() => {
    input.focus();
    input.select();
  }, 0);

  return false;
}

function validateTextOnly(input, fieldName) {
  const value = input.value.trim();

  if (!value) return true;

  /*
    Allows:
    letters
    spaces
    hyphen
    apostrophe
    period
    &
  */
  const validPattern = /^[A-Za-zÀ-ÿ\s.'&-]+$/;

  if (!validPattern.test(value)) {
    input.value = value.replace(/[0-9]/g, "");

    return showValidationError(
      input,
      `${fieldName} should not contain numbers or special characters.`
    );
  }

  return true;
}

function validatePhone(input) {
  const value = input.value.trim();

  if (!value) return true;

  /*
    Allows:
    +91 9876543210
    +919876543210
    9876543210
    09876543210
  */
  const phonePattern = /^\+?[0-9][0-9\s-]{7,14}$/;

  if (!phonePattern.test(value)) {
    return showValidationError(
      input,
      "Please enter a valid phone number.\nExample: +91 9876543210"
    );
  }

  return true;
}

function validateEmail(input) {
  const value = input.value.trim();

  if (!value) return true;

  const emailPattern =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailPattern.test(value)) {
    return showValidationError(
      input,
      "Please enter a valid email address.\nExample: youremail@gmail.com"
    );
  }

  return true;
}

function validateURL(input, fieldName) {
  const value = input.value.trim();

  if (!value) return true;

  let url;

  try {
    const normalized =
      value.startsWith("http://") ||
      value.startsWith("https://")
        ? value
        : `https://${value}`;

    url = new URL(normalized);
  } catch {
    return showValidationError(
      input,
      `Please enter a valid ${fieldName} URL.\nExample: https://example.com`
    );
  }

  if (
    url.protocol !== "http:" &&
    url.protocol !== "https:"
  ) {
    return showValidationError(
      input,
      `Please enter a valid ${fieldName} URL.`
    );
  }

  if (!url.hostname || !url.hostname.includes(".")) {
    return showValidationError(
      input,
      `Please enter a valid ${fieldName} URL.`
    );
  }

  return true;
}

/* =========================================================
   PERSONAL FIELD VALIDATION
========================================================= */

function setupValidation() {
  const fullName = $("fullName");
  const jobTitle = $("jobTitle");
  const phone = $("phone");
  const email = $("email");

  const linkedin = $("linkedin");
  const github = $("github");
  const leetcode = $("leetcode");

  if (fullName) {
    fullName.addEventListener("blur", () => {
      validateTextOnly(fullName, "Full Name");
    });
  }

  if (jobTitle) {
    jobTitle.addEventListener("blur", () => {
      validateTextOnly(jobTitle, "Professional Title");
    });
  }

  if (phone) {
    phone.addEventListener("blur", () => {
      validatePhone(phone);
    });
  }

  if (email) {
    email.addEventListener("blur", () => {
      validateEmail(email);
    });
  }

  if (linkedin) {
    linkedin.addEventListener("blur", () => {
      validateURL(linkedin, "LinkedIn");
    });
  }

  if (github) {
    github.addEventListener("blur", () => {
      validateURL(github, "GitHub");
    });
  }

  if (leetcode) {
    leetcode.addEventListener("blur", () => {
      validateURL(leetcode, "LeetCode");
    });
  }
}

/* =========================================================
   DYNAMIC FIELD VALIDATION
========================================================= */

function setupDynamicValidation(card) {
  card.querySelectorAll("input, textarea").forEach((input) => {

    input.addEventListener("input", updatePreview);

    /*
      Validate only when user leaves the field.
    */
    input.addEventListener("blur", () => {

      if (input.classList.contains("project-github")) {
        validateURL(input, "GitHub");
      }

      if (input.classList.contains("project-live")) {
        validateURL(input, "Live Demo");
      }

      if (input.classList.contains("exp-certificate")) {
        validateURL(input, "Certificate");
      }

      if (input.classList.contains("cert-link")) {
        validateURL(input, "Certificate");
      }

      if (
        input.classList.contains("project-name") ||
        input.classList.contains("exp-company") ||
        input.classList.contains("exp-role") ||
        input.classList.contains("cert-name") ||
        input.classList.contains("cert-org") ||
        input.classList.contains("edu-institute")
      ) {
        /*
          These fields can contain normal punctuation,
          so only reject numbers.
        */

        const value = input.value.trim();

        if (value && /[0-9]/.test(value)) {
          input.value = value.replace(/[0-9]/g, "");

          showValidationError(
            input,
            "This field should not contain numbers."
          );
        }
      }
    });
  });
}

/* =========================================================
   REMOVE BUTTON
========================================================= */

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

/* =========================================================
   EDUCATION
========================================================= */

function addEducation(data = {}) {
  const card = document.createElement("div");

  card.className = "dynamic-card education-card";

  card.innerHTML = `
    <div class="grid">

      <label class="full">
        College / School Name

        <input
          type="text"
          class="edu-institute"
          placeholder="GL Bajaj Institute of Technology and Management"
          value="${safeText(data.institute || "")}"
        />
      </label>

      <label>
        Degree / Course

        <input
          type="text"
          class="edu-degree"
          placeholder="B.Tech in Information Technology"
          value="${safeText(data.degree || "")}"
        />
      </label>

      <label>
        Duration

        <input
          type="text"
          class="edu-duration"
          placeholder="2024 - 2028"
          value="${safeText(data.duration || "")}"
        />
      </label>

      <label>
        CGPA / Percentage

        <input
          type="text"
          class="edu-score"
          placeholder="8.50 CGPA"
          value="${safeText(data.score || "")}"
        />
      </label>

    </div>
  `;

  card.prepend(createRemoveButton(card));

  educationContainer.appendChild(card);

  setupDynamicValidation(card);
}

/* =========================================================
   PROJECTS
========================================================= */

function addProject(data = {}) {
  const card = document.createElement("div");

  card.className = "dynamic-card project-card";

  card.innerHTML = `
    <div class="grid">

      <label class="full">
        Project Name

        <input
          type="text"
          class="project-name"
          placeholder="PrepPulse"
          value="${safeText(data.name || "")}"
        />
      </label>

      <label>
        Technologies Used

        <input
          type="text"
          class="project-tech"
          placeholder="HTML, CSS, JavaScript"
          value="${safeText(data.tech || "")}"
        />
      </label>

      <label>
        GitHub Link

        <input
          type="url"
          class="project-github"
          placeholder="https://github.com/username/project"
          value="${safeText(data.github || "")}"
        />
      </label>

      <label class="full">
        Live Demo Link

        <input
          type="url"
          class="project-live"
          placeholder="https://your-project.netlify.app"
          value="${safeText(data.live || "")}"
        />
      </label>

      <label class="full">
        Project Description

        <textarea
          class="project-description"
          rows="3"
          placeholder="Describe what your project does..."
        >${safeText(data.description || "")}</textarea>
      </label>

    </div>
  `;

  card.prepend(createRemoveButton(card));

  projectsContainer.appendChild(card);

  setupDynamicValidation(card);
}

/* =========================================================
   EXPERIENCE
========================================================= */

function addExperience(data = {}) {
  const card = document.createElement("div");

  card.className = "dynamic-card experience-card";

  card.innerHTML = `
    <div class="grid">

      <label>
        Company / Organization

        <input
          type="text"
          class="exp-company"
          placeholder="ShadowFox"
          value="${safeText(data.company || "")}"
        />
      </label>

      <label>
        Role

        <input
          type="text"
          class="exp-role"
          placeholder="Web Development Intern"
          value="${safeText(data.role || "")}"
        />
      </label>

      <label>
        Duration

        <input
          type="text"
          class="exp-duration"
          placeholder="Nov 2025 - Dec 2025"
          value="${safeText(data.duration || "")}"
        />
      </label>

      <label>
        Certificate Link

        <input
          type="url"
          class="exp-certificate"
          placeholder="https://certificate-link.com"
          value="${safeText(data.certificate || "")}"
        />
      </label>

      <label class="full">
        Description

        <textarea
          class="exp-description"
          rows="3"
          placeholder="Describe your work and contribution..."
        >${safeText(data.description || "")}</textarea>
      </label>

    </div>
  `;

  card.prepend(createRemoveButton(card));

  experienceContainer.appendChild(card);

  setupDynamicValidation(card);
}

/* =========================================================
   CERTIFICATIONS
========================================================= */

function addCertification(data = {}) {
  const card = document.createElement("div");

  card.className = "dynamic-card certification-card";

  card.innerHTML = `
    <div class="grid">

      <label>
        Certificate / Achievement Name

        <input
          type="text"
          class="cert-name"
          placeholder="AWS Academy Cloud Foundations"
          value="${safeText(data.name || "")}"
        />
      </label>

      <label>
        Issuing Organization

        <input
          type="text"
          class="cert-org"
          placeholder="AWS Academy"
          value="${safeText(data.organization || "")}"
        />
      </label>

      <label>
        Certificate Link

        <input
          type="url"
          class="cert-link"
          placeholder="https://credential-link.com"
          value="${safeText(data.link || "")}"
        />
      </label>

      <label class="full">
        Description / Details

        <textarea
          class="cert-details"
          rows="2"
          placeholder="Briefly mention what you learned or achieved..."
        >${safeText(data.details || "")}</textarea>
      </label>

    </div>
  `;

  card.prepend(createRemoveButton(card));

  certificationsContainer.appendChild(card);

  setupDynamicValidation(card);
}

/* =========================================================
   GET FORM DATA
========================================================= */

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
      tools: $("tools").value
    },

    education: [
      ...document.querySelectorAll(".education-card")
    ].map((card) => ({
      institute: card.querySelector(".edu-institute").value,
      degree: card.querySelector(".edu-degree").value,
      duration: card.querySelector(".edu-duration").value,
      score: card.querySelector(".edu-score").value
    })),

    projects: [
      ...document.querySelectorAll(".project-card")
    ].map((card) => ({
      name: card.querySelector(".project-name").value,
      tech: card.querySelector(".project-tech").value,
      github: card.querySelector(".project-github").value,
      live: card.querySelector(".project-live").value,
      description:
        card.querySelector(".project-description").value
    })),

    experience: [
      ...document.querySelectorAll(".experience-card")
    ].map((card) => ({
      company: card.querySelector(".exp-company").value,
      role: card.querySelector(".exp-role").value,
      duration: card.querySelector(".exp-duration").value,
      certificate:
        card.querySelector(".exp-certificate")?.value || "",
      description:
        card.querySelector(".exp-description").value
    })),

    certifications: [
      ...document.querySelectorAll(".certification-card")
    ].map((card) => ({
      name: card.querySelector(".cert-name").value,
      organization: card.querySelector(".cert-org").value,
      link: card.querySelector(".cert-link")?.value || "",
      details:
        card.querySelector(".cert-details").value
    })),

    sectionOrder: [
      ...document.querySelectorAll(".draggable-section")
    ].map((section) => section.dataset.section)
  };
}

/* =========================================================
   SAVE / LOAD DRAFT
========================================================= */

function saveDraft() {
  localStorage.setItem(
    DRAFT_KEY,
    JSON.stringify(getFormData())
  );

  const button = $("saveDraftBtn");

  if (!button) return;

  const originalText = button.textContent;

  button.textContent = "Draft Saved ✓";

  setTimeout(() => {
    button.textContent = originalText;
  }, 1600);
}

function restoreSectionOrder(order = []) {
  const parent = $("resumeSections");

  if (!parent) return;

  order.forEach((sectionName) => {
    const section = parent.querySelector(
      `[data-section="${sectionName}"]`
    );

    if (section) {
      parent.appendChild(section);
    }
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

    $("linkedin").value =
      personal.linkedin || "";

    $("github").value =
      personal.github || "";

    $("leetcode").value =
      personal.leetcode || "";

    $("objective").value =
      personal.objective || "";

    $("languages").value =
      personal.languages || "";

    $("webTech").value =
      personal.webTech || "";

    $("tools").value =
      personal.tools || "";

    educationContainer.innerHTML = "";
    projectsContainer.innerHTML = "";
    experienceContainer.innerHTML = "";
    certificationsContainer.innerHTML = "";

    if (draft.education?.length) {
      draft.education.forEach(addEducation);
    } else {
      addEducation();
    }

    if (draft.projects?.length) {
      draft.projects.forEach(addProject);
    } else {
      addProject();
    }

    if (draft.experience?.length) {
      draft.experience.forEach(addExperience);
    }

    if (draft.certifications?.length) {
      draft.certifications.forEach(addCertification);
    }

    restoreSectionOrder(draft.sectionOrder || []);

  } catch (error) {
    console.error("Could not load resume draft:", error);

    educationContainer.innerHTML = "";
    projectsContainer.innerHTML = "";
    experienceContainer.innerHTML = "";
    certificationsContainer.innerHTML = "";

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

/* =========================================================
   SKILLS PREVIEW
========================================================= */

function updateSkillsPreview() {
  const languages =
    $("languages").value.trim();

  const webTech =
    $("webTech").value.trim();

  const tools =
    $("tools").value.trim();

  let html = "";

  if (languages) {
    html += `
      <p class="skill-row">
        <strong>Languages:</strong>
        ${safeText(languages)}
      </p>
    `;
  }

  if (webTech) {
    html += `
      <p class="skill-row">
        <strong>Web Technologies:</strong>
        ${safeText(webTech)}
      </p>
    `;
  }

  if (tools) {
    html += `
      <p class="skill-row">
        <strong>Tools & Platforms:</strong>
        ${safeText(tools)}
      </p>
    `;
  }

  $("previewSkills").innerHTML =
    html ||
    `<p class="empty-note">Add your technical skills.</p>`;
}

/* =========================================================
   EDUCATION PREVIEW
========================================================= */

function updateEducationPreview() {
  let html = "";

  document
    .querySelectorAll(".education-card")
    .forEach((card) => {

      const institute =
        card.querySelector(".edu-institute")
          .value.trim();

      const degree =
        card.querySelector(".edu-degree")
          .value.trim();

      const duration =
        card.querySelector(".edu-duration")
          .value.trim();

      const score =
        card.querySelector(".edu-score")
          .value.trim();

      if (
        institute ||
        degree ||
        duration ||
        score
      ) {
        html += `
          <div class="education-item">

            <div class="item-title-row">

              <span>
                ${safeText(
                  institute || "Institute Name"
                )}
              </span>

              <span>
                ${safeText(duration)}
              </span>

            </div>

            <div class="item-subtitle">

              ${safeText(degree)}

              ${
                score
                  ? ` | ${safeText(score)}`
                  : ""
              }

            </div>

          </div>
        `;
      }
    });

  $("previewEducation").innerHTML =
    html ||
    `<p class="empty-note">
      Add your education details.
    </p>`;
}

/* =========================================================
   PROJECTS PREVIEW
========================================================= */

function updateProjectsPreview() {
  let html = "";

  document
    .querySelectorAll(".project-card")
    .forEach((card) => {

      const name =
        card.querySelector(".project-name")
          .value.trim();

      const tech =
        card.querySelector(".project-tech")
          .value.trim();

      const github =
        card.querySelector(".project-github")
          .value.trim();

      const live =
        card.querySelector(".project-live")
          .value.trim();

      const description =
        card.querySelector(".project-description")
          .value.trim();

      if (
        name ||
        tech ||
        github ||
        live ||
        description
      ) {

        let links = "";

        if (github) {
          links += `
            <a
              href="${safeLink(github)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          `;
        }

        if (live) {
          links += `
            <a
              href="${safeLink(live)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo
            </a>
          `;
        }

        html += `
          <div class="project-item">

            <div class="item-title-row">

              <span>
                ${safeText(
                  name || "Project Name"
                )}

                ${
                  tech
                    ? ` <em>(${safeText(tech)})</em>`
                    : ""
                }
              </span>

              ${
                links
                  ? `<span class="item-links">${links}</span>`
                  : ""
              }

            </div>

            <p>
              ${safeText(description)}
            </p>

          </div>
        `;
      }
    });

  $("previewProjects").innerHTML =
    html ||
    `<p class="empty-note">
      Add your projects.
    </p>`;
}

/* =========================================================
   EXPERIENCE PREVIEW
========================================================= */

function updateExperiencePreview() {
  let html = "";

  document
    .querySelectorAll(".experience-card")
    .forEach((card) => {

      const company =
        card.querySelector(".exp-company")
          .value.trim();

      const role =
        card.querySelector(".exp-role")
          .value.trim();

      const duration =
        card.querySelector(".exp-duration")
          .value.trim();

      const certificate =
        card.querySelector(".exp-certificate")
          ?.value.trim() || "";

      const description =
        card.querySelector(".exp-description")
          .value.trim();

      if (
        company ||
        role ||
        duration ||
        certificate ||
        description
      ) {

        const certificateLink =
          certificate
            ? `
              <a
                href="${safeLink(certificate)}"
                target="_blank"
                rel="noopener noreferrer"
              >
                [View Certificate]
              </a>
            `
            : "";

        html += `
          <div class="experience-item">

            <div class="item-title-row">

              <span>

                ${safeText(
                  company || "Organization Name"
                )}

                ${
                  role
                    ? ` – ${safeText(role)}`
                    : ""
                }

                ${
                  certificateLink
                    ? ` ${certificateLink}`
                    : ""
                }

              </span>

              <span>
                ${safeText(duration)}
              </span>

            </div>

            <p>
              ${safeText(description)}
            </p>

          </div>
        `;
      }
    });

  $("previewExperience").innerHTML =
    html ||
    `<p class="empty-note">
      Add your experience.
    </p>`;
}

/* =========================================================
   CERTIFICATIONS PREVIEW
========================================================= */

function updateCertificationsPreview() {
  let html = "";

  document
    .querySelectorAll(".certification-card")
    .forEach((card) => {

      const name =
        card.querySelector(".cert-name")
          .value.trim();

      const organization =
        card.querySelector(".cert-org")
          .value.trim();

      const link =
        card.querySelector(".cert-link")
          ?.value.trim() || "";

      const details =
        card.querySelector(".cert-details")
          .value.trim();

      if (
        name ||
        organization ||
        link ||
        details
      ) {

        const certificateLink =
          link
            ? `
              <a
                href="${safeLink(link)}"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Certificate
              </a>
            `
            : "";

        html += `
          <div class="certification-item">

            <div class="item-title-row">

              <span>

                <strong>
                  ${safeText(
                    name || "Certificate Name"
                  )}
                </strong>

                ${
                  organization
                    ? ` — ${safeText(organization)}`
                    : ""
                }

              </span>

              ${
                certificateLink
                  ? `<span>${certificateLink}</span>`
                  : ""
              }

            </div>

            ${
              details
                ? `<p>${safeText(details)}</p>`
                : ""
            }

          </div>
        `;
      }
    });

  $("previewCertifications").innerHTML =
    html ||
    `<p class="empty-note">
      Add certifications or achievements.
    </p>`;
}

/* =========================================================
   RESUME SCORE
========================================================= */

function calculateResumeScore() {
  let score = 0;

  const fullName =
    $("fullName").value.trim();

  const email =
    $("email").value.trim();

  const phone =
    $("phone").value.trim();

  const objective =
    $("objective").value.trim();

  const github =
    $("github").value.trim();

  const linkedin =
    $("linkedin").value.trim();

  const languages =
    $("languages").value.trim();

  const webTech =
    $("webTech").value.trim();

  const tools =
    $("tools").value.trim();

  const educationCards =
    document.querySelectorAll(
      ".education-card"
    );

  const projectCards =
    document.querySelectorAll(
      ".project-card"
    );

  const experienceCards =
    document.querySelectorAll(
      ".experience-card"
    );

  const certificationCards =
    document.querySelectorAll(
      ".certification-card"
    );

  if (fullName) score += 10;

  if (email) score += 8;

  if (phone) score += 5;

  if (objective.length >= 30) {
    score += 12;
  }

  let completedEducation = false;

  educationCards.forEach((card) => {

    const institute =
      card.querySelector(".edu-institute")
        .value.trim();

    const degree =
      card.querySelector(".edu-degree")
        .value.trim();

    if (institute && degree) {
      completedEducation = true;
    }
  });

  if (completedEducation) {
    score += 12;
  }

  if (
    languages ||
    webTech ||
    tools
  ) {
    score += 10;
  }

  if (languages && webTech) {
    score += 5;
  }

  if (github) score += 8;

  if (linkedin) score += 5;

  let completedProjects = 0;

  projectCards.forEach((card) => {

    const name =
      card.querySelector(".project-name")
        .value.trim();

    const description =
      card.querySelector(".project-description")
        .value.trim();

    if (
      name &&
      description.length >= 20
    ) {
      completedProjects++;
    }
  });

  if (completedProjects >= 1) {
    score += 5;
  }

  if (completedProjects >= 2) {
    score += 10;
  }

  let completedExperience = false;

  experienceCards.forEach((card) => {

    const company =
      card.querySelector(".exp-company")
        .value.trim();

    const role =
      card.querySelector(".exp-role")
        .value.trim();

    if (company && role) {
      completedExperience = true;
    }
  });

  if (completedExperience) {
    score += 5;
  }

  let completedCertification = false;

  certificationCards.forEach((card) => {

    const name =
      card.querySelector(".cert-name")
        .value.trim();

    if (name) {
      completedCertification = true;
    }
  });

  if (completedCertification) {
    score += 5;
  }

  if (score > 100) {
    score = 100;
  }

  if ($("resumeScore")) {
    $("resumeScore").textContent = score;
  }

  if ($("scoreCircleText")) {
    $("scoreCircleText").textContent =
      `${score}%`;
  }

  let message =
    "Start adding your details to build your resume.";

  if (score >= 85) {
    message =
      "Excellent! Your resume looks strong and well-completed.";
  } else if (score >= 65) {
    message =
      "Good progress. Add more projects or achievements to improve it.";
  } else if (score >= 40) {
    message =
      "You have started well. Complete more sections for a stronger resume.";
  }

  if ($("scoreMessage")) {
    $("scoreMessage").textContent = message;
  }
}

/* =========================================================
   MAIN PREVIEW
========================================================= */

function updatePreview() {

  $("previewName").textContent =
    $("fullName").value.trim() ||
    "YOUR NAME";

  $("previewTitle").textContent =
    $("jobTitle").value.trim() ||
    "Aspiring Software Developer";

  $("previewPhone").textContent =
    $("phone").value.trim() ||
    "+91 0000000000";

  $("previewEmail").textContent =
    $("email").value.trim() ||
    "email@example.com";

  $("previewLinkedin").href =
    safeLink(
      $("linkedin").value.trim()
    );

  $("previewGithub").href =
    safeLink(
      $("github").value.trim()
    );

  $("previewLeetcode").href =
    safeLink(
      $("leetcode").value.trim()
    );

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

/* =========================================================
   SECTION REORDER
========================================================= */

function moveResumeSection(
  button,
  direction
) {
  const section =
    button.closest(".draggable-section");

  const parent =
    $("resumeSections");

  if (!section || !parent) return;

  if (direction === "up") {

    const previousSection =
      section.previousElementSibling;

    if (previousSection) {
      parent.insertBefore(
        section,
        previousSection
      );
    }
  }

  if (direction === "down") {

    const nextSection =
      section.nextElementSibling;

    if (nextSection) {
      parent.insertBefore(
        nextSection,
        section
      );
    }
  }
}

function setupSectionReorderButtons() {

  document
    .querySelectorAll(".move-up-btn")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {
          moveResumeSection(
            button,
            "up"
          );
        }
      );
    });

  document
    .querySelectorAll(".move-down-btn")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {
          moveResumeSection(
            button,
            "down"
          );
        }
      );
    });
}

/* =========================================================
   BUTTON EVENTS
========================================================= */

$("addEducationBtn").addEventListener(
  "click",
  () => {
    addEducation();
    updatePreview();
  }
);

$("addProjectBtn").addEventListener(
  "click",
  () => {
    addProject();
    updatePreview();
  }
);

$("addExperienceBtn").addEventListener(
  "click",
  () => {
    addExperience();
    updatePreview();
  }
);

$("addCertificationBtn").addEventListener(
  "click",
  () => {
    addCertification();
    updatePreview();
  }
);

/* =========================================================
   SAVE / CLEAR
========================================================= */

if ($("saveDraftBtn")) {
  $("saveDraftBtn").addEventListener(
    "click",
    saveDraft
  );
}

if ($("clearDraftBtn")) {
  $("clearDraftBtn").addEventListener(
    "click",
    clearDraft
  );
}

/* =========================================================
   LIVE PREVIEW INPUTS
========================================================= */

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
  "tools"
].forEach((id) => {

  const input = $(id);

  if (!input) return;

  input.addEventListener(
    "input",
    updatePreview
  );
});

/* =========================================================
   DOWNLOAD
========================================================= */

/*
  IMPORTANT:
  Download does NOT call validation.
  It only opens the print dialog.
*/

$("downloadBtn").addEventListener(
  "click",
  () => {
    window.print();
  }
);

/* =========================================================
   INITIALIZE
========================================================= */

setupSectionReorderButtons();

setupValidation();

loadDraft();

updatePreview();

