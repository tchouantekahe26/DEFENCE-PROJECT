import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User, UserRole, StudentProfile, TeacherProfile } from "../types";
import {
  initialUsers,
  initialStudentProfile,
  initialTeacherProfile,
} from "../data/mockDatabase";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  studentProfile: StudentProfile | null;
  teacherProfile: TeacherProfile | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (emailOrId: string, password?: string) => Promise<{ token: string; user: User }>;
  register: (formData: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    identifier?: string;
    department?: string;
    level?: string;
    className?: string;
    phone?: string;
  }) => Promise<{ token: string; user: User }>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
    updateProfile: (data: Partial<User>) => void;
  changePassword?: (oldPass: string, newPass: string) => Promise<boolean>;
  verifyCurrentPassword?: (pass: string) => boolean;
  switchDemoRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "uninexus_token";
const USER_KEY = "uninexus_user";
const ROLE_KEY = "uninexus_role";
const PASSWORDS_KEY = "uninexus_user_passwords";
const API_BASE_URL = "http://localhost:3000/api";

export const getStoredUserPassword = (userId: string, email?: string): string => {
  try {
    const map = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || "{}");
    if (map[userId]) return map[userId];
    if (email && map[email.toLowerCase()]) return map[email.toLowerCase()];
  } catch {
    // fallback
  }
  return "password";
};

export const setStoredUserPassword = (userId: string, newPass: string, email?: string) => {
  try {
    const map = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || "{}");
    map[userId] = newPass;
    if (email) map[email.toLowerCase()] = newPass;
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(map));
  } catch (e) {
    console.error("Failed to store user password", e);
  }
};

const getDemoUserForRole = (targetRole: UserRole): User => {
  if (targetRole === "admin") {
    return initialUsers.find((u) => u.role === "admin") || initialUsers[0];
  }
  if (targetRole === "teacher") {
    return initialUsers.find((u) => u.role === "teacher") || initialUsers[1];
  }
  return initialUsers.find((u) => u.role === "student") || initialUsers[7];
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem(ROLE_KEY) as UserRole | null;
    return savedRole || "admin";
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    const savedRole = (localStorage.getItem(ROLE_KEY) as UserRole | null) || "admin";
    return getDemoUserForRole(savedRole);
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY) || "demo_jwt_token_uninexus_2026";
  });

  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(initialStudentProfile);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(initialTeacherProfile);

  useEffect(() => {
    if (user) {
      setRole(user.role);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(ROLE_KEY, user.role);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  const switchDemoRole = useCallback((newRole: UserRole) => {
    const demoUser = getDemoUserForRole(newRole);
    setRole(newRole);
    setUser(demoUser);
    setToken(`demo_jwt_token_${newRole}_2026`);
    localStorage.setItem(ROLE_KEY, newRole);
    localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
    localStorage.setItem(TOKEN_KEY, `demo_jwt_token_${newRole}_2026`);
  }, []);

  const login = async (emailOrId: string, password?: string): Promise<{ token: string; user: User }> => {
    const query = emailOrId.toLowerCase().trim();

    // 1. Try Backend API first
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: query, password: password || "password" }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const { token: newToken, user: userData } = data;
        setToken(newToken);
        setUser(userData);
        setRole(userData.role || "student");
        return { token: newToken, user: userData };
      }
    } catch {
      // Backend not running or error - gracefully use mock user
    }

    // 2. Seamless local / demo user resolution
    let matchedUser: User | undefined;

    if (query.includes("admin")) {
      matchedUser = getDemoUserForRole("admin");
    } else if (
      query.includes("teach") ||
      query.includes("tchoutouo") ||
      query.includes("dzeufack") ||
      query.includes("kapnang") ||
      query.includes("ekity") ||
      query.includes("bengono") ||
      query.includes("tchoua")
    ) {
      matchedUser = getDemoUserForRole("teacher");
    } else if (query.includes("student")) {
      matchedUser = getDemoUserForRole("student");
    } else {
      // Check stored users first (registered students or admin-added faculty)
      let storedUsers: User[] = [];
      try {
        const raw =
          localStorage.getItem("uninexus_database_v5_users") ||
          localStorage.getItem("unisphere_database_v5_users") ||
          localStorage.getItem("uninexus_db_users");
        if (raw) storedUsers = JSON.parse(raw);
      } catch {
        // ignore
      }

      const cleanQuery = query.toLowerCase().replace(/0(?=@)/, "");
      const with0Query = query.includes("@") && !query.includes("0@") ? query.replace("@", "0@") : query;

      const matchesUser = (u: User) => {
        const uEmail = (u.email || "").toLowerCase();
        const uEmailWithout0 = uEmail.replace(/0(?=@)/, "");
        const uMatric = (u.identifier || "").toLowerCase();
        const uName = (u.name || "").toLowerCase();

        return (
          uEmail === query ||
          uEmail === cleanQuery ||
          uEmail === with0Query ||
          uEmailWithout0 === cleanQuery ||
          uMatric === query ||
          uName === query ||
          (query.length >= 4 && uName.includes(query)) ||
          (query.includes("@") && query.split("@")[0] === uEmailWithout0.split("@")[0])
        );
      };

      matchedUser = storedUsers.find(matchesUser) || initialUsers.find(matchesUser);
    }

    if (!matchedUser) {
      matchedUser = {
        id: "usr-" + Math.floor(Math.random() * 9000 + 1000),
        name: emailOrId.split("@")[0] || "Student",
        email: emailOrId.includes("@") ? emailOrId : `${emailOrId}@uninexus.edu`,
        role: "student",
        identifier: "ID-" + Math.floor(Math.random() * 9000 + 1000),
        department: "Computer Science",
        level: "HND 1",
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      };
    }

    const demoToken = `demo_jwt_token_${matchedUser.role}_${Date.now()}`;
    setToken(demoToken);
    setUser(matchedUser);
    setRole(matchedUser.role);

    if (matchedUser.role === "student") {
      setStudentProfile({
        ...matchedUser,
        currentSemester: "Semester 1 (2025/2026)",
        academicYear: "2025/2026",
        enrollmentDate: matchedUser.createdAt || new Date().toISOString().split("T")[0],
        advisorName: "Not Assigned",
        cgpa: 0.0,
        totalCreditsEarned: 0,
        attendanceRate: 0,
        activeWarnings: 0,
      });
    }

    return { token: demoToken, user: matchedUser };
  };

  const register = async (formData: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    identifier?: string;
    department?: string;
    level?: string;
    className?: string;
    phone?: string;
  }): Promise<{ token: string; user: User }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const { token: newToken, user: userData } = data;
        setStoredUserPassword(userData.id, formData.password, userData.email);
        setToken(newToken);
        setUser(userData);
        setRole(userData.role || "student");
        return { token: newToken, user: userData };
      }
    } catch {
      // Backend not running
    }

    const newUser: User = {
      id: "usr-" + Math.floor(Math.random() * 9000 + 1000),
      name: formData.name,
      email: formData.email,
      role: "student",
      identifier: formData.identifier || "ID-" + Math.floor(Math.random() * 9000 + 1000),
      department: formData.department || "Computer Science",
      level: formData.level || "HND 1",
      className: formData.className || "BA1A",
      phone: formData.phone || "",
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    try {
      const raw = localStorage.getItem("unisphere_database_v5_users");
      const currentUsers = raw ? JSON.parse(raw) : [];
      if (Array.isArray(currentUsers)) {
        currentUsers.push(newUser);
        localStorage.setItem("unisphere_database_v5_users", JSON.stringify(currentUsers));
      }
    } catch {
      // ignore
    }

    setStoredUserPassword(newUser.id, formData.password, newUser.email);
    const demoToken = `demo_jwt_token_${newUser.role}_${Date.now()}`;
    setToken(demoToken);
    setUser(newUser);
    setRole(newUser.role);

    setStudentProfile({
      ...newUser,
      currentSemester: "Semester 1 (2025/2026)",
      academicYear: "2025/2026",
      enrollmentDate: newUser.createdAt || new Date().toISOString().split("T")[0],
      advisorName: "Not Assigned",
      cgpa: 0.0,
      totalCreditsEarned: 0,
      attendanceRate: 0,
      activeWarnings: 0,
    });

    return { token: demoToken, user: newUser };
  };

  const verifyToken = useCallback(async (): Promise<boolean> => {
    if (!token) return false;
    return true;
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
        const raw = localStorage.getItem("unisphere_database_v5_users");
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            const idx = list.findIndex((u: User) => u.id === user.id || u.email === user.email);
            if (idx >= 0) {
              list[idx] = { ...list[idx], ...data };
              localStorage.setItem("unisphere_database_v5_users", JSON.stringify(list));
            }
          }
        }
      } catch (e) {
        console.error("Failed to persist user to localStorage", e);
      }
      if (user.role === "student" && studentProfile) {
        setStudentProfile({ ...studentProfile, ...data });
      } else if (user.role === "teacher" && teacherProfile) {
        setTeacherProfile({ ...teacherProfile, ...data });
      }

      // Dispatch real-time global event so DataContext and other open components reflect changes immediately
      try {
        window.dispatchEvent(
          new CustomEvent("uninexus_user_updated", {
            detail: {
              id: user.id,
              email: user.email,
              identifier: user.identifier,
              ...data,
            },
          })
        );
      } catch (e) {
        console.error("Failed to dispatch custom event", e);
      }

      // Sync avatar and profile changes to MySQL backend
      try {
        fetch(`${API_BASE_URL}/users/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ userId: user.id, email: user.email, identifier: user.identifier, ...data }),
          credentials: "include",
        }).catch(() => {});
      } catch {
        // non-fatal offline
      }
    }
  };

  const verifyCurrentPassword = (pass: string): boolean => {
    if (!user) return false;
    const current = getStoredUserPassword(user.id, user.email);
    return pass === current;
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) {
      throw new Error("No user authenticated");
    }

    if (!currentPassword || currentPassword.trim().length === 0) {
      throw new Error("Current password is required");
    }

    if (!newPassword || newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters long");
    }

    if (currentPassword === newPassword) {
      throw new Error("New password must be different from the current password");
    }

    // Attempt backend API update if running
    try {
      const response = await fetch(`${API_BASE_URL}/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          currentPassword,
          newPassword,
        }),
        credentials: "include",
      });

      if (response.ok) {
        setStoredUserPassword(user.id, newPassword, user.email);
        return true;
      } else {
        const data = await response.json().catch(() => null);
        if (data?.error) {
          throw new Error(data.error);
        }
      }
    } catch (err: any) {
      if (err.message && (err.message.toLowerCase().includes("current password") || err.message.toLowerCase().includes("incorrect"))) {
        throw err;
      }
      // Backend not running, proceed to secure local validation
    }

    // Verify current password against saved record
    const recordedPassword = getStoredUserPassword(user.id, user.email);
    if (currentPassword !== recordedPassword) {
      throw new Error("Current password is not correct. Password was not changed.");
    }

    // Verified! Update the stored password
    setStoredUserPassword(user.id, newPassword, user.email);
    return true;
  };

  const value: AuthContextType = {
    user,
    role,
    studentProfile,
    teacherProfile,
    isAuthenticated: !!user,
    token,
    login,
    register,
    logout,
    verifyToken,
    updateProfile,
    changePassword,
    verifyCurrentPassword,
    switchDemoRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
