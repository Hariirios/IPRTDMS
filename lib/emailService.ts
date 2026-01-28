// Email service for sending registration and application emails to admin using Formspree
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface SeminarRegistration {
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  seminarTitle: string;
  seminarDate: string;
  message?: string;
}

export interface WorkshopRegistration {
  fullName: string;
  email: string;
  phone: string;
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  workshopTitle: string;
  workshopDate: string;
  expectations?: string;
}

export interface ProgramApplication {
  fullName: string;
  email: string;
  phone: string;
  education: string;
  experience?: string;
  programTitle: string;
  intakeDate: string;
  motivation: string;
  cv?: File;
}

// Formspree Configuration
const FORMSPREE_CONFIG = {
  formId: import.meta.env.VITE_FORMSPREE_FORM_ID,
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'abdallaahmet11@iprt.org'
};

export const emailService = {
  // Send seminar registration email
  sendSeminarRegistration: async (data: SeminarRegistration): Promise<boolean> => {
    try {
      if (!FORMSPREE_CONFIG.formId) {
        console.error('Formspree form ID not configured');
        return false;
      }

      const formData = new FormData();
      
      // Email configuration
      formData.append('_subject', `🎓 New Seminar Registration: ${data.seminarTitle}`);
      formData.append('_replyto', data.email);
      formData.append('_template', 'table');
      
      // Formatted message for email body
      const emailMessage = `
📋 SEMINAR REGISTRATION DETAILS

🎓 Seminar Information:
• Title: ${data.seminarTitle}
• Date: ${data.seminarDate}

👤 Participant Information:
• Name: ${data.fullName}
• Email: ${data.email}
• Phone: ${data.phone}
• Organization: ${data.organization || 'Not specified'}

💬 Additional Message:
${data.message || 'No additional message provided'}

📅 Submitted: ${new Date().toLocaleString()}
🌐 Source: IPRT NGO Website

---
This registration was submitted through the IPRT website.
Please contact the participant to confirm their registration.
      `;
      
      formData.append('message', emailMessage);
      formData.append('registration_type', 'Seminar Registration');
      formData.append('participant_name', data.fullName);
      formData.append('participant_email', data.email);
      formData.append('participant_phone', data.phone);

      const response = await fetch(`https://formspree.io/f/${FORMSPREE_CONFIG.formId}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending seminar registration:', error);
      return false;
    }
  },

  // Send workshop registration email
  sendWorkshopRegistration: async (data: WorkshopRegistration): Promise<boolean> => {
    try {
      if (!FORMSPREE_CONFIG.formId) {
        console.error('Formspree form ID not configured');
        return false;
      }

      const formData = new FormData();
      
      // Email configuration
      formData.append('_subject', `🔧 New Workshop Registration: ${data.workshopTitle}`);
      formData.append('_replyto', data.email);
      formData.append('_template', 'table');
      
      // Formatted message for email body
      const emailMessage = `
📋 WORKSHOP REGISTRATION DETAILS

🔧 Workshop Information:
• Title: ${data.workshopTitle}
• Date: ${data.workshopDate}

👤 Participant Information:
• Name: ${data.fullName}
• Email: ${data.email}
• Phone: ${data.phone}
• Experience Level: ${data.experience}

💭 Learning Expectations:
${data.expectations || 'No specific expectations mentioned'}

📅 Submitted: ${new Date().toLocaleString()}
🌐 Source: IPRT NGO Website

---
This registration was submitted through the IPRT website.
Please contact the participant to confirm their registration.
      `;
      
      formData.append('message', emailMessage);
      formData.append('registration_type', 'Workshop Registration');
      formData.append('participant_name', data.fullName);
      formData.append('participant_email', data.email);
      formData.append('participant_phone', data.phone);

      const response = await fetch(`https://formspree.io/f/${FORMSPREE_CONFIG.formId}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending workshop registration:', error);
      return false;
    }
  },

  // Send program application email
  sendProgramApplication: async (data: ProgramApplication): Promise<boolean> => {
    try {
      if (!FORMSPREE_CONFIG.formId) {
        console.error('Formspree form ID not configured');
        return false;
      }

      const formData = new FormData();
      
      // Email configuration
      formData.append('_subject', `📚 New Program Application: ${data.programTitle}`);
      formData.append('_replyto', data.email);
      formData.append('_template', 'table');
      
      // Formatted message for email body
      const emailMessage = `
📋 PROGRAM APPLICATION DETAILS

📚 Program Information:
• Title: ${data.programTitle}
• Intake Date: ${data.intakeDate}

👤 Applicant Information:
• Name: ${data.fullName}
• Email: ${data.email}
• Phone: ${data.phone}
• Education: ${data.education}
• Experience: ${data.experience || 'No relevant experience mentioned'}

💭 Motivation Statement:
${data.motivation}

📎 CV Attachment: ${data.cv ? 'Yes - CV file attached' : 'No CV attached'}

📅 Submitted: ${new Date().toLocaleString()}
🌐 Source: IPRT NGO Website

---
This application was submitted through the IPRT website.
Please review the application and contact the applicant.
      `;
      
      formData.append('message', emailMessage);
      formData.append('registration_type', 'Program Application');
      formData.append('applicant_name', data.fullName);
      formData.append('applicant_email', data.email);
      formData.append('applicant_phone', data.phone);
      
      // CV attachment
      if (data.cv) {
        formData.append('cv_file', data.cv);
      }

      const response = await fetch(`https://formspree.io/f/${FORMSPREE_CONFIG.formId}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending program application:', error);
      return false;
    }
  }
};

export default emailService;