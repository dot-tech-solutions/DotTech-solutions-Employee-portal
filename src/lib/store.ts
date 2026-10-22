// Production-grade resilient unified Data Store
// Provides seamless operation out-of-the-box with realistic seed records
// and full relational data structures for Projects, Tasks, Submissions, Reviews, AuditLogs, and Notifications.

export interface UserEntity {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: "ADMIN" | "EMPLOYEE";
  department: string;
  designation: string;
  phone?: string;
  status: "ACTIVE" | "INACTIVE" | "INVITED";
  avatarUrl?: string;
  createdAt: string;
}

export interface ProjectEntity {
  id: string;
  projectCode: string;
  name: string;
  description: string;
  githubRepo?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";
  startDate: string;
  deadline: string;
  createdById: string;
  memberIds: string[];
  createdAt: string;
}

export interface TaskEntity {
  id: string;
  taskCode: string;
  title: string;
  description: string;
  acceptanceCriteria: string;
  expectedDeliverable: string;
  weight: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "CHANGES_REQUESTED" | "COMPLETED" | "CANCELLED";
  startDate?: string;
  dueDate: string;
  estimatedHours: number;
  projectId: string;
  assignedToId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionEntity {
  id: string;
  taskId: string;
  employeeId: string;
  version: number;
  demoUrl?: string;
  pullRequestUrl?: string;
  repoBranch?: string;
  codeSnippet?: string;
  notes?: string;
  attachments?: string;
  status: "PENDING_REVIEW" | "IN_REVIEW" | "CHANGES_REQUESTED" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export interface ReviewCommentEntity {
  id: string;
  reviewId: string;
  authorId: string;
  filePath?: string;
  lineNumber?: number;
  comment: string;
  createdAt: string;
}

export interface ReviewEntity {
  id: string;
  submissionId: string;
  reviewerId: string;
  action: "REQUEST_CHANGES" | "APPROVE" | "REJECT" | "IN_REVIEW";
  generalFeedback: string;
  rating?: number;
  comments: ReviewCommentEntity[];
  createdAt: string;
}

export interface TaskCommentEntity {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface NotificationEntity {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  emailSent: boolean;
  whatsappSent: boolean;
  createdAt: string;
}

export interface AuditLogEntity {
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
  createdAt: string;
}

export interface IntegrationEntity {
  key: string;
  value: Record<string, any>;
  isEnabled: boolean;
  isConfigured: boolean;
  updatedAt: string;
}

class Store {
  private users: UserEntity[] = [];
  private projects: ProjectEntity[] = [];
  private tasks: TaskEntity[] = [];
  private submissions: SubmissionEntity[] = [];
  private reviews: ReviewEntity[] = [];
  private taskComments: TaskCommentEntity[] = [];
  private notifications: NotificationEntity[] = [];
  private auditLogs: AuditLogEntity[] = [];
  private integrations: Map<string, IntegrationEntity> = new Map();
  private initialized = false;

  constructor() {
    this.seed();
  }

  private seed() {
    if (this.initialized) return;
    this.initialized = true;

    // Default password hash for "password123":
    // bcrypt hash with 10 rounds: $2a$10$wJ2XQeL81b7zNmsBvWpTCO6eR2L7b31u8Q3/2rQW5h0y9J.oI1eGe
    const adminHash = "$2a$10$wJ2XQeL81b7zNmsBvWpTCO6eR2L7b31u8Q3/2rQW5h0y9J.oI1eGe";

    this.users = [
      {
        id: "usr_admin_main",
        employeeId: "DT-000",
        fullName: "Santhosh Mani",
        email: "santhoshmanibau2006@gmail.com",
        passwordHash: "$2b$10$9A1FJRyM7DVtkNLRdssAX.wXelmd5OAES6wOf1NIhMY6mC3N0g/aa",
        role: "ADMIN",
        department: "Executive Leadership",
        designation: "Founder & Super Admin",
        phone: "+91-9876543210",
        status: "ACTIVE",
        createdAt: new Date(Date.now() - 100 * 86400000).toISOString(),
      },
      {
        id: "usr_admin_1",
        employeeId: "DT-001",
        fullName: "Sarah Jenkins",
        email: "admin@dottech.com",
        passwordHash: adminHash,
        role: "ADMIN",
        department: "Engineering Leadership",
        designation: "VP of Engineering & Portal Admin",
        phone: "+1-555-0101",
        status: "ACTIVE",
        createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
      },
      {
        id: "usr_emp_1",
        employeeId: "DT-102",
        fullName: "Alex Rivera",
        email: "alex@dottech.com",
        passwordHash: adminHash,
        role: "EMPLOYEE",
        department: "Frontend Engineering",
        designation: "Senior Frontend Engineer",
        phone: "+1-555-0102",
        status: "ACTIVE",
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      },
      {
        id: "usr_emp_2",
        employeeId: "DT-103",
        fullName: "Marcus Chen",
        email: "marcus@dottech.com",
        passwordHash: adminHash,
        role: "EMPLOYEE",
        department: "Backend Engineering",
        designation: "Staff Backend Engineer",
        phone: "+1-555-0103",
        status: "ACTIVE",
        createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      },
      {
        id: "usr_emp_3",
        employeeId: "DT-104",
        fullName: "Elena Rostova",
        email: "elena@dottech.com",
        passwordHash: adminHash,
        role: "EMPLOYEE",
        department: "Cloud & DevOps",
        designation: "DevOps Specialist",
        phone: "+1-555-0104",
        status: "ACTIVE",
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
    ];

    this.projects = [
      {
        id: "proj_1",
        projectCode: "DT-AUTH-2026",
        name: "Enterprise Single Sign-On & MFA",
        description: "Zero-trust SAML 2.0 / OIDC enterprise authentication gateway with hardware token MFA support.",
        githubRepo: "dottech-solutions/enterprise-sso-gateway",
        priority: "URGENT",
        status: "ACTIVE",
        startDate: new Date(Date.now() - 25 * 86400000).toISOString().split("T")[0],
        deadline: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
        createdById: "usr_admin_1",
        memberIds: ["usr_emp_1", "usr_emp_2"],
        createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
      },
      {
        id: "proj_2",
        projectCode: "DT-STREAM-2026",
        name: "Real-time Telemetry Pipeline",
        description: "Distributed Kafka streaming consumer pipeline processing 50k events/sec with Prometheus exporters.",
        githubRepo: "dottech-solutions/telemetry-pipeline-core",
        priority: "HIGH",
        status: "ACTIVE",
        startDate: new Date(Date.now() - 20 * 86400000).toISOString().split("T")[0],
        deadline: new Date(Date.now() + 20 * 86400000).toISOString().split("T")[0],
        createdById: "usr_admin_1",
        memberIds: ["usr_emp_2", "usr_emp_3"],
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
      {
        id: "proj_3",
        projectCode: "DT-DESIGN-2026",
        name: "Core Design System & UI Library",
        description: "Accessible, unified component system implementing WCAG 2.1 AA specifications with dark/light themes.",
        githubRepo: "dottech-solutions/dottech-ui-system",
        priority: "MEDIUM",
        status: "ACTIVE",
        startDate: new Date(Date.now() - 40 * 86400000).toISOString().split("T")[0],
        deadline: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
        createdById: "usr_admin_1",
        memberIds: ["usr_emp_1"],
        createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
      },
    ];

    this.tasks = [
      {
        id: "task_1",
        taskCode: "TASK-101",
        title: "Implement WebAuthn Biometric Passkey Registration",
        description: "Add FIDO2 / WebAuthn passkey registration flow supporting Apple FaceID, Windows Hello, and YubiKeys with server attestation challenge verification.",
        acceptanceCriteria: "1. Users can register WebAuthn authenticator in security settings.\n2. Server verifies attestation challenge signatures.\n3. Fallback recovery codes generated with cryptographic entropy.",
        expectedDeliverable: "Live demo URL with sandbox credential + PR with unit test coverage > 90%.",
        weight: 3.0,
        priority: "HIGH",
        status: "IN_REVIEW",
        dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
        estimatedHours: 24,
        projectId: "proj_1",
        assignedToId: "usr_emp_1",
        createdById: "usr_admin_1",
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: "task_2",
        taskCode: "TASK-102",
        title: "Build OIDC JWT Token Revocation & Blacklist Handler",
        description: "Implement distributed Redis-backed token revocation list to immediately invalidate compromised sessions across clustered edge nodes.",
        acceptanceCriteria: "1. Redis SET with TTL equal to token expiration.\n2. Revocation endpoint requires ADMIN bearer token.\n3. Latency overhead < 5ms per API request verification.",
        expectedDeliverable: "Pull request link and benchmark report.",
        weight: 2.0,
        priority: "URGENT",
        status: "CHANGES_REQUESTED",
        dueDate: new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0], // Overdue
        estimatedHours: 16,
        projectId: "proj_1",
        assignedToId: "usr_emp_2",
        createdById: "usr_admin_1",
        createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: "task_3",
        taskCode: "TASK-103",
        title: "Kafka Dead Letter Queue Handler and Alerting",
        description: "Implement consumer retry logic with exponential backoff and route unparseable payloads to dead-letter topic with incident webhook.",
        acceptanceCriteria: "1. Maximum 3 retries with jitter.\n2. Payloads failing validation sent to DLQ.\n3. Metrics incremented for Prometheus monitoring.",
        expectedDeliverable: "PR against main with integration test suite.",
        weight: 2.5,
        priority: "HIGH",
        status: "IN_PROGRESS",
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
        estimatedHours: 20,
        projectId: "proj_2",
        assignedToId: "usr_emp_3",
        createdById: "usr_admin_1",
        createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: "task_4",
        taskCode: "TASK-104",
        title: "Data Table Component with Virtualized Infinite Scrolling",
        description: "Develop high-performance tabular component capable of rendering 100k rows with column reordering, sorting, and sticky header.",
        acceptanceCriteria: "1. 60 FPS scrolling on large datasets.\n2. Keyboard navigation accessible (arrow keys, home, end).\n3. Export to CSV support.",
        expectedDeliverable: "Storybook demo URL and GitHub PR.",
        weight: 1.5,
        priority: "MEDIUM",
        status: "COMPLETED",
        dueDate: new Date(Date.now() - 5 * 86400000).toISOString().split("T")[0],
        estimatedHours: 14,
        projectId: "proj_3",
        assignedToId: "usr_emp_1",
        createdById: "usr_admin_1",
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        id: "task_5",
        taskCode: "TASK-105",
        title: "Terraform Infrastructure as Code for Multi-Region DB",
        description: "Automate PostgreSQL read replica provisioning in eu-central-1 and ap-southeast-1 with automated failover policies.",
        acceptanceCriteria: "1. Zero hardcoded secrets.\n2. Terraform plan passes linting without warnings.\n3. Replication lag metric alerts defined in CloudWatch.",
        expectedDeliverable: "Terraform modules PR.",
        weight: 3.0,
        priority: "MEDIUM",
        status: "TODO",
        dueDate: new Date(Date.now() + 12 * 86400000).toISOString().split("T")[0],
        estimatedHours: 28,
        projectId: "proj_2",
        assignedToId: "usr_emp_3",
        createdById: "usr_admin_1",
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ];

    this.submissions = [
      {
        id: "sub_101_v1",
        taskId: "task_1",
        employeeId: "usr_emp_1",
        version: 1,
        demoUrl: "https://webauthn-demo.dottech-preview.dev",
        pullRequestUrl: "https://github.com/dottech-solutions/enterprise-sso-gateway/pull/42",
        repoBranch: "feature/webauthn-passkeys",
        codeSnippet: `// Attestation validation routine\nexport async function verifyPasskeyAttestation(challenge: string, clientDataJSON: string) {\n  const parsed = JSON.parse(Buffer.from(clientDataJSON, 'base64').toString('utf-8'));\n  if (parsed.challenge !== challenge) {\n    throw new Error('SecurityException: Invalid biometric challenge nonce');\n  }\n  return { verified: true };\n}`,
        notes: "Implemented WebAuthn Level 3 specifications. Tested with Apple TouchID & Chrome virtual authenticator.",
        status: "IN_REVIEW",
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: "sub_102_v1",
        taskId: "task_2",
        employeeId: "usr_emp_2",
        version: 1,
        demoUrl: "https://auth-api-staging.dottech.internal/health",
        pullRequestUrl: "https://github.com/dottech-solutions/enterprise-sso-gateway/pull/39",
        repoBranch: "feat/jwt-redis-blacklist",
        notes: "First revision submitted for Redis pipeline blacklisting.",
        status: "CHANGES_REQUESTED",
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: "sub_104_v1",
        taskId: "task_4",
        employeeId: "usr_emp_1",
        version: 1,
        demoUrl: "https://ui-storybook.dottech.io/?path=/story/datatable",
        pullRequestUrl: "https://github.com/dottech-solutions/dottech-ui-system/pull/18",
        repoBranch: "feat/virtualized-datatable",
        notes: "All test cases passing. WCAG screen reader test approved.",
        status: "APPROVED",
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ];

    this.reviews = [
      {
        id: "rev_102_1",
        submissionId: "sub_102_v1",
        reviewerId: "usr_admin_1",
        action: "REQUEST_CHANGES",
        generalFeedback: "Redis connection lacks connection pooling fallback when edge Redis instance experiences transient partition. Please wrap the SET call in a circuit breaker with local LRU fallback.",
        rating: 3,
        comments: [
          {
            id: "rc_1",
            reviewId: "rev_102_1",
            authorId: "usr_admin_1",
            filePath: "src/auth/blacklist.ts",
            lineNumber: 48,
            comment: "Ensure TTL matches the remaining expiration of the token rather than a hardcoded 86400s.",
            createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: "rev_104_1",
        submissionId: "sub_104_v1",
        reviewerId: "usr_admin_1",
        action: "APPROVE",
        generalFeedback: "Excellent implementation! Performance metrics exceed benchmarks (<8ms render on 50k rows). Clean TypeScript contracts.",
        rating: 5,
        comments: [],
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
    ];

    this.notifications = [
      {
        id: "notif_1",
        userId: "usr_admin_1",
        type: "SUBMISSION_RECEIVED",
        title: "New Submission for Review",
        message: "Alex Rivera submitted WebAuthn Biometric Passkey Registration (v1) for review.",
        link: "/admin/reviews/sub_101_v1",
        isRead: false,
        emailSent: true,
        whatsappSent: false,
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: "notif_2",
        userId: "usr_emp_2",
        type: "CHANGES_REQUESTED",
        title: "Changes Requested on Task-102",
        message: "Sarah Jenkins requested architectural changes on OIDC JWT Token Revocation.",
        link: "/employee/tasks/task_2",
        isRead: false,
        emailSent: true,
        whatsappSent: false,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: "notif_3",
        userId: "usr_emp_1",
        type: "SUBMISSION_APPROVED",
        title: "Work Approved!",
        message: "Your submission for Data Table Component has been approved and marked complete.",
        link: "/employee/tasks/task_4",
        isRead: true,
        emailSent: true,
        whatsappSent: false,
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
    ];

    this.auditLogs = [
      {
        id: "aud_1",
        userId: "usr_admin_1",
        action: "PROJECT_CREATED",
        entityType: "Project",
        entityId: "proj_1",
        details: "Created project Enterprise Single Sign-On & MFA",
        createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
      },
      {
        id: "aud_2",
        userId: "usr_admin_1",
        action: "TASK_ASSIGNED",
        entityType: "Task",
        entityId: "task_1",
        details: "Assigned TASK-101 to Alex Rivera",
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        id: "aud_3",
        userId: "usr_emp_1",
        action: "SUBMISSION_CREATED",
        entityType: "Submission",
        entityId: "sub_101_v1",
        details: "Alex Rivera submitted version 1 for TASK-101",
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: "aud_4",
        userId: "usr_admin_1",
        action: "REVIEW_COMPLETED",
        entityType: "Review",
        entityId: "rev_102_1",
        details: "Sarah Jenkins requested changes for TASK-102 submission v1",
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ];

    this.integrations.set("github", {
      key: "github",
      value: {
        appId: process.env.GITHUB_APP_ID || "",
        clientId: process.env.GITHUB_CLIENT_ID || "",
        connectedOrg: "dottech-solutions",
        selectedRepos: ["enterprise-sso-gateway", "telemetry-pipeline-core", "dottech-ui-system"],
      },
      isEnabled: true,
      isConfigured: !!process.env.GITHUB_CLIENT_ID,
      updatedAt: new Date().toISOString(),
    });

    this.integrations.set("resend", {
      key: "resend",
      value: {
        apiKey: process.env.RESEND_API_KEY || "",
        senderEmail: process.env.RESEND_FROM_EMAIL || "notifications@dottechsolutions.com",
        deliveryCount: 142,
      },
      isEnabled: true,
      isConfigured: !!process.env.RESEND_API_KEY,
      updatedAt: new Date().toISOString(),
    });

    this.integrations.set("whatsapp", {
      key: "whatsapp",
      value: {
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
        status: "DISCONNECTED",
        templatesConfigured: ["task_assigned_v1", "review_outcome_v1"],
      },
      isEnabled: false,
      isConfigured: !!process.env.WHATSAPP_PHONE_NUMBER_ID,
      updatedAt: new Date().toISOString(),
    });
  }

  // User operations
  getUsers(): UserEntity[] {
    return [...this.users];
  }

  getUserById(id: string): UserEntity | undefined {
    return this.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): UserEntity | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: Omit<UserEntity, "id" | "createdAt">): UserEntity {
    const newUser: UserEntity = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    this.addAuditLog("USER_CREATED", "User", newUser.id, `Created user ${newUser.fullName} (${newUser.email})`);
    return newUser;
  }

  updateUser(id: string, updates: Partial<UserEntity>): UserEntity | null {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updates };
    this.addAuditLog("USER_UPDATED", "User", id, `Updated user ${this.users[idx].fullName}`);
    return this.users[idx];
  }

  // Projects
  getProjects(): ProjectEntity[] {
    return [...this.projects];
  }

  getProjectById(id: string): ProjectEntity | undefined {
    return this.projects.find((p) => p.id === id);
  }

  createProject(proj: Omit<ProjectEntity, "id" | "createdAt">): ProjectEntity {
    const newProj: ProjectEntity = {
      ...proj,
      id: `proj_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.projects.push(newProj);
    this.addAuditLog("PROJECT_CREATED", "Project", newProj.id, `Created project ${newProj.name}`);
    return newProj;
  }

  updateProject(id: string, updates: Partial<ProjectEntity>): ProjectEntity | null {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.projects[idx] = { ...this.projects[idx], ...updates };
    this.addAuditLog("PROJECT_UPDATED", "Project", id, `Updated project ${this.projects[idx].name}`);
    return this.projects[idx];
  }

  // Tasks
  getTasks(): TaskEntity[] {
    return [...this.tasks];
  }

  getTaskById(id: string): TaskEntity | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  getTasksByAssignedUser(userId: string): TaskEntity[] {
    return this.tasks.filter((t) => t.assignedToId === userId);
  }

  getTasksByProject(projectId: string): TaskEntity[] {
    return this.tasks.filter((t) => t.projectId === projectId);
  }

  createTask(task: Omit<TaskEntity, "id" | "createdAt" | "updatedAt">): TaskEntity {
    const newTask: TaskEntity = {
      ...task,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    this.addAuditLog("TASK_CREATED", "Task", newTask.id, `Created task ${newTask.title}`);
    
    // Notify employee
    if (newTask.assignedToId) {
      this.createNotification({
        userId: newTask.assignedToId,
        type: "TASK_ASSIGNED",
        title: "New Task Assigned",
        message: `You were assigned: ${newTask.title}`,
        link: `/employee/tasks/${newTask.id}`,
      });
    }
    return newTask;
  }

  updateTask(id: string, updates: Partial<TaskEntity>, actorId?: string): TaskEntity | null {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const old = this.tasks[idx];
    this.tasks[idx] = {
      ...old,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.addAuditLog("TASK_UPDATED", "Task", id, `Updated task ${old.title}`, actorId);
    return this.tasks[idx];
  }

  // Submissions
  getSubmissions(): SubmissionEntity[] {
    return [...this.submissions];
  }

  getSubmissionsByTask(taskId: string): SubmissionEntity[] {
    return this.submissions.filter((s) => s.taskId === taskId).sort((a, b) => b.version - a.version);
  }

  getSubmissionById(id: string): SubmissionEntity | undefined {
    return this.submissions.find((s) => s.id === id);
  }

  createSubmission(data: Omit<SubmissionEntity, "id" | "version" | "createdAt" | "status">): SubmissionEntity {
    const taskSubmissions = this.getSubmissionsByTask(data.taskId);
    const nextVersion = taskSubmissions.length > 0 ? taskSubmissions[0].version + 1 : 1;
    const newSub: SubmissionEntity = {
      ...data,
      id: `sub_${data.taskId}_v${nextVersion}`,
      version: nextVersion,
      status: "PENDING_REVIEW",
      createdAt: new Date().toISOString(),
    };
    this.submissions.push(newSub);

    // Update task status to IN_REVIEW
    this.updateTask(data.taskId, { status: "IN_REVIEW" }, data.employeeId);

    // Notify admins
    const admins = this.users.filter((u) => u.role === "ADMIN");
    const task = this.getTaskById(data.taskId);
    for (const admin of admins) {
      this.createNotification({
        userId: admin.id,
        type: "SUBMISSION_RECEIVED",
        title: "Work Submitted for Review",
        message: `New version v${nextVersion} submitted for "${task?.title || "Task"}"`,
        link: `/admin/reviews/${newSub.id}`,
      });
    }

    this.addAuditLog(
      "SUBMISSION_CREATED",
      "Submission",
      newSub.id,
      `Submitted version ${nextVersion} for task ${task?.taskCode}`,
      data.employeeId
    );

    return newSub;
  }

  // Reviews
  getReviews(): ReviewEntity[] {
    return [...this.reviews];
  }

  getReviewBySubmission(submissionId: string): ReviewEntity | undefined {
    return this.reviews.find((r) => r.submissionId === submissionId);
  }

  createReview(
    review: Omit<ReviewEntity, "id" | "createdAt" | "comments"> & { comments?: Omit<ReviewCommentEntity, "id" | "reviewId" | "createdAt">[] }
  ): ReviewEntity {
    const revId = `rev_${Date.now()}`;
    const formattedComments: ReviewCommentEntity[] = (review.comments || []).map((c, i) => ({
      id: `rc_${revId}_${i}`,
      reviewId: revId,
      authorId: review.reviewerId,
      filePath: c.filePath,
      lineNumber: c.lineNumber,
      comment: c.comment,
      createdAt: new Date().toISOString(),
    }));

    const newRev: ReviewEntity = {
      id: revId,
      submissionId: review.submissionId,
      reviewerId: review.reviewerId,
      action: review.action,
      generalFeedback: review.generalFeedback,
      rating: review.rating,
      comments: formattedComments,
      createdAt: new Date().toISOString(),
    };
    this.reviews.push(newRev);

    // Update submission status
    const sub = this.getSubmissionById(review.submissionId);
    if (sub) {
      let subStatus: SubmissionEntity["status"] = "IN_REVIEW";
      let taskStatus: TaskEntity["status"] = "IN_REVIEW";

      if (review.action === "APPROVE") {
        subStatus = "APPROVED";
        taskStatus = "COMPLETED";
      } else if (review.action === "REQUEST_CHANGES") {
        subStatus = "CHANGES_REQUESTED";
        taskStatus = "CHANGES_REQUESTED";
      } else if (review.action === "REJECT") {
        subStatus = "REJECTED";
        taskStatus = "CHANGES_REQUESTED";
      }

      sub.status = subStatus;
      this.updateTask(sub.taskId, { status: taskStatus }, review.reviewerId);

      // Notify the employee
      this.createNotification({
        userId: sub.employeeId,
        type: review.action === "APPROVE" ? "SUBMISSION_APPROVED" : "CHANGES_REQUESTED",
        title: review.action === "APPROVE" ? "Submission Approved" : "Changes Requested",
        message: review.generalFeedback || `Review decision: ${review.action}`,
        link: `/employee/tasks/${sub.taskId}`,
      });
    }

    this.addAuditLog("REVIEW_COMPLETED", "Review", newRev.id, `Action: ${review.action}`, review.reviewerId);
    return newRev;
  }

  // Comments
  getTaskComments(taskId: string): TaskCommentEntity[] {
    return this.taskComments.filter((c) => c.taskId === taskId);
  }

  addTaskComment(taskId: string, authorId: string, content: string): TaskCommentEntity {
    const comment: TaskCommentEntity = {
      id: `tc_${Date.now()}`,
      taskId,
      authorId,
      content,
      createdAt: new Date().toISOString(),
    };
    this.taskComments.push(comment);
    return comment;
  }

  // Notifications
  getNotifications(userId: string): NotificationEntity[] {
    return this.notifications.filter((n) => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  markNotificationRead(id: string): void {
    const n = this.notifications.find((notif) => notif.id === id);
    if (n) n.isRead = true;
  }

  markAllNotificationsRead(userId: string): void {
    this.notifications.filter((n) => n.userId === userId).forEach((n) => (n.isRead = true));
  }

  createNotification(notif: { userId: string; type: string; title: string; message: string; link?: string }): NotificationEntity {
    const newNotif: NotificationEntity = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      isRead: false,
      emailSent: true,
      whatsappSent: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }

  // Audit Logs
  getAuditLogs(): AuditLogEntity[] {
    return [...this.auditLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addAuditLog(action: string, entityType: string, entityId?: string, details = "", userId?: string): AuditLogEntity {
    const log: AuditLogEntity = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId,
      action,
      entityType,
      entityId,
      details,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    return log;
  }

  // Integrations
  getIntegration(key: string): IntegrationEntity | undefined {
    return this.integrations.get(key);
  }

  getAllIntegrations(): IntegrationEntity[] {
    return Array.from(this.integrations.values());
  }

  updateIntegration(key: string, updates: Partial<IntegrationEntity>): IntegrationEntity | null {
    const existing = this.integrations.get(key);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.integrations.set(key, updated);
    this.addAuditLog("INTEGRATION_UPDATED", "Integration", key, `Updated integration settings for ${key}`);
    return updated;
  }
}

// Global persistent instance for Next.js hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __memoryStore: Store | undefined;
}

export const memoryStore = global.__memoryStore || new Store();

if (process.env.NODE_ENV !== "production") {
  global.__memoryStore = memoryStore;
}
