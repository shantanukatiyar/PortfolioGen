
/* =========================================================
   PORTFOLIOGEN — TEMPLATE RENDERER
   ========================================================= */

const PortfolioRenderer = (() => {

    /* =====================================================
       DEFAULT DATA
       ===================================================== */

    const defaultData = {
        fullName: "Your Name",
        role: "Your Role",
        tagline: "Building digital experiences that matter.",
        location: "",
        aboutText:
            "Tell visitors about yourself, your experience and what you are passionate about.",

        skills: [],
        experience: [],
        projects: [],
        education: [],

        github: "",
        linkedin: "",
        email: "",

        template: "modern"
    };


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        if (value === null || value === undefined) {
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
       NORMALIZE DATA
       Handles both:
       ["HTML", "CSS"]
       and
       [{name:"HTML"}, {name:"CSS"}]
       ===================================================== */

    function normalizeSkills(skills) {

        if (!Array.isArray(skills)) {
            return [];
        }

        return skills
            .map(skill => {

                if (typeof skill === "string") {
                    return skill.trim();
                }

                if (skill && typeof skill === "object") {

                    return String(
                        skill.name ||
                        skill.skill ||
                        skill.title ||
                        skill.value ||
                        ""
                    ).trim();
                }

                return "";
            })
            .filter(Boolean);
    }


    function normalizeProjects(projects) {

        if (!Array.isArray(projects)) {
            return [];
        }

        return projects
            .filter(project => project && typeof project === "object")
            .map(project => ({
                name:
                    project.name ||
                    project.title ||
                    "",

                description:
                    project.description ||
                    project.desc ||
                    "",

                tech:
                    project.tech ||
                    project.technologies ||
                    project.technology ||
                    "",

                link:
                    project.link ||
                    project.url ||
                    project.github ||
                    ""
            }));
    }


    function normalizeExperience(experience) {

        if (!Array.isArray(experience)) {
            return [];
        }

        return experience
            .filter(item => item && typeof item === "object")
            .map(item => ({
                start:
                    item.start ||
                    item.startDate ||
                    item.from ||
                    "",

                end:
                    item.end ||
                    item.endDate ||
                    item.to ||
                    "",

                title:
                    item.title ||
                    item.role ||
                    item.position ||
                    "",

                company:
                    item.company ||
                    item.organization ||
                    item.organisation ||
                    "",

                description:
                    item.description ||
                    item.details ||
                    item.desc ||
                    ""
            }));
    }


    function normalizeEducation(education) {

        if (!Array.isArray(education)) {
            return [];
        }

        return education
            .filter(item => item && typeof item === "object")
            .map(item => ({
                start:
                    item.start ||
                    item.startDate ||
                    item.from ||
                    "",

                end:
                    item.end ||
                    item.endDate ||
                    item.to ||
                    "",

                degree:
                    item.degree ||
                    item.course ||
                    item.program ||
                    item.title ||
                    "",

                institution:
                    item.institution ||
                    item.college ||
                    item.university ||
                    item.school ||
                    ""
            }));
    }


    /* =====================================================
       NORMALIZE COMPLETE DATA
       ===================================================== */

    function normalizeData(data) {

        const source =
            data && typeof data === "object"
                ? data
                : {};

        return {

            ...defaultData,

            ...source,

            fullName:
                source.fullName ||
                source.name ||
                defaultData.fullName,

            role:
                source.role ||
                source.title ||
                defaultData.role,

            tagline:
                source.tagline ||
                source.bio ||
                defaultData.tagline,

            location:
                source.location ||
                "",

            aboutText:
                source.aboutText ||
                source.about ||
                source.summary ||
                defaultData.aboutText,

            skills:
                normalizeSkills(source.skills),

            projects:
                normalizeProjects(source.projects),

            experience:
                normalizeExperience(source.experience),

            education:
                normalizeEducation(source.education),

            github:
                source.github ||
                source.githubUrl ||
                "",

            linkedin:
                source.linkedin ||
                source.linkedinUrl ||
                "",

            email:
                source.email ||
                "",

            template:
                source.template ||
                defaultData.template
        };
    }


    /* =====================================================
       GENERIC SKILLS
       ===================================================== */

    function renderSkills(skills) {

        const normalizedSkills =
            normalizeSkills(skills);

        if (normalizedSkills.length === 0) {

            return `
                <span class="portfolio-empty">
                    Add your skills
                </span>
            `;
        }

        return normalizedSkills
            .map(skill => `
                <span class="portfolio-skill">
                    ${escapeHTML(skill)}
                </span>
            `)
            .join("");
    }


    /* =====================================================
       GENERIC PROJECTS
       ===================================================== */

    function renderProjects(projects) {

        const normalizedProjects =
            normalizeProjects(projects);

        if (normalizedProjects.length === 0) {

            return `
                <div class="portfolio-empty-card">
                    <span>
                        Your projects will appear here.
                    </span>
                </div>
            `;
        }

        return normalizedProjects
            .map((project, index) => {

                const link =
                    project.link
                        ? `
                            <a
                                href="${escapeHTML(project.link)}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View project →
                            </a>
                        `
                        : "";

                return `
                    <article class="portfolio-project">

                        <div class="project-number">
                            ${String(index + 1).padStart(2, "0")}
                        </div>

                        <div class="project-content">

                            <h3>
                                ${
                                    escapeHTML(project.name) ||
                                    "Untitled Project"
                                }
                            </h3>

                            <p>
                                ${
                                    escapeHTML(project.description) ||
                                    "Add a description for your project."
                                }
                            </p>

                            ${
                                project.tech
                                    ? `
                                        <div class="project-tech">
                                            ${escapeHTML(project.tech)}
                                        </div>
                                    `
                                    : ""
                            }

                            ${link}

                        </div>

                    </article>
                `;
            })
            .join("");
    }


    /* =====================================================
       GENERIC EXPERIENCE
       ===================================================== */

    function renderExperience(experience) {

        const normalizedExperience =
            normalizeExperience(experience);

        if (normalizedExperience.length === 0) {

            return `
                <div class="portfolio-empty-card">
                    <span>
                        Add your professional experience.
                    </span>
                </div>
            `;
        }

        return normalizedExperience
            .map(item => `

                <article class="portfolio-experience">

                    <div class="experience-period">

                        <span>
                            ${escapeHTML(item.start)}
                        </span>

                        ${
                            item.start || item.end
                                ? `<span>—</span>`
                                : ""
                        }

                        <span>
                            ${escapeHTML(item.end)}
                        </span>

                    </div>

                    <div class="experience-content">

                        <h3>
                            ${
                                escapeHTML(item.title) ||
                                "Job Title"
                            }
                        </h3>

                        <strong>
                            ${
                                escapeHTML(item.company) ||
                                "Company"
                            }
                        </strong>

                        <p>
                            ${
                                escapeHTML(item.description) ||
                                "Add details about your experience."
                            }
                        </p>

                    </div>

                </article>

            `)
            .join("");
    }


    /* =====================================================
       GENERIC EDUCATION
       ===================================================== */

    function renderEducation(education) {

        const normalizedEducation =
            normalizeEducation(education);

        if (normalizedEducation.length === 0) {

            return `
                <div class="portfolio-empty-card">
                    <span>
                        Add your education.
                    </span>
                </div>
            `;
        }

        return normalizedEducation
            .map(item => `

                <article class="portfolio-education">

                    <div class="education-period">

                        ${escapeHTML(item.start)}

                        ${
                            item.start || item.end
                                ? " — "
                                : ""
                        }

                        ${escapeHTML(item.end)}

                    </div>

                    <div>

                        <h3>
                            ${
                                escapeHTML(item.degree) ||
                                "Degree"
                            }
                        </h3>

                        <p>
                            ${
                                escapeHTML(item.institution) ||
                                "Institution"
                            }
                        </p>

                    </div>

                </article>

            `)
            .join("");
    }


    /* =====================================================
       SOCIAL LINKS
       ===================================================== */

    function renderSocialLinks(data) {

        const links = [];

        if (data.github) {

            links.push(`
                <a
                    href="${escapeHTML(data.github)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </a>
            `);
        }

        if (data.linkedin) {

            links.push(`
                <a
                    href="${escapeHTML(data.linkedin)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    LinkedIn
                </a>
            `);
        }

        if (data.email) {

            links.push(`
                <a href="mailto:${escapeHTML(data.email)}">
                    Email
                </a>
            `);
        }

        return links.join("");
    }


    /* =====================================================
       MODERN TEMPLATE
       ===================================================== */

    function modernTemplate(data) {

        return `

            <div class="portfolio-template modern-template">

                <nav class="portfolio-nav">

                    <a href="#home" class="portfolio-logo">
                        ${escapeHTML(data.fullName) || "Your Name"}
                    </a>

                    <div class="portfolio-nav-links">

                        <a href="#about">About</a>
                        <a href="#projects">Projects</a>
                        <a href="#experience">Experience</a>
                        <a href="#contact">Contact</a>

                    </div>

                </nav>


                <section
                    class="portfolio-hero"
                    id="home"
                >

                    <span class="hero-eyebrow">
                        ${escapeHTML(data.role) || "YOUR ROLE"}
                    </span>

                    <h1>
                        Hi, I'm
                        <span>
                            ${escapeHTML(data.fullName) || "Your Name"}
                        </span>
                    </h1>

                    <p class="hero-tagline">
                        ${escapeHTML(data.tagline)}
                    </p>

                    ${
                        data.location
                            ? `
                                <span class="hero-location">
                                    ${escapeHTML(data.location)}
                                </span>
                            `
                            : ""
                    }

                    <div class="hero-actions">

                        <a
                            href="#projects"
                            class="primary-button"
                        >
                            View My Work
                        </a>

                        <a
                            href="#contact"
                            class="secondary-button"
                        >
                            Contact Me
                        </a>

                    </div>

                </section>


                <section
                    class="portfolio-section"
                    id="about"
                >

                    <div class="section-heading">
                        <span>01</span>
                        <h2>About</h2>
                    </div>

                    <div class="about-content">

                        <p>
                            ${escapeHTML(data.aboutText)}
                        </p>

                    </div>

                </section>


                <section class="portfolio-section">

                    <div class="section-heading">
                        <span>02</span>
                        <h2>Skills</h2>
                    </div>

                    <div class="portfolio-skills">

                        ${renderSkills(data.skills)}

                    </div>

                </section>


                <section
                    class="portfolio-section"
                    id="projects"
                >

                    <div class="section-heading">
                        <span>03</span>
                        <h2>Selected Work</h2>
                    </div>

                    <div class="portfolio-projects">

                        ${renderProjects(data.projects)}

                    </div>

                </section>


                <section
                    class="portfolio-section"
                    id="experience"
                >

                    <div class="section-heading">
                        <span>04</span>
                        <h2>Experience</h2>
                    </div>

                    <div class="portfolio-experience-list">

                        ${renderExperience(data.experience)}

                    </div>

                </section>


                <section class="portfolio-section">

                    <div class="section-heading">
                        <span>05</span>
                        <h2>Education</h2>
                    </div>

                    <div class="portfolio-education-list">

                        ${renderEducation(data.education)}

                    </div>

                </section>


                <section
                    class="portfolio-contact"
                    id="contact"
                >

                    <span>LET'S CONNECT</span>

                    <h2>
                        Have a project in mind?
                    </h2>

                    <p>
                        Let's build something meaningful together.
                    </p>

                    <div class="portfolio-social-links">

                        ${renderSocialLinks(data)}

                    </div>

                </section>


                <footer class="portfolio-footer">

                    <span>
                        © ${new Date().getFullYear()}
                        ${escapeHTML(data.fullName) || "Your Name"}
                    </span>

                    <span>
                        Built with PortfolioGen
                    </span>

                </footer>

            </div>

        `;
    }


    /* =====================================================
       AURORA TEMPLATE
       ===================================================== */

    function auroraTemplate(data) {

        const fullName =
            String(data.fullName || "Your Name").trim();

        const nameParts =
            fullName.split(/\s+/);

        const firstName =
            nameParts.length > 1
                ? nameParts.slice(0, -1).join(" ")
                : fullName;

        const lastName =
            nameParts.length > 1
                ? nameParts[nameParts.length - 1]
                : "";

        const skills =
            normalizeSkills(data.skills);

        const projects =
            normalizeProjects(data.projects);

        const experience =
            normalizeExperience(data.experience);

        const education =
            normalizeEducation(data.education);


        return `

            <div class="portfolio-template aurora-template">

                <!-- TOP NAVIGATION -->

                <header class="aurora-topbar">

                    <a
                        href="#aurora-home"
                        class="aurora-brand"
                    >

                        <span class="aurora-brand-mark">
                            ${escapeHTML(firstName.charAt(0))}
                        </span>

                        <span>
                            ${escapeHTML(fullName)}
                        </span>

                    </a>

                    <nav class="aurora-top-links">

                        <a href="#aurora-about">About</a>
                        <a href="#aurora-skills">Skills</a>
                        <a href="#aurora-projects">Projects</a>
                        <a href="#aurora-experience">Experience</a>
                        <a href="#aurora-contact">Contact</a>

                    </nav>

                </header>


                <!-- HERO -->

                <section
                    class="aurora-intro"
                    id="aurora-home"
                >

                    <div class="aurora-intro-content">

                        <span class="aurora-label">
                            ${escapeHTML(data.role) || "YOUR ROLE"}
                        </span>

                        <h1 class="aurora-name">

                            <span class="aurora-name-first">
                                ${escapeHTML(firstName)}
                            </span>

                            ${
                                lastName
                                    ? `
                                        <span class="aurora-name-last">
                                            ${escapeHTML(lastName)}
                                        </span>
                                    `
                                    : ""
                            }

                        </h1>

                        <p class="aurora-tagline">
                            ${escapeHTML(data.tagline)}
                        </p>

                        ${
                            data.location
                                ? `
                                    <div class="aurora-location">
                                        <span>●</span>
                                        ${escapeHTML(data.location)}
                                    </div>
                                `
                                : ""
                        }

                        <div class="aurora-actions">

                            <a
                                href="#aurora-projects"
                                class="aurora-main-button"
                            >
                                View My Work
                                <span>↗</span>
                            </a>

                            <a
                                href="#aurora-contact"
                                class="aurora-text-button"
                            >
                                Contact Me
                            </a>

                        </div>

                    </div>

                    <div class="aurora-intro-side">

                        <div class="aurora-side-line"></div>

                        <span class="aurora-side-number">
                            01
                        </span>

                    </div>

                </section>


                <!-- ABOUT -->

                <section
                    class="aurora-about"
                    id="aurora-about"
                >

                    <div class="aurora-section-number">
                        01
                    </div>

                    <div class="aurora-about-title">

                        <span>ABOUT</span>

                        <h2>
                            A little<br>
                            about me.
                        </h2>

                    </div>

                    <div class="aurora-about-content">

                        <p>
                            ${escapeHTML(data.aboutText)}
                        </p>

                        ${
                            data.email
                                ? `
                                    <a
                                        href="mailto:${escapeHTML(data.email)}"
                                        class="aurora-email"
                                    >
                                        ${escapeHTML(data.email)}
                                        <span>↗</span>
                                    </a>
                                `
                                : ""
                        }

                    </div>

                </section>


                <!-- SKILLS -->

                <section
                    class="aurora-skills-section"
                    id="aurora-skills"
                >

                    <div class="aurora-section-heading">

                        <div>

                            <span>02</span>

                            <h2>
                                Skills
                            </h2>

                        </div>

                        <p>
                            Technologies and tools I work with.
                        </p>

                    </div>


                    <div class="aurora-skill-grid">

                        ${
                            skills.length
                                ? skills
                                    .map((skill, index) => `

                                        <div
                                            class="aurora-skill-card"
                                        >

                                            <span>
                                                ${String(
                                                    index + 1
                                                ).padStart(2, "0")}
                                            </span>

                                            <strong>
                                                ${escapeHTML(skill)}
                                            </strong>

                                        </div>

                                    `)
                                    .join("")
                                : `
                                    <div class="aurora-empty">
                                        Add your skills
                                    </div>
                                `
                        }

                    </div>

                </section>


                <!-- PROJECTS -->

                <section
                    class="aurora-project-section"
                    id="aurora-projects"
                >

                    <div class="aurora-section-heading">

                        <div>

                            <span>03</span>

                            <h2>
                                Projects
                            </h2>

                        </div>

                        <p>
                            Selected work and projects.
                        </p>

                    </div>


                    <div class="aurora-project-grid">

                        ${
                            projects.length
                                ? projects
                                    .map((project, index) => {

                                        const link =
                                            project.link
                                                ? `
                                                    <a
                                                        href="${escapeHTML(project.link)}"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View project ↗
                                                    </a>
                                                `
                                                : "";

                                        return `

                                            <article
                                                class="aurora-project-card"
                                            >

                                                <div
                                                    class="aurora-project-top"
                                                >

                                                    <span>
                                                        ${String(
                                                            index + 1
                                                        ).padStart(2, "0")}
                                                    </span>

                                                    ${
                                                        project.tech
                                                            ? `
                                                                <small>
                                                                    ${escapeHTML(
                                                                        project.tech
                                                                    )}
                                                                </small>
                                                            `
                                                            : ""
                                                    }

                                                </div>

                                                <h3>
                                                    ${
                                                        escapeHTML(
                                                            project.name
                                                        ) ||
                                                        "Untitled Project"
                                                    }
                                                </h3>

                                                <p>
                                                    ${
                                                        escapeHTML(
                                                            project.description
                                                        ) ||
                                                        "Add a description for your project."
                                                    }
                                                </p>

                                                ${link}

                                            </article>

                                        `;
                                    })
                                    .join("")
                                : `
                                    <div class="aurora-empty">
                                        Your projects will appear here.
                                    </div>
                                `
                        }

                    </div>

                </section>


                <!-- EXPERIENCE -->

                <section
                    class="aurora-experience-section"
                    id="aurora-experience"
                >

                    <div class="aurora-section-number">
                        04
                    </div>

                    <div>

                        <div class="aurora-experience-heading">

                            <span>
                                EXPERIENCE
                            </span>

                            <h2>
                                Experience
                            </h2>

                        </div>


                        <div class="aurora-timeline">

                            ${
                                experience.length
                                    ? experience
                                        .map(item => `

                                            <article
                                                class="aurora-experience-item"
                                            >

                                                <div
                                                    class="aurora-experience-date"
                                                >

                                                    ${escapeHTML(
                                                        item.start
                                                    )}

                                                    ${
                                                        item.start ||
                                                        item.end
                                                            ? " — "
                                                            : ""
                                                    }

                                                    ${escapeHTML(
                                                        item.end
                                                    )}

                                                </div>


                                                <div
                                                    class="aurora-experience-info"
                                                >

                                                    <h3>
                                                        ${
                                                            escapeHTML(
                                                                item.title
                                                            ) ||
                                                            "Job Title"
                                                        }
                                                    </h3>

                                                    <strong>
                                                        ${
                                                            escapeHTML(
                                                                item.company
                                                            ) ||
                                                            "Company"
                                                        }
                                                    </strong>

                                                    <p>
                                                        ${
                                                            escapeHTML(
                                                                item.description
                                                            ) ||
                                                            "Add details about your experience."
                                                        }
                                                    </p>

                                                </div>

                                            </article>

                                        `)
                                        .join("")
                                    : `
                                        <div class="aurora-empty">
                                            Add your professional experience.
                                        </div>
                                    `
                            }

                        </div>

                    </div>

                </section>


                <!-- EDUCATION -->

                <section
                    class="aurora-education-section"
                >

                    <div class="aurora-section-number">
                        05
                    </div>

                    <div class="aurora-education-wrapper">

                        <div>

                            <span class="aurora-small-label">
                                EDUCATION
                            </span>

                            <h2>
                                Education
                            </h2>

                        </div>


                        <div class="aurora-education-list">

                            ${
                                education.length
                                    ? education
                                        .map(item => `

                                            <article
                                                class="aurora-education-item"
                                            >

                                                <div>

                                                    ${escapeHTML(
                                                        item.start
                                                    )}

                                                    ${
                                                        item.start ||
                                                        item.end
                                                            ? " — "
                                                            : ""
                                                    }

                                                    ${escapeHTML(
                                                        item.end
                                                    )}

                                                </div>


                                                <div>

                                                    <h3>
                                                        ${
                                                            escapeHTML(
                                                                item.degree
                                                            ) ||
                                                            "Degree"
                                                        }
                                                    </h3>

                                                    <p>
                                                        ${
                                                            escapeHTML(
                                                                item.institution
                                                            ) ||
                                                            "Institution"
                                                        }
                                                    </p>

                                                </div>

                                            </article>

                                        `)
                                        .join("")
                                    : `
                                        <div class="aurora-empty">
                                            Add your education.
                                        </div>
                                    `
                            }

                        </div>

                    </div>

                </section>


                <!-- CONTACT -->

                <section
                    class="aurora-contact"
                    id="aurora-contact"
                >

                    <div class="aurora-contact-inner">

                        <span>
                            LET'S CONNECT
                        </span>

                        <h2>
                            Let's build<br>
                            something meaningful.
                        </h2>

                        ${
                            data.email
                                ? `
                                    <a
                                        href="mailto:${escapeHTML(data.email)}"
                                        class="aurora-contact-button"
                                    >
                                        ${escapeHTML(data.email)}
                                        <span>↗</span>
                                    </a>
                                `
                                : ""
                        }


                        <div class="aurora-contact-socials">

                            ${
                                data.github
                                    ? `
                                        <a
                                            href="${escapeHTML(data.github)}"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            GitHub
                                        </a>
                                    `
                                    : ""
                            }

                            ${
                                data.linkedin
                                    ? `
                                        <a
                                            href="${escapeHTML(data.linkedin)}"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            LinkedIn
                                        </a>
                                    `
                                    : ""
                            }

                        </div>

                    </div>

                </section>


                <!-- FOOTER -->

                <footer class="aurora-footer">

                    <span>
                        © ${new Date().getFullYear()}
                        ${escapeHTML(fullName)}
                    </span>

                    <span>
                        Built with PortfolioGen
                    </span>

                </footer>

            </div>

        `;
    }


    /* =====================================================
       SKYLINE TEMPLATE
       ===================================================== */

    function skylineTemplate(data) {

        return `

            <div class="portfolio-template skyline-template">

                <nav class="portfolio-nav">

                    <a
                        href="#home"
                        class="portfolio-logo"
                    >
                        ${escapeHTML(data.fullName) || "Your Name"}
                    </a>

                    <div class="portfolio-nav-links">

                        <a href="#about">About</a>
                        <a href="#projects">Projects</a>
                        <a href="#experience">Experience</a>
                        <a href="#contact">Contact</a>

                    </div>

                </nav>


                <section
                    class="portfolio-hero"
                    id="home"
                >

                    <span class="hero-eyebrow">
                        ${escapeHTML(data.role) || "YOUR ROLE"}
                    </span>

                    <h1>

                        Hi, I'm

                        <span>
                            ${escapeHTML(data.fullName) || "Your Name"}
                        </span>

                    </h1>

                    <p class="hero-tagline">
                        ${escapeHTML(data.tagline)}
                    </p>

                    ${
                        data.location
                            ? `
                                <span class="hero-location">
                                    ${escapeHTML(data.location)}
                                </span>
                            `
                            : ""
                    }

                    <div class="hero-actions">

                        <a
                            href="#projects"
                            class="primary-button"
                        >
                            View My Work
                        </a>

                        <a
                            href="#contact"
                            class="secondary-button"
                        >
                            Contact Me
                        </a>

                    </div>

                </section>


                <section
                    class="portfolio-section"
                    id="about"
                >

                    <div class="section-heading">
                        <span>01</span>
                        <h2>About</h2>
                    </div>

                    <div class="about-content">

                        <p>
                            ${escapeHTML(data.aboutText)}
                        </p>

                    </div>

                </section>


                <section class="portfolio-section">

                    <div class="section-heading">
                        <span>02</span>
                        <h2>Skills</h2>
                    </div>

                    <div class="portfolio-skills">

                        ${renderSkills(data.skills)}

                    </div>

                </section>


                <section
                    class="portfolio-section"
                    id="projects"
                >

                    <div class="section-heading">
                        <span>03</span>
                        <h2>Selected Work</h2>
                    </div>

                    <div class="portfolio-projects">

                        ${renderProjects(data.projects)}

                    </div>

                </section>


                <section
                    class="portfolio-section"
                    id="experience"
                >

                    <div class="section-heading">
                        <span>04</span>
                        <h2>Experience</h2>
                    </div>

                    <div class="portfolio-experience-list">

                        ${renderExperience(data.experience)}

                    </div>

                </section>


                <section class="portfolio-section">

                    <div class="section-heading">
                        <span>05</span>
                        <h2>Education</h2>
                    </div>

                    <div class="portfolio-education-list">

                        ${renderEducation(data.education)}

                    </div>

                </section>


                <section
                    class="portfolio-contact"
                    id="contact"
                >

                    <span>
                        LET'S CONNECT
                    </span>

                    <h2>
                        Have a project in mind?
                    </h2>

                    <p>
                        Let's build something meaningful together.
                    </p>

                    <div class="portfolio-social-links">

                        ${renderSocialLinks(data)}

                    </div>

                </section>


                <footer class="portfolio-footer">

                    <span>

                        © ${new Date().getFullYear()}

                        ${escapeHTML(data.fullName) || "Your Name"}

                    </span>

                    <span>
                        Built with PortfolioGen
                    </span>

                </footer>

            </div>

        `;
    }


    /* =====================================================
       MAIN RENDER
       ===================================================== */

    function render(data = {}) {

        const portfolio =
            document.getElementById("portfolioPreview");

        if (!portfolio) {
            console.error(
                "PortfolioRenderer: #portfolioPreview not found."
            );
            return;
        }


        /* -----------------------------------------------
           Normalize everything before rendering
           ----------------------------------------------- */

        const mergedData =
            normalizeData(data);


        /* -----------------------------------------------
           Render selected template
           ----------------------------------------------- */

        let html;

        switch (mergedData.template) {

            case "aurora":

                html =
                    auroraTemplate(
                        mergedData
                    );

                break;


            case "skyline":

                html =
                    skylineTemplate(
                        mergedData
                    );

                break;


            case "modern":

            default:

                html =
                    modernTemplate(
                        mergedData
                    );

                break;
        }


        /* -----------------------------------------------
           Update preview
           ----------------------------------------------- */

        portfolio.innerHTML =
            html;


        /* -----------------------------------------------
           Store selected template
           ----------------------------------------------- */

        portfolio.dataset.template =
            mergedData.template;


        /* -----------------------------------------------
           Apply template class
           ----------------------------------------------- */

        portfolio.classList.remove(
            "template-modern",
            "template-aurora",
            "template-skyline"
        );

        portfolio.classList.add(
            `template-${mergedData.template}`
        );


        /* -----------------------------------------------
           Debug information
           ----------------------------------------------- */

        console.log(
            "Portfolio rendered successfully:",
            mergedData
        );
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    return {

        render,

        getDefaultData() {

            return {
                ...defaultData,
                skills: [],
                experience: [],
                projects: [],
                education: []
            };
        }

    };

})();
