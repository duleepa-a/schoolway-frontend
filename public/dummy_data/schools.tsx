export const schoolsData = [
  {
    Name: "St. Thomas College",
    User_ID: "SCH001",
    Email: "info@stthomas.edu",
    Address: "123 College Road, Colombo",
    Contact: "+94 11 2345678",
    Status: "Active",
    GuardianName: "Mr. Silva",
    NumberOfStudents: 1250,
    YearEstablished: 1980
  },
  {
    Name: "Royal Institute",
    User_ID: "SCH002",
    Email: "admin@royalinstitute.lk",
    Address: "45 Education Lane, Kandy",
    Contact: "+94 81 2345679",
    Status: "Active",
    GuardianName: "Mrs. Perera",
    NumberOfStudents: 950,
    YearEstablished: 1992
  },
  {
    Name: "Colombo International School",
    User_ID: "SCH003",
    Email: "office@cis.edu.lk",
    Address: "78 International Ave, Colombo",
    Contact: "+94 11 2345680",
    Status: "Active",
    GuardianName: "Dr. Jayawardena",
    NumberOfStudents: 1500,
    YearEstablished: 1985
  },
  {
    Name: "Gateway College",
    User_ID: "SCH004",
    Email: "info@gatewaycollege.lk",
    Address: "15 Education Blvd, Negombo",
    Contact: "+94 31 2345681",
    Status: "Inactive",
    GuardianName: "Mr. Fernando",
    NumberOfStudents: 1100,
    YearEstablished: 1997
  },
  {
    Name: "Asian International School",
    User_ID: "SCH005",
    Email: "contact@ais.lk",
    Address: "56 Academy Road, Galle",
    Contact: "+94 91 2345682",
    Status: "Active",
    GuardianName: "Mrs. Gunawardena",
    NumberOfStudents: 875,
    YearEstablished: 1990
  },
  {
    Name: "Lyceum International School",
    User_ID: "SCH006",
    Email: "admin@lyceuminternational.lk",
    Address: "23 School Lane, Nugegoda",
    Contact: "+94 11 2345683",
    Status: "Active",
    GuardianName: "Mr. Dissanayake",
    NumberOfStudents: 1300,
    YearEstablished: 1993
  },
  {
    Name: "British School in Colombo",
    User_ID: "SCH007",
    Email: "office@britishschool.lk",
    Address: "89 Oxford Street, Colombo",
    Contact: "+94 11 2345684",
    Status: "Active",
    GuardianName: "Mrs. Seneviratne",
    NumberOfStudents: 950,
    YearEstablished: 1994
  },
  {
    Name: "Wesley College",
    User_ID: "SCH008",
    Email: "info@wesleycollege.lk",
    Address: "67 College Road, Colombo",
    Contact: "+94 11 2345685",
    Status: "Inactive",
    GuardianName: "Mr. Rajapakse",
    NumberOfStudents: 1100,
    YearEstablished: 1874
  },
  {
    Name: "Visakha Vidyalaya",
    User_ID: "SCH009",
    Email: "office@visakha.edu.lk",
    Address: "12 Girls School Avenue, Colombo",
    Contact: "+94 11 2345686",
    Status: "Active",
    GuardianName: "Mrs. Bandara",
    NumberOfStudents: 2000,
    YearEstablished: 1917
  },
  {
    Name: "Ananda College",
    User_ID: "SCH010",
    Email: "admin@ananda.edu.lk",
    Address: "34 College Street, Colombo",
    Contact: "+94 11 2345687",
    Status: "Active",
    GuardianName: "Dr. Karunaratne",
    NumberOfStudents: 2500,
    YearEstablished: 1886
  }
];

export type SchoolData = {
  Name: string;
  User_ID: string;
  Email: string;
  Address: string;
  Contact: string;
  Status: "Active" | "Inactive";
  GuardianName: string;
  NumberOfStudents: number;
  YearEstablished: number;
};
