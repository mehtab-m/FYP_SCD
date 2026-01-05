# PowerPoint Presentation Generation Prompt for FYP System

**Copy the prompt below and paste it into your AI PPT generator tool (like ChatGPT, Claude, or any presentation AI tool)**

---

## PROMPT FOR AI PPT GENERATOR:

**Create a professional, comprehensive PowerPoint presentation for a Final Year Project (FYP) Management System. The presentation should be visually appealing, well-structured, and suitable for academic presentation or project defense.**

### PROJECT OVERVIEW
- **Project Title**: ProjectSphere - Final Year Project Management System
- **Alternative Title**: FYP Management System / FYP Lifecycle Management Platform
- **Project Type**: Web-based Management System
- **Technology Stack**: 
  - **Frontend**: React.js (JSX), CSS3 with centralized Design System, Vite build tool
  - **Backend**: Java Spring Boot, JPA/Hibernate ORM
  - **Database**: PostgreSQL (relational database with proper constraints and relationships)
  - **API**: RESTful API architecture
- **Purpose**: A comprehensive, role-based web application to automate and manage the entire Final Year Project lifecycle for students, supervisors, committees, and administrators in an academic institution

---

### PRESENTATION STRUCTURE (Create slides for each section):

#### SLIDE 1: TITLE SLIDE
- Project Title: FYP Management System
- Subtitle: Complete Project Lifecycle Management Platform
- Student/Team Name (to be filled)
- Institution Name (to be filled)
- Date

#### SLIDE 2: PROBLEM STATEMENT
- Manual FYP management processes are time-consuming and error-prone
- Difficulty in tracking project progress and milestones
- Challenges in coordinating between students, supervisors, and committees
- Need for centralized document management and evaluation system
- Lack of transparency in grading and result publication

#### SLIDE 3: PROJECT OBJECTIVES
- Automate the complete FYP lifecycle from group formation to result publication
- Enable efficient project registration and approval workflows
- Facilitate document submission and evaluation processes
- Provide real-time progress monitoring for students and supervisors
- Implement transparent marking and grading system
- Generate and publish final results with grade assignment

#### SLIDE 4: SYSTEM ARCHITECTURE OVERVIEW
- Three-tier architecture:
  - **Frontend Layer**: React.js Single Page Application with modern UI/UX
  - **Backend Layer**: Java Spring Boot RESTful API
  - **Database Layer**: PostgreSQL relational database
- RESTful API communication between frontend and backend
- Role-based access control system

#### SLIDE 5: USER ROLES & ACCESS LEVELS
- **Administrator**: User management, document management, committee management
- **FYP Committee**: Project registration approval, supervisor assignment, deadline management
- **Evaluation Committee**: Document evaluation, marking, grade assignment, result publication
- **Supervisor**: Document review, marking, submission approval/rejection, progress tracking
- **Student**: Group formation, project registration, document submission, marks viewing

#### SLIDE 6: KEY FEATURES - GROUP MANAGEMENT
- Student group formation with invitation system
- Group leader functionality
- Group member management (max 3-4 members per group)
- Group finalization process
- Real-time invitation status tracking

#### SLIDE 7: KEY FEATURES - PROJECT REGISTRATION
- Project title and abstract submission
- Supervisor preference selection (1st, 2nd, 3rd preferences)
- Project approval/rejection workflow by FYP Committee
- Supervisor assignment based on preferences
- Project status tracking (pending, accepted, approved, rejected)

#### SLIDE 8: KEY FEATURES - DOCUMENT MANAGEMENT
- Multiple document types with sequence numbers
- Document deadline scheduling per group
- Version-controlled document submissions
- Document approval workflow (pending, approved, rejected)
- Late submission tracking
- File upload and storage system

#### SLIDE 9: KEY FEATURES - MARKING SYSTEM
- **Dual marking system**:
  - **Supervisor Marks**: Assigned by project supervisor for each document
  - **Committee Marks**: Assigned by evaluation committee for each document
  - **Aggregated Total**: Marks from both sources combined per document
- **Mark scheme configuration**: Separate maximum marks for supervisor and committee (configurable per document)
- **Latest version marking**: Only the most recent submission version is evaluated (version control system)
- **Real-time calculation**: Automatic marks aggregation and total calculation
- **Detailed breakdown**: Mark breakdown displayed per document (supervisor marks + committee marks = total marks per document)
- **Group-wise totals**: Overall marks calculated across all documents for each group

#### SLIDE 10: KEY FEATURES - EVALUATION & GRADING
- **Comprehensive progress monitoring**:
  - Student progress tracking with completion percentage and milestone status
  - Supervisor activity monitoring (projects supervised, response rate, last activity)
  - Document submission status tracking per group
  - Visual progress indicators and status badges
- **Grade assignment system**:
  - Configurable grade policy (Grades: A, B, C, D, E, F, G)
  - Threshold-based automatic grade calculation
  - Interval-based grading: Select base grade (e.g., "A") with threshold (e.g., 80 marks)
  - Automatic distribution: Groups above threshold get base grade, then decrement by one grade per 10-mark interval
  - Example: A (≥80), B (≥70), C (≥60), D (≥50), etc.
  - Bulk grade assignment to all groups simultaneously
- **Result publication**: Final grades published and viewable by students

#### SLIDE 11: KEY FEATURES - NOTIFICATIONS & COMMUNICATION
- Real-time notification system
- Group invitation notifications
- Project approval/rejection notifications
- Submission status updates
- Result publication notifications

#### SLIDE 12: DATABASE DESIGN HIGHLIGHTS
- **User Management**: Users, Roles, User Roles (many-to-many relationship)
- **Group Management**: Groups, Group Members, Group Invitations (with status: pending/accepted/rejected)
- **Project Management**: Projects, Project Approvals, Project Supervisor Preferences (1st, 2nd, 3rd preferences)
- **Document Management**: Documents (with sequence numbers and deadlines), Document Mark Scheme, Group Document Schedule
- **Submission System**: Submissions (with version control via version_number), Submission Status
- **Marking System**: Supervisor Marks, Committee Marks (separate tables with document and submission references)
- **Results & Grading**: Final Scores, Final Grades, Grade Policy
- **Committee System**: Committees (FYP Committee, Evaluation Committee), Committee Members
- **Key Features**: Proper foreign key relationships, constraints, sequences for auto-increment, status tracking fields

#### SLIDE 13: TECHNICAL IMPLEMENTATION - FRONTEND
- **Framework**: React.js with modern hooks (useState, useEffect)
- **Styling**: Custom CSS Design System with CSS Variables
- **State Management**: React Context and Local State
- **API Integration**: Axios for HTTP requests
- **Components**: Reusable Notification, Modal, Confirmation components
- **Features**: Responsive design, professional UI/UX, real-time updates

#### SLIDE 14: TECHNICAL IMPLEMENTATION - BACKEND
- **Framework**: Java Spring Boot
- **Architecture**: RESTful API design
- **Data Access**: JPA/Hibernate with Repository pattern
- **Controllers**: Separate controllers for each module (Admin, Student, Supervisor, Committee, Evaluation)
- **Services**: Business logic separation
- **Security**: Role-based access control
- **Database**: PostgreSQL with proper relationships and constraints

#### SLIDE 15: USER INTERFACE DESIGN
- Modern, professional design system
- Consistent color scheme (Primary Blue: #3b82f6)
- Clean and intuitive navigation
- Dashboard-based interface for each user role
- Real-time notifications (non-intrusive, top-right corner)
- Responsive layouts for all screen sizes
- Professional typography and spacing

#### SLIDE 16: WORKFLOW DIAGRAM - COMPLETE PROJECT LIFECYCLE
**Detailed Step-by-Step Process:**
1. **Student Group Formation**: Students form groups (max 4 members), leader sends invitations
2. **Group Finalization**: All members accept invitations, group is finalized
3. **Project Registration**: Group submits project title, abstract, scope, references, and 3 supervisor preferences
4. **FYP Committee Review**: Committee reviews project, accepts/rejects (with reasons if rejected)
5. **Supervisor Assignment**: FYP Committee assigns supervisor based on preferences
6. **Project Approval**: Final approval by FYP Committee, project status becomes "approved"
7. **Document Schedule Setup**: Admin/FYP Committee sets deadlines for each document type per group
8. **Document Submission**: Students submit documents (with version control for resubmissions)
9. **Supervisor Evaluation**: Supervisor reviews, marks, and approves/rejects submissions
10. **Committee Evaluation**: Evaluation Committee marks the same submissions
11. **Marks Aggregation**: System calculates total marks (supervisor + committee marks per document, then sum across documents)
12. **Grade Assignment**: Evaluation Committee assigns grades based on threshold and interval policy
13. **Result Publication**: Final grades published and made visible to students

#### SLIDE 17: KEY INNOVATIONS / UNIQUE FEATURES
- Version-controlled document submissions with latest version marking
- Dual marking system (Supervisor + Committee) with aggregated totals
- Automated grade assignment with configurable thresholds
- Comprehensive progress monitoring dashboard
- Real-time notification system without page refresh
- Professional, consistent design system across all modules
- Role-based dashboard with customized views

#### SLIDE 18: SYSTEM BENEFITS
- **For Students**: Easy group formation, streamlined submission process, transparent marking
- **For Supervisors**: Efficient document review, clear marking interface, progress tracking
- **For Committees**: Centralized management, bulk operations, comprehensive monitoring
- **For Administrators**: Complete system control, user management, configuration management
- **For Institution**: Reduced manual work, improved efficiency, better transparency

#### SLIDE 19: FUTURE ENHANCEMENTS (Optional)
- Email notification system integration
- Document preview functionality
- Advanced reporting and analytics
- Mobile application development
- Integration with institutional systems
- AI-powered plagiarism detection
- Advanced search and filtering capabilities

#### SLIDE 20: CONCLUSION
- Successfully automated the complete FYP management lifecycle
- Improved efficiency and transparency in the evaluation process
- Enhanced user experience with modern, professional interface
- Scalable and maintainable system architecture
- Ready for production deployment

#### SLIDE 21: DEMONSTRATION / SCREENSHOTS (Add when available)
- Login screen
- Student dashboard
- Supervisor dashboard
- Committee dashboard
- Document submission interface
- Marking interface
- Result publication interface

#### SLIDE 22: QUESTIONS & ANSWERS
- Thank you slide
- Ready for questions

---

### DESIGN REQUIREMENTS FOR PPT:
- **Color Scheme**: Professional blue theme (Primary: #3b82f6, matching system design)
- **Typography**: Clear, readable fonts (sans-serif recommended)
- **Layout**: Clean, organized layouts with proper spacing
- **Visual Elements**:
  - Include workflow diagrams/flowcharts (especially for Slide 16)
  - Use icons and illustrations where appropriate
  - Include placeholders for screenshots with descriptions
- **Consistency**: Maintain uniform styling across all slides
- **Readability**: Keep text concise, use bullet points, avoid overcrowding
- **Visual Hierarchy**: Clear headings, subheadings, and content organization

### PRESENTATION GUIDELINES:
- **Total Slides**: Approximately 20-25 slides (excluding title and Q&A)
- **Slide Design**: Each slide should be visually appealing with appropriate layouts
- **Transitions**: Suggest smooth transitions between slides
- **Speaker Notes**: Add helpful speaker notes for key points on important slides
- **Screenshot Placements**: Indicate where screenshots should be inserted (with descriptions)
- **Style**: Professional academic presentation style suitable for project defense
- **Content Balance**: Comprehensive coverage while maintaining conciseness
- **Timing**: Plan for 15-20 minute presentation (approximately 1 minute per slide)

### SPECIFIC SLIDE REQUIREMENTS:
- **Slide 16 (Workflow)**: MUST include a visual flowchart/diagram showing the complete lifecycle
- **Slide 4 (Architecture)**: Include a three-tier architecture diagram
- **Slide 21 (Screenshots)**: Create placeholders with clear labels for each screenshot needed
- **Slide 5 (User Roles)**: Consider using icons or visual representation for each role
- **Technical Slides (13-14)**: Use code snippets or architecture diagrams if appropriate

### ADDITIONAL CONTENT TO INCLUDE:
- Mention the centralized CSS design system for consistent UI/UX
- Highlight the version-controlled submission system as a key innovation
- Emphasize the dual marking system (supervisor + committee) as a quality assurance feature
- Note the role-based dashboard customization for different user types
- Include the notification system improvements (replaced alerts with on-page notifications)

---

**END OF PROMPT**

