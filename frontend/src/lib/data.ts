import { UserProfile } from "@/contexts/AuthContext";

export const statesAndDistricts: Record<string, string[]> = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "Telangana": ["Adilabad", "Hyderabad", "Karimnagar", "Khammam", "Mahbubnagar", "Medak", "Nalgonda", "Nizamabad", "Rangareddy", "Warangal"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli", "Erode", "Vellore", "Thanjavur"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli-Dharwad", "Mangalore", "Belgaum", "Gulbarga", "Bellary", "Shimoga"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Sangli"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Malappuram", "Kannur"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa", "Satna"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad", "Meerut", "Bareilly", "Aligarh", "Moradabad"],
  "Punjab": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot"],
  "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Karnal", "Hisar", "Rohtak"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Begusarai"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri"],
};

export const generateId = (role: "farmer" | "consumer"): string => {
  const prefix = role === "farmer" ? "FRM" : "CON";
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${num}`;
};

// Demo registered users for credential validation
export interface RegisteredUser extends UserProfile {
  password: string;
}

export const registeredUsers: RegisteredUser[] = [
  {
    id: "FRM-100001",
    name: "Ravi Kumar",
    phone: "9876543210",
    address: "Green Fields, Warangal",
    state: "Telangana",
    district: "Warangal",
    role: "farmer",
    farmAddress: "Green Fields Farm, Warangal",
    landSize: "5",
    primaryCrop: "Rice",
    farmingType: "Organic",
    password: "farmer123",
  },
  {
    id: "FRM-100002",
    name: "Lakshmi Devi",
    phone: "9123456780",
    address: "Sunrise Farm, Guntur",
    state: "Andhra Pradesh",
    district: "Guntur",
    role: "farmer",
    farmAddress: "Sunrise Farm, Guntur",
    landSize: "8",
    primaryCrop: "Cotton",
    farmingType: "Conventional",
    password: "farmer456",
  },
  {
    id: "CON-200001",
    name: "Amit Sharma",
    phone: "9988776655",
    address: "MG Road, Bangalore",
    state: "Karnataka",
    district: "Bangalore",
    role: "consumer",
    occupation: "Software Engineer",
    email: "amit@example.com",
    password: "consumer123",
  },
  {
    id: "CON-200002",
    name: "Priya Singh",
    phone: "9112233445",
    address: "Anna Nagar, Chennai",
    state: "Tamil Nadu",
    district: "Chennai",
    role: "consumer",
    occupation: "Teacher",
    email: "priya@example.com",
    password: "consumer456",
  },
];

// Add newly registered users at runtime
export const addRegisteredUser = (user: RegisteredUser) => {
  registeredUsers.push(user);
};
