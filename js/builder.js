
/* =========================================================
   PORTFOLIOGEN — BUILDER
   Complete Portfolio Builder
   Includes:
   - Input validation
   - URL validation
   - Date picker
   - Date validation
   - Alerts for invalid input
   - Save / Load Draft
   - ZIP download
   - Live preview
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       STATE
    ===================================================== */

    const state = {
        currentSection: 0,
        template: "modern",
        skills: [],
        experience: [],
        projects: [],
        education: []
    };

    const sections = [
        "personal",
        "about",
        "skills",
        "experience",
        "projects",
        "education",
        "social",
        "template"
    ];


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const stepButtons =
        document.querySelectorAll(".builder-step");

    const editorSections =
        document.querySelectorAll(".editor-section");

    const backBtn =
        document.getElementById("backBtn");

    const continueBtn =
        document.getElementById("continueBtn");

    const stepIndicator =
        document.getElementById("stepIndicator");

    const progressFill =
        document.getElementById("progressFill");

    const progressPercent =
        document.getElementById("progressPercent");

    const skillInput =
        document.getElementById("skillInput");

    const skillsContainer =
        document.getElementById("skillsContainer");

    const experienceList =
        document.getElementById("experienceList");

    const projectsList =
        document.getElementById("projectsList");

    const educationList =
        document.getElementById("educationList");

    const preview =
        document.getElementById("portfolioPreview");

    const downloadBtn =
        document.getElementById("downloadBtn");


    /* =====================================================
       PERSONAL INPUTS
    ===================================================== */

    const fullName =
        document.getElementById("fullName");

    const role =
        document.getElementById("role");

    const tagline =
        document.getElementById("tagline");

    const locationInput =
        document.getElementById("location");

    const aboutText =
        document.getElementById("aboutText");

    const github =
        document.getElementById("github");

    const linkedin =
        document.getElementById("linkedin");

    const email =
        document.getElementById("email");


    /* =====================================================
       VALIDATION HELPERS
    ===================================================== */

    function showValidationAlert(message, input = null) {

        alert(message);

        if (input) {
            input.focus();
            input.classList.add("input-error");

            setTimeout(() => {
                input.classList.remove("input-error");
            }, 2000);
        }
    }


    /*
     * Allows:
     * John Doe
     * Shantanu Katiyar
     * A B
     *
     * Does NOT allow:
     * John123
     * John@
     * John_123
     */

    function isNameLike(value) {

        return /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(
            value.trim()
        );

    }


    /*
     * Professional title / tagline.
     *
     * Allows:
     * Software Developer
     * Full Stack Developer
     * Web Developer
     *
     * Does NOT allow numbers.
     */

    function isTextWithoutNumbers(value) {

        return !/[0-9]/.test(value);

    }


    /*
     * Location.
     *
     * Allows:
     * New Delhi, India
     * Dadri, Uttar Pradesh
     * Noida, India
     *
     * Does NOT allow:
     * Noida123
     * Delhi@
     */

    function isValidLocation(value) {

        return /^[A-Za-z]+(?:[ ,.'-][A-Za-z]+)*$/.test(
            value.trim()
        );

    }


    /*
     * Email validation.
     */

    function isValidEmail(value) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
            value.trim()
        );

    }


    /*
     * GitHub URL.
     */

    function isValidGithubURL(value) {

        try {

            const url = new URL(value.trim());

            return (
                url.protocol === "https:" &&
                url.hostname.toLowerCase() === "github.com" &&
                url.pathname.length > 1
            );

        } catch {

            return false;

        }

    }


    /*
     * LinkedIn URL.
     */

    function isValidLinkedinURL(value) {

        try {

            const url = new URL(value.trim());

            return (
                url.protocol === "https:" &&
                (
                    url.hostname.toLowerCase() ===
                    "linkedin.com"
                    ||
                    url.hostname.toLowerCase() ===
                    "www.linkedin.com"
                ) &&
                url.pathname.startsWith("/in/") &&
                url.pathname.length > 4
            );

        } catch {

            return false;

        }

    }


    /*
     * Generic project URL.
     *
     * Must contain https://
     */

    function isValidURL(value) {

        try {

            const url = new URL(value.trim());

            return (
                url.protocol === "https:" &&
                url.hostname.includes(".")
            );

        } catch {

            return false;

        }

    }


    /*
     * Date validation.
     */

    function isValidDate(value) {

        if (!value) {
            return false;
        }

        const date = new Date(value);

        return !Number.isNaN(date.getTime());

    }


    /* =====================================================
       HTML ESCAPE
    ===================================================== */

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /* =====================================================
       DATE DISPLAY
    ===================================================== */

    function formatDate(dateString) {

        if (!dateString) {
            return "";
        }

        const date = new Date(
            dateString + "T00:00:00"
        );

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       URL TEMPLATE
    ===================================================== */

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const urlTemplate =
        urlParams.get("template");

    if (
        urlTemplate === "modern" ||
        urlTemplate === "aurora" ||
        urlTemplate === "skyline"
    ) {

        state.template =
            urlTemplate;

    }


    /* =====================================================
       SECTION NAVIGATION
    ===================================================== */

    function showSection(index) {

        if (index < 0) {
            index = 0;
        }

        if (
            index >= sections.length
        ) {
            index =
                sections.length - 1;
        }

        state.currentSection =
            index;


        editorSections.forEach(
            (section, i) => {

                section.classList.toggle(
                    "active",
                    i === index
                );

            }
        );


        stepButtons.forEach(
            (button, i) => {

                button.classList.toggle(
                    "active",
                    i === index
                );

            }
        );


        const currentStep =
            String(index + 1).padStart(
                2,
                "0"
            );

        const totalSteps =
            String(sections.length).padStart(
                2,
                "0"
            );


        if (stepIndicator) {

            stepIndicator.textContent =
                `${currentStep} / ${totalSteps}`;

        }


        const progress =
            Math.round(
                (
                    (index + 1) /
                    sections.length
                ) * 100
            );


        if (progressFill) {

            progressFill.style.width =
                `${progress}%`;

        }


        if (progressPercent) {

            progressPercent.textContent =
                `${progress}%`;

        }


        if (backBtn) {

            backBtn.disabled =
                index === 0;

        }


        if (continueBtn) {

            continueBtn.textContent =
                index ===
                sections.length - 1
                    ? "Finish →"
                    : "Continue →";

        }

    }


    stepButtons.forEach(
        (button, index) => {

            button.addEventListener(
                "click",
                () => {

                    showSection(index);

                }
            );

        }
    );


    /* =====================================================
       VALIDATE BASIC FORM
    ===================================================== */

    function validateBasicFields() {

        const name =
            fullName?.value.trim() || "";

        if (name && !isNameLike(name)) {

            showValidationAlert(
                "Full name should contain letters, spaces, apostrophes or hyphens only.",
                fullName
            );

            return false;

        }


        const roleValue =
            role?.value.trim() || "";

        if (
            roleValue &&
            !isTextWithoutNumbers(roleValue)
        ) {

            showValidationAlert(
                "Professional title cannot contain numbers.",
                role
            );

            return false;

        }


        const taglineValue =
            tagline?.value.trim() || "";

        if (
            taglineValue &&
            !isTextWithoutNumbers(taglineValue)
        ) {

            showValidationAlert(
                "Tagline cannot contain numbers.",
                tagline
            );

            return false;

        }


        const location =
            locationInput?.value.trim() || "";

        if (
            location &&
            !isValidLocation(location)
        ) {

            showValidationAlert(
                "Location should contain letters, spaces, commas, apostrophes or hyphens only.",
                locationInput
            );

            return false;

        }


        const emailValue =
            email?.value.trim() || "";

        if (
            emailValue &&
            !isValidEmail(emailValue)
        ) {

            showValidationAlert(
                "Please enter a valid email address.",
                email
            );

            return false;

        }


        const githubValue =
            github?.value.trim() || "";

        if (
            githubValue &&
            !isValidGithubURL(githubValue)
        ) {

            showValidationAlert(
                "Please enter a valid GitHub URL starting with https://github.com/",
                github
            );

            return false;

        }


        const linkedinValue =
            linkedin?.value.trim() || "";

        if (
            linkedinValue &&
            !isValidLinkedinURL(linkedinValue)
        ) {

            showValidationAlert(
                "Please enter a valid LinkedIn URL starting with https://linkedin.com/in/",
                linkedin
            );

            return false;

        }


        return true;

    }


    /* =====================================================
       COLLECT FORM DATA
    ===================================================== */

    function collectFormData() {

        return {

            fullName:
                fullName?.value.trim() || "",

            role:
                role?.value.trim() || "",

            tagline:
                tagline?.value.trim() || "",

            location:
                locationInput?.value.trim() || "",

            aboutText:
                aboutText?.value.trim() || "",

            github:
                github?.value.trim() || "",

            linkedin:
                linkedin?.value.trim() || "",

            email:
                email?.value.trim() || "",

            skills:
                [...state.skills],

            experience:
                [...state.experience],

            projects:
                [...state.projects],

            education:
                [...state.education],

            template:
                state.template

        };

    }


    /* =====================================================
       UPDATE PREVIEW
    ===================================================== */

    function updatePortfolioPreview() {

        if (
            typeof PortfolioRenderer ===
            "undefined"
        ) {

            console.error(
                "PortfolioRenderer is not loaded."
            );

            return;

        }


        const data =
            collectFormData();


        PortfolioRenderer.render(
            data
        );

    }


    /* =====================================================
       LIVE PERSONAL INPUTS
    ===================================================== */

    [
        fullName,
        role,
        tagline,
        locationInput,
        aboutText,
        github,
        linkedin,
        email

    ].forEach(input => {

        if (!input) {
            return;
        }


        input.addEventListener(
            "input",
            updatePortfolioPreview
        );

    });


    /* =====================================================
       BLOCK INVALID PERSONAL INPUT
    ===================================================== */

    if (fullName) {

        fullName.addEventListener(
            "input",
            () => {

                if (
                    /[^A-Za-z\s'-]/.test(
                        fullName.value
                    )
                ) {

                    fullName.value =
                        fullName.value.replace(
                            /[^A-Za-z\s'-]/g,
                            ""
                        );

                    showValidationAlert(
                        "Only letters, spaces, apostrophes and hyphens are allowed in the name.",
                        fullName
                    );

                }

            }
        );

    }


    if (role) {

        role.addEventListener(
            "input",
            () => {

                if (
                    /[0-9]/.test(
                        role.value
                    )
                ) {

                    role.value =
                        role.value.replace(
                            /[0-9]/g,
                            ""
                        );

                    showValidationAlert(
                        "Numbers are not allowed in the professional title.",
                        role
                    );

                }

            }
        );

    }


    if (tagline) {

        tagline.addEventListener(
            "input",
            () => {

                if (
                    /[0-9]/.test(
                        tagline.value
                    )
                ) {

                    tagline.value =
                        tagline.value.replace(
                            /[0-9]/g,
                            ""
                        );

                    showValidationAlert(
                        "Numbers are not allowed in the tagline.",
                        tagline
                    );

                }

            }
        );

    }


    if (locationInput) {

        locationInput.addEventListener(
            "input",
            () => {

                if (
                    /[^A-Za-z\s,.'-]/.test(
                        locationInput.value
                    )
                ) {

                    locationInput.value =
                        locationInput.value.replace(
                            /[^A-Za-z\s,.'-]/g,
                            ""
                        );

                    showValidationAlert(
                        "Numbers and special characters are not allowed in the location.",
                        locationInput
                    );

                }

            }
        );

    }


    /* =====================================================
       SKILLS
    ===================================================== */

    function renderSkills() {

        if (!skillsContainer) {
            return;
        }


        skillsContainer
            .querySelectorAll(
                ".skill-tag"
            )
            .forEach(
                tag => tag.remove()
            );


        state.skills.forEach(
            (skill, index) => {

                const tag =
                    document.createElement(
                        "span"
                    );

                tag.className =
                    "skill-tag";


                const text =
                    document.createElement(
                        "span"
                    );

                text.textContent =
                    skill;


                const remove =
                    document.createElement(
                        "button"
                    );

                remove.type =
                    "button";

                remove.textContent =
                    "×";


                remove.addEventListener(
                    "click",
                    () => {

                        state.skills.splice(
                            index,
                            1
                        );

                        renderSkills();

                        updatePortfolioPreview();

                    }
                );


                tag.appendChild(text);

                tag.appendChild(remove);


                if (skillInput) {

                    skillsContainer.insertBefore(
                        tag,
                        skillInput
                    );

                } else {

                    skillsContainer.appendChild(
                        tag
                    );

                }

            }
        );

    }


    if (skillInput) {

        skillInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Enter"
                ) {
                    return;
                }


                event.preventDefault();


                const value =
                    skillInput.value.trim();


                if (!value) {
                    return;
                }


                const newSkills =
                    value
                        .split(",")
                        .map(
                            skill =>
                                skill.trim()
                        )
                        .filter(Boolean);


                newSkills.forEach(
                    skill => {

                        if (
                            !state.skills.includes(
                                skill
                            )
                        ) {

                            state.skills.push(
                                skill
                            );

                        }

                    }
                );


                skillInput.value =
                    "";

                renderSkills();

                updatePortfolioPreview();

            }
        );

    }


    /* =====================================================
       EXPERIENCE
    ===================================================== */

    function renderExperience() {

        if (!experienceList) {
            return;
        }


        experienceList.innerHTML =
            "";


        state.experience.forEach(
            (item, index) => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "dynamic-card";


                card.innerHTML = `

                    <div class="dynamic-card-header">

                        <strong>
                            Experience ${index + 1}
                        </strong>

                        <button
                            type="button"
                            class="remove-button"
                        >
                            Remove
                        </button>

                    </div>


                    <div class="form-grid">

                        <div class="form-field">

                            <label>
                                Job title
                            </label>

                            <input
                                type="text"
                                class="experience-title"
                                placeholder="Software Intern"
                                value="${escapeHTML(item.title)}"
                            >

                        </div>


                        <div class="form-field">

                            <label>
                                Company
                            </label>

                            <input
                                type="text"
                                class="experience-company"
                                placeholder="Company Name"
                                value="${escapeHTML(item.company)}"
                            >

                        </div>


                        <div class="form-field">

                            <label>
                                Start date
                            </label>

                            <input
                                type="date"
                                class="experience-start"
                                value="${escapeHTML(item.start)}"
                            >

                        </div>


                        <div class="form-field">

                            <label>
                                End date
                            </label>

                            <input
                                type="date"
                                class="experience-end"
                                value="${escapeHTML(item.end)}"
                            >

                        </div>


                        <div class="form-field full-width">

                            <label>
                                Description
                            </label>

                            <textarea
                                rows="4"
                                class="experience-description"
                                placeholder="Describe what you worked on..."
                            >${escapeHTML(item.description)}</textarea>

                        </div>

                    </div>
                `;


                card.querySelector(
                    ".remove-button"
                ).addEventListener(
                    "click",
                    () => {

                        state.experience.splice(
                            index,
                            1
                        );

                        renderExperience();

                        updatePortfolioPreview();

                    }
                );


                const startDate =
                    card.querySelector(
                        ".experience-start"
                    );

                const endDate =
                    card.querySelector(
                        ".experience-end"
                    );


                /*
                 * End date cannot be before start date.
                 */

                if (startDate && endDate) {

                    startDate.addEventListener(
                        "change",
                        () => {

                            if (
                                startDate.value
                            ) {

                                endDate.min =
                                    startDate.value;

                            }

                            if (
                                endDate.value &&
                                startDate.value &&
                                endDate.value <
                                startDate.value
                            ) {

                                endDate.value =
                                    "";

                                showValidationAlert(
                                    "End date cannot be before the start date.",
                                    endDate
                                );

                            }

                        }
                    );


                    endDate.addEventListener(
                        "change",
                        () => {

                            if (
                                startDate.value &&
                                endDate.value &&
                                endDate.value <
                                startDate.value
                            ) {

                                endDate.value =
                                    "";

                                showValidationAlert(
                                    "End date cannot be before the start date.",
                                    endDate
                                );

                            }

                        }
                    );


                    if (startDate.value) {

                        endDate.min =
                            startDate.value;

                    }

                }


                card.querySelectorAll(
                    "input, textarea"
                ).forEach(
                    input => {

                        input.addEventListener(
                            "input",
                            () => {

                                state.experience[index] =
                                    readExperienceCard(
                                        card
                                    );

                                updatePortfolioPreview();

                            }
                        );

                    }
                );


                experienceList.appendChild(
                    card
                );

            }
        );

    }


    function readExperienceCard(card) {

        return {

            title:
                card.querySelector(
                    ".experience-title"
                )?.value.trim() || "",

            company:
                card.querySelector(
                    ".experience-company"
                )?.value.trim() || "",

            start:
                card.querySelector(
                    ".experience-start"
                )?.value || "",

            end:
                card.querySelector(
                    ".experience-end"
                )?.value || "",

            description:
                card.querySelector(
                    ".experience-description"
                )?.value.trim() || ""

        };

    }


    const addExperienceBtn =
        document.getElementById(
            "addExperienceBtn"
        );


    if (addExperienceBtn) {

        addExperienceBtn.addEventListener(
            "click",
            () => {

                state.experience.push({

                    title: "",
                    company: "",
                    start: "",
                    end: "",
                    description: ""

                });

                renderExperience();

                updatePortfolioPreview();

            }
        );

    }


    /* =====================================================
       PROJECTS
    ===================================================== */

    function renderProjects() {

        if (!projectsList) {
            return;
        }


        projectsList.innerHTML =
            "";


        state.projects.forEach(
            (item, index) => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "dynamic-card";


                card.innerHTML = `

                    <div class="dynamic-card-header">

                        <strong>
                            Project ${index + 1}
                        </strong>

                        <button
                            type="button"
                            class="remove-button"
                        >
                            Remove
                        </button>

                    </div>


                    <div class="form-grid">

                        <div class="form-field full-width">

                            <label>
                                Project name
                            </label>

                            <input
                                type="text"
                                class="project-name"
                                placeholder="Portfolio Generator"
                                value="${escapeHTML(item.name)}"
                            >

                        </div>


                        <div class="form-field">

                            <label>
                                Technologies
                            </label>

                            <input
                                type="text"
                                class="project-tech"
                                placeholder="HTML, CSS, JavaScript"
                                value="${escapeHTML(item.tech)}"
                            >

                        </div>


                        <div class="form-field">

                            <label>
                                Project link
                            </label>

                            <input
                                type="url"
                                class="project-link"
                                placeholder="https://github.com/..."
                                value="${escapeHTML(item.link)}"
                            >

                        </div>


                        <div class="form-field full-width">

                            <label>
                                Description
                            </label>

                            <textarea
                                rows="4"
                                class="project-description"
                                placeholder="Describe your project..."
                            >${escapeHTML(item.description)}</textarea>

                        </div>

                    </div>
                `;


                card.querySelector(
                    ".remove-button"
                ).addEventListener(
                    "click",
                    () => {

                        state.projects.splice(
                            index,
                            1
                        );

                        renderProjects();

                        updatePortfolioPreview();

                    }
                );


                const projectLink =
                    card.querySelector(
                        ".project-link"
                    );


                projectLink.addEventListener(
                    "blur",
                    () => {

                        const value =
                            projectLink.value.trim();

                        if (
                            value &&
                            !isValidURL(value)
                        ) {

                            showValidationAlert(
                                "Please enter a valid HTTPS project URL.",
                                projectLink
                            );

                        }

                    }
                );


                card.querySelectorAll(
                    "input, textarea"
                ).forEach(
                    input => {

                        input.addEventListener(
                            "input",
                            () => {

                                state.projects[index] =
                                    readProjectCard(
                                        card
                                    );

                                updatePortfolioPreview();

                            }
                        );

                    }
                );


                projectsList.appendChild(
                    card
                );

            }
        );

    }


    function readProjectCard(card) {

        return {

            name:
                card.querySelector(
                    ".project-name"
                )?.value.trim() || "",

            tech:
                card.querySelector(
                    ".project-tech"
                )?.value.trim() || "",

            link:
                card.querySelector(
                    ".project-link"
                )?.value.trim() || "",

            description:
                card.querySelector(
                    ".project-description"
                )?.value.trim() || ""

        };

    }


    const addProjectBtn =
        document.getElementById(
            "addProjectBtn"
        );


    if (addProjectBtn) {

        addProjectBtn.addEventListener(
            "click",
            () => {

                state.projects.push({

                    name: "",
                    tech: "",
                    link: "",
                    description: ""

                });

                renderProjects();

                updatePortfolioPreview();

            }
        );

    }


    /* =====================================================
       EDUCATION
    ===================================================== */

    function renderEducation() {

        if (!educationList) {
            return;
        }


        educationList.innerHTML =
            "";


        state.education.forEach(
            (item, index) => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "dynamic-card";


                card.innerHTML = `

                    <div class="dynamic-card-header">

                        <strong>
                            Education ${index + 1}
                        </strong>

                        <button
                            type="button"
                            class="remove-button"
                        >
                            Remove
                        </button>

                    </div>


                    <div class="form-grid">

                        <div class="form-field">

                            <label>
                                Degree
                            </label>

                            <input
                                type="text"
                                class="education-degree"
                                placeholder="B.Tech in Information Technology"
                                value="${escapeHTML(item.degree)}"
                            >

                        </div>


                        <div class="form-field">

                            <label>
                                Institution
                            </label>

                            <input
                                type="text"
                                class="education-institution"
                                placeholder="University / College"
                                value="${escapeHTML(item.institution)}"
                            >

                        </div>


                        <div class="form-field">

                            <label>
                                Start date
                            </label>

                            <input
                                type="date"
                                class="education-start"
                                value="${escapeHTML(item.start)}"
                            >

                        </div>


                        <div class="form-field">

                            <label>
                                End date
                            </label>

                            <input
                                type="date"
                                class="education-end"
                                value="${escapeHTML(item.end)}"
                            >

                        </div>

                    </div>
                `;


                card.querySelector(
                    ".remove-button"
                ).addEventListener(
                    "click",
                    () => {

                        state.education.splice(
                            index,
                            1
                        );

                        renderEducation();

                        updatePortfolioPreview();

                    }
                );


                const startDate =
                    card.querySelector(
                        ".education-start"
                    );

                const endDate =
                    card.querySelector(
                        ".education-end"
                    );


                if (startDate && endDate) {

                    startDate.addEventListener(
                        "change",
                        () => {

                            if (
                                startDate.value
                            ) {

                                endDate.min =
                                    startDate.value;

                            }

                            if (
                                endDate.value &&
                                startDate.value &&
                                endDate.value <
                                startDate.value
                            ) {

                                endDate.value =
                                    "";

                                showValidationAlert(
                                    "End date cannot be before the start date.",
                                    endDate
                                );

                            }

                        }
                    );


                    endDate.addEventListener(
                        "change",
                        () => {

                            if (
                                startDate.value &&
                                endDate.value &&
                                endDate.value <
                                startDate.value
                            ) {

                                endDate.value =
                                    "";

                                showValidationAlert(
                                    "End date cannot be before the start date.",
                                    endDate
                                );

                            }

                        }
                    );


                    if (startDate.value) {

                        endDate.min =
                            startDate.value;

                    }

                }


                card.querySelectorAll(
                    "input"
                ).forEach(
                    input => {

                        input.addEventListener(
                            "input",
                            () => {

                                state.education[index] =
                                    readEducationCard(
                                        card
                                    );

                                updatePortfolioPreview();

                            }
                        );

                    }
                );


                educationList.appendChild(
                    card
                );

            }
        );

    }


    function readEducationCard(card) {

        return {

            degree:
                card.querySelector(
                    ".education-degree"
                )?.value.trim() || "",

            institution:
                card.querySelector(
                    ".education-institution"
                )?.value.trim() || "",

            start:
                card.querySelector(
                    ".education-start"
                )?.value || "",

            end:
                card.querySelector(
                    ".education-end"
                )?.value || ""

        };

    }


    const addEducationBtn =
        document.getElementById(
            "addEducationBtn"
        );


    if (addEducationBtn) {

        addEducationBtn.addEventListener(
            "click",
            () => {

                state.education.push({

                    degree: "",
                    institution: "",
                    start: "",
                    end: ""

                });

                renderEducation();

                updatePortfolioPreview();

            }
        );

    }


    /* =====================================================
       TEMPLATE SELECTION
    ===================================================== */

    const templateButtons =
        document.querySelectorAll(
            ".builder-template"
        );


    function selectTemplate(template) {

        if (
            template !== "modern" &&
            template !== "aurora" &&
            template !== "skyline"
        ) {

            template =
                "modern";

        }


        state.template =
            template;


        templateButtons.forEach(
            button => {

                button.classList.toggle(
                    "selected",
                    button.dataset.template ===
                    template
                );

            }
        );


        if (preview) {

            preview.dataset.template =
                template;

        }


        const previewTemplateName =
            document.getElementById(
                "previewTemplateName"
            );


        if (previewTemplateName) {

            const names = {

                modern: "Modern",
                aurora: "Aurora",
                skyline: "Skyline"

            };


            previewTemplateName.textContent =
                names[template];

        }


        updatePortfolioPreview();

    }


    templateButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    selectTemplate(
                        button.dataset.template
                    );

                }
            );

        }
    );


    /* =====================================================
       DEVICE PREVIEW
    ===================================================== */

    const deviceButtons =
        document.querySelectorAll(
            ".device-button"
        );


    deviceButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    deviceButtons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const device =
                        button.dataset.device;


                    if (preview) {

                        preview.classList.toggle(
                            "mobile",
                            device === "mobile"
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       SAVE DRAFT
    ===================================================== */

    const saveDraftBtn =
        document.getElementById(
            "saveDraftBtn"
        );


    if (saveDraftBtn) {

        saveDraftBtn.addEventListener(
            "click",
            () => {

                if (
                    !validateBasicFields()
                ) {
                    return;
                }


                const data =
                    collectFormData();


                localStorage.setItem(
                    "portfoliogenDraft",
                    JSON.stringify(data)
                );


                saveDraftBtn.textContent =
                    "Saved ✓";


                setTimeout(
                    () => {

                        saveDraftBtn.textContent =
                            "Save Draft";

                    },
                    1500
                );

            }
        );

    }


    /* =====================================================
       CLEAR DRAFT
    ===================================================== */

    const clearDraftBtn =
        document.getElementById(
            "clearDraftBtn"
        );


    if (clearDraftBtn) {

        clearDraftBtn.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Clear all portfolio information?"
                    );


                if (!confirmed) {
                    return;
                }


                localStorage.removeItem(
                    "portfoliogenDraft"
                );

                localStorage.removeItem(
                    "portfoliogenLatest"
                );

                localStorage.removeItem(
                    "portfoliogenPreview"
                );


                window.location.reload();

            }
        );

    }


    /* =====================================================
       NORMALIZE LOADED DATA
    ===================================================== */

    function normalizeExperience(items) {

        if (!Array.isArray(items)) {
            return [];
        }


        return items.map(
            item => ({

                title:
                    String(
                        item?.title || ""
                    ),

                company:
                    String(
                        item?.company || ""
                    ),

                start:
                    String(
                        item?.start || ""
                    ),

                end:
                    String(
                        item?.end || ""
                    ),

                description:
                    String(
                        item?.description || ""
                    )

            })
        );

    }


    function normalizeProjects(items) {

        if (!Array.isArray(items)) {
            return [];
        }


        return items.map(
            item => ({

                name:
                    String(
                        item?.name || ""
                    ),

                tech:
                    String(
                        item?.tech || ""
                    ),

                link:
                    String(
                        item?.link || ""
                    ),

                description:
                    String(
                        item?.description || ""
                    )

            })
        );

    }


    function normalizeEducation(items) {

        if (!Array.isArray(items)) {
            return [];
        }


        return items.map(
            item => ({

                degree:
                    String(
                        item?.degree || ""
                    ),

                institution:
                    String(
                        item?.institution || ""
                    ),

                start:
                    String(
                        item?.start || ""
                    ),

                end:
                    String(
                        item?.end || ""
                    )

            })
        );

    }


    function normalizeSkills(items) {

        if (!Array.isArray(items)) {
            return [];
        }


        return items
            .map(
                skill => {

                    if (
                        typeof skill ===
                        "object" &&
                        skill !== null
                    ) {

                        return String(
                            skill.name ||
                            skill.title ||
                            ""
                        ).trim();

                    }

                    return String(
                        skill
                    ).trim();

                }
            )
            .filter(Boolean);

    }


    /* =====================================================
       LOAD DRAFT
    ===================================================== */

    function loadDraft() {

        const saved =
            localStorage.getItem(
                "portfoliogenDraft"
            );


        if (!saved) {
            return;
        }


        try {

            const data =
                JSON.parse(saved);


            if (fullName) {

                fullName.value =
                    data.fullName || "";

            }


            if (role) {

                role.value =
                    data.role || "";

            }


            if (tagline) {

                tagline.value =
                    data.tagline || "";

            }


            if (locationInput) {

                locationInput.value =
                    data.location || "";

            }


            if (aboutText) {

                aboutText.value =
                    data.aboutText || "";

            }


            if (github) {

                github.value =
                    data.github || "";

            }


            if (linkedin) {

                linkedin.value =
                    data.linkedin || "";

            }


            if (email) {

                email.value =
                    data.email || "";

            }


            state.skills =
                normalizeSkills(
                    data.skills
                );


            state.experience =
                normalizeExperience(
                    data.experience
                );


            state.projects =
                normalizeProjects(
                    data.projects
                );


            state.education =
                normalizeEducation(
                    data.education
                );


            if (
                data.template ===
                "minimal"
            ) {

                state.template =
                    "aurora";

            } else if (
                data.template ===
                "creative"
            ) {

                state.template =
                    "skyline";

            } else if (
                data.template ===
                "modern" ||
                data.template ===
                "aurora" ||
                data.template ===
                "skyline"
            ) {

                state.template =
                    data.template;

            } else {

                state.template =
                    "modern";

            }


        } catch (error) {

            console.error(
                "Could not load saved draft:",
                error
            );

        }

    }


    /* =====================================================
       SAFE FILE NAME
    ===================================================== */

    function safeFileName(name) {

        const cleaned =
            String(
                name ||
                "portfolio"
            )
                .trim()
                .replace(
                    /[^a-z0-9]+/gi,
                    "-"
                )
                .replace(
                    /^-+|-+$/g,
                    ""
                );


        return (
            cleaned ||
            "portfolio"
        );

    }


    /* =====================================================
       CREATE PORTFOLIO HTML
    ===================================================== */

    function createPortfolioHTML(data) {

        const renderer =
            document.createElement(
                "div"
            );


        renderer.id =
            "portfolioExport";


        renderer.style.position =
            "absolute";

        renderer.style.left =
            "-100000px";

        renderer.style.top =
            "0";

        renderer.style.width =
            "1200px";


        document.body.appendChild(
            renderer
        );


        const oldPreview =
            document.getElementById(
                "portfolioPreview"
            );


        const previousPreview =
            oldPreview;


        if (
            typeof PortfolioRenderer ===
            "undefined"
        ) {

            renderer.remove();

            throw new Error(
                "PortfolioRenderer is not available."
            );

        }


        if (previousPreview) {

            previousPreview.id =
                "portfolioPreviewOriginal";

        }


        renderer.id =
            "portfolioPreview";


        PortfolioRenderer.render(
            data
        );


        const generated =
            renderer.innerHTML;


        renderer.remove();


        if (previousPreview) {

            previousPreview.id =
                "portfolioPreview";

        }


        return generated;

    }


    /* =====================================================
       GET TEMPLATE CSS
    ===================================================== */

    function getTemplateCSS(template) {

        const cssFiles = {

            modern:
                "css/templates/modern.css",

            aurora:
                "css/templates/aurora.css",

            skyline:
                "css/templates/skyline.css"

        };


        const cssFile =
            cssFiles[template] ||
            cssFiles.modern;


        return fetch(cssFile)
            .then(
                response => {

                    if (!response.ok) {

                        throw new Error(
                            `Could not load ${cssFile}`
                        );

                    }

                    return response.text();

                }
            );

    }


    /* =====================================================
       CREATE EXPORT HTML
    ===================================================== */

    function createExportHTML(
        data,
        portfolioHTML,
        templateCSS
    ) {

        const title =
            escapeHTML(
                data.fullName ||
                "Portfolio"
            );


        return `<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        ${title} — Portfolio
    </title>

    <style>

        ${templateCSS}

        * {
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            margin: 0;
            padding: 0;
        }

        img {
            max-width: 100%;
        }

        a {
            color: inherit;
        }

    </style>

</head>

<body>

    ${portfolioHTML}

</body>

</html>`;

    }


    /* =====================================================
       CREATE DATA FILE
    ===================================================== */

    function createDataFile(data) {

        return JSON.stringify(
            data,
            null,
            4
        );

    }


    /* =====================================================
       CREATE README
    ===================================================== */

    function createReadme(data) {

        return `PORTFOLIOGEN
================

Portfolio generated with PortfolioGen.

Name:
${data.fullName || "Not provided"}

Role:
${data.role || "Not provided"}

Template:
${data.template || "modern"}

Files:

- index.html
- css/style.css
- data/portfolio.json
- README.txt

HOW TO USE
==========

1. Extract this ZIP file.
2. Open index.html in your browser.

The portfolio is a static website and does not require
a backend server to open locally.

Generated by PortfolioGen.
`;

    }


    /* =====================================================
       DOWNLOAD ZIP
    ===================================================== */

    async function downloadPortfolioZIP() {

        if (
            !validateBasicFields()
        ) {
            return;
        }


        if (
            typeof JSZip ===
            "undefined"
        ) {

            alert(
                "ZIP library could not be loaded. Please check your internet connection and reload the page."
            );

            return;

        }


        const data =
            collectFormData();


        /*
         * Validate project URLs
         */

        for (
            let i = 0;
            i < data.projects.length;
            i++
        ) {

            const link =
                data.projects[i].link;

            if (
                link &&
                !isValidURL(link)
            ) {

                alert(
                    `Project ${i + 1}: Please enter a valid HTTPS project URL.`
                );

                return;

            }

        }


        /*
         * Validate experience dates.
         */

        for (
            let i = 0;
            i < data.experience.length;
            i++
        ) {

            const item =
                data.experience[i];

            if (
                item.start &&
                item.end &&
                item.end < item.start
            ) {

                alert(
                    `Experience ${i + 1}: End date cannot be before start date.`
                );

                return;

            }

        }


        /*
         * Validate education dates.
         */

        for (
            let i = 0;
            i < data.education.length;
            i++
        ) {

            const item =
                data.education[i];

            if (
                item.start &&
                item.end &&
                item.end < item.start
            ) {

                alert(
                    `Education ${i + 1}: End date cannot be before start date.`
                );

                return;

            }

        }


        const originalText =
            downloadBtn?.textContent;


        try {

            if (downloadBtn) {

                downloadBtn.disabled =
                    true;

                downloadBtn.textContent =
                    "Preparing...";

            }


            localStorage.setItem(
                "portfoliogenLatest",
                JSON.stringify(data)
            );


            if (downloadBtn) {

                downloadBtn.textContent =
                    "Building portfolio...";

            }


            const portfolioHTML =
                createPortfolioHTML(
                    data
                );


            if (downloadBtn) {

                downloadBtn.textContent =
                    "Loading design...";

            }


            const templateCSS =
                await getTemplateCSS(
                    data.template
                );


            if (downloadBtn) {

                downloadBtn.textContent =
                    "Creating ZIP...";

            }


            const finalHTML =
                createExportHTML(
                    data,
                    portfolioHTML,
                    templateCSS
                );


            const zip =
                new JSZip();


            const root =
                zip.folder(
                    safeFileName(
                        data.fullName
                    )
                );


            root.file(
                "index.html",
                finalHTML
            );


            root.folder("css")
                .file(
                    "style.css",
                    templateCSS
                );


            root.folder("data")
                .file(
                    "portfolio.json",
                    createDataFile(
                        data
                    )
                );


            root.file(
                "README.txt",
                createReadme(
                    data
                )
            );


            const zipBlob =
                await zip.generateAsync(
                    {
                        type: "blob",
                        compression: "DEFLATE",
                        compressionOptions: {
                            level: 6
                        }
                    }
                );


            const url =
                URL.createObjectURL(
                    zipBlob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                `${safeFileName(
                    data.fullName
                )}-portfolio.zip`;


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            setTimeout(
                () => {

                    URL.revokeObjectURL(
                        url
                    );

                },
                1000
            );


            if (downloadBtn) {

                downloadBtn.textContent =
                    "Downloaded ✓";

            }


            setTimeout(
                () => {

                    if (downloadBtn) {

                        downloadBtn.textContent =
                            originalText ||
                            "Download ZIP";

                        downloadBtn.disabled =
                            false;

                    }

                },
                2000
            );


        } catch (error) {

            console.error(
                "Portfolio ZIP generation failed:",
                error
            );


            alert(
                "Could not generate the portfolio ZIP. Please check the browser console for details."
            );


            if (downloadBtn) {

                downloadBtn.textContent =
                    originalText ||
                    "Download ZIP";

                downloadBtn.disabled =
                    false;

            }

        }

    }


    if (downloadBtn) {

        downloadBtn.addEventListener(
            "click",
            downloadPortfolioZIP
        );

    }


    /* =====================================================
       PREVIEW WEBSITE
    ===================================================== */

    const previewWebsiteBtn =
        document.getElementById(
            "previewWebsiteBtn"
        );


    if (previewWebsiteBtn) {

        previewWebsiteBtn.addEventListener(
            "click",
            () => {

                if (
                    !validateBasicFields()
                ) {
                    return;
                }


                const data =
                    collectFormData();


                localStorage.setItem(
                    "portfoliogenPreview",
                    JSON.stringify(data)
                );


                window.open(
                    "portfolio-preview.html",
                    "_blank"
                );

            }
        );

    }


    /* =====================================================
       CONTINUE / FINISH VALIDATION
    ===================================================== */

    if (continueBtn) {

        continueBtn.addEventListener(
            "click",
            () => {

                /*
                 * Validate current basic fields
                 * before moving forward.
                 */

                if (
                    !validateBasicFields()
                ) {
                    return;
                }


                /*
                 * Validate current project URLs.
                 */

                for (
                    let i = 0;
                    i < state.projects.length;
                    i++
                ) {

                    const link =
                        state.projects[i].link;

                    if (
                        link &&
                        !isValidURL(link)
                    ) {

                        showValidationAlert(
                            `Project ${i + 1}: Please enter a valid HTTPS project URL.`
                        );

                        return;

                    }

                }


                /*
                 * Validate dates.
                 */

                for (
                    let i = 0;
                    i < state.experience.length;
                    i++
                ) {

                    const item =
                        state.experience[i];

                    if (
                        item.start &&
                        item.end &&
                        item.end < item.start
                    ) {

                        showValidationAlert(
                            `Experience ${i + 1}: End date cannot be before start date.`
                        );

                        return;

                    }

                }


                for (
                    let i = 0;
                    i < state.education.length;
                    i++
                ) {

                    const item =
                        state.education[i];

                    if (
                        item.start &&
                        item.end &&
                        item.end < item.start
                    ) {

                        showValidationAlert(
                            `Education ${i + 1}: End date cannot be before start date.`
                        );

                        return;

                    }

                }


                if (
                    state.currentSection <
                    sections.length - 1
                ) {

                    showSection(
                        state.currentSection + 1
                    );

                } else {

                    updatePortfolioPreview();

                    alert(
                        "Your portfolio is ready!"
                    );

                }

            }
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    loadDraft();

    renderSkills();

    renderExperience();

    renderProjects();

    renderEducation();

    selectTemplate(
        state.template
    );

    showSection(0);

    updatePortfolioPreview();


    console.log(
        "PortfolioGen Builder initialized",
        {
            skills: state.skills,
            experience: state.experience,
            projects: state.projects,
            education: state.education,
            template: state.template
        }
    );

});

