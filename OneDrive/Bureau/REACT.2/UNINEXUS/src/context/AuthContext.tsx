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
    department?: string;
    level?: string;
    phone?: string;
  }) => Promise<{ token: string; user: User }>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
  updateProfile: (data: Partial<User>) => void;
  changePassword?: (oldPass: string, newPass: string) => Promise<boolean>;
  switchDemoRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "uninexus_token";
const USER_KEY = "uninexus_user";
const ROLE_KEY = "uninexus_role";
const API_BASE_URL = "http://localhost:3000/api";

const getDemoUserForRole = (targetRole: UserRole): User => {
  if (targetRole === "admin") {
    return initialUsers.find((u) => u.role === "admin") || initialUsers[0];
  }
  if (targetRole === "teacher") {
    return initialUsers.find((u) => u.role === "teacher") || initialUsers[1];
  }
  return initialUsers.find((u) => u.role === "student") || initialUsers[3];
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
    } else if (query.includes("teach") || query.includes("smith") || query.includes("connor")) {
      matchedUser = getDemoUserForRole("teacher");
    } else if (query.includes("student") || query.includes("alex") || query.includes("cs2025")) {
      matchedUser = getDemoUserForRole("student");
    } else {
      matchedUser = initialUsers.find(
        (u) =>
          u.email.toLowerCase() === query ||
          u.identifier.toLowerCase() === query ||
          u.name.toLowerCase().includes(query)
      );
    }

    if (!matchedUser) {
      matchedUser = {
        id: "usr-" + Math.floor(Math.random() * 9000 + 1000),
        name: emailOrId.split("@")[0] || "Campus User",
        email: emailOrId.includes("@") ? emailOrId : `${emailOrId}@uninexus.edu`,
        role: query.includes("teach") ? "teacher" : query.includes("admin") ? "admin" : "student",
        identifier: "ID-" + Math.floor(Math.random() * 9000 + 1000),
        department: "Computer Science",
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      };
    }

    const demoToken = `demo_jwt_token_${matchedUser.role}_${Date.now()}`;
    setToken(demoToken);
    setUser(matchedUser);
    setRole(matchedUser.role);

    return { token: demoToken, user: matchedUser };
  };

  const register = async (formData: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    department?: string;
    level?: string;
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
      role: formData.role || "student",
      identifier: "ID-" + Math.floor(Math.random() * 9000 + 1000),
      department: formData.department || "Computer Science",
      level: formData.level || "HND 1",
      phone: formData.phone || "",
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    const demoToken = `demo_jwt_token_${newUser.role}_${Date.now()}`;
    setToken(demoToken);
    setUser(newUser);
    setRole(newUser.role);

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
      if (user.role === "student" && studentProfile) {
        setStudentProfile({ ...studentProfile, ...data });
      } else if (user.role === "teacher" && teacherProfile) {
        setTeacherProfile({ ...teacherProfile, ...data });
      }
    }
  };

  const changePassword = async (): Promise<boolean> => {
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
