export const validateRegistrationForm = (formData) => {
    // Name validation: no punctuation except underscore
    if (!/^[a-zA-Z0-9_]+$/.test(formData.name)) {
        return { valid: false, message: "Name must not contain punctuation apart from underscore (_)." };
    }

    // Email validation: must be a valid stud.noroff.no email address
    if (!/^[a-zA-Z0-9._%+-]+@stud.noroff.no$/.test(formData.email)) {
        return { valid: false, message: "Email must be a valid stud.noroff.no address." };
    }

    // Password validation: at least 8 characters
    if (formData.password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters." };
    }

    // Bio validation: must be less than 160 characters
    if (formData.bio && formData.bio.length > 160) {
        return {valid: false, message: "Bio must be less than 160 characters." };
    }

    // Avatar URL validation: must be a valid URL
    if (formData.avatar && formData.avatar.url && !isValidUrl(formData.avatar.url)) {
        return { valid: false, message: "Avatar URL must be a valid and accessible URL" };
    }

    // Avatar alt validation: must be less than 120 characters
    if (formData.avatar && formData.avatar.alt && formData.avatar.alt.length > 120) {
        return { valid: false, message: "Avatar alt text must be less than 120 characters." };
    }

    // Banner URL validation: must be a valid URL
    if (formData.banner && formData.banner.url && !isValidUrl(formData.banner.url)) {
        return { valid: false, message: "Banner URL must be a valid and accessible URL." };
    }

    // Banner alt validation: must be less than 120 characters
    if (formData.banner && formData.banner.alt && formData.banner.alt.length > 120) {
        return { valid: false, message: "Banner alt text must be less than 120 characters." };
    }

    return { valid: true, message: "Validation successful." };
};

export const validateLoginForm = (formData) => {
    // Email validation: must be a valid stud.noroff.no email address
    if (!/^[a-zA-Z0-9._%+-]+@stud.noroff.no$/.test(formData.email)) {
        return { valid: false, message: "Email must be a valid stud.noroff.no address." };
    }

    // Password validation: at least 8 characters
    if (formData.password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters." };
    }

    return { valid: true, message: "Validation successful." };
}

const isValidUrl = (urlString) => {
    try {
        new URL(urlString);
        return true;
    } catch (error) {
        return false;
    }
};